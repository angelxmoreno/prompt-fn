import { describe, expect, it } from 'bun:test';
import type { LanguageModelV3GenerateResult, LanguageModelV3Usage } from '@ai-sdk/provider';
import { APICallError } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import { Eta, type TemplateFunction } from 'eta';
import { z } from 'zod';
import { definePrompt } from '../../src';

const createUsage = (): LanguageModelV3Usage => ({
    inputTokens: {
        total: 10,
        noCache: 10,
        cacheRead: 0,
        cacheWrite: 0,
    },
    outputTokens: {
        total: 5,
        text: 5,
        reasoning: 0,
    },
});

const createModelResponse = ({
    text,
    finishReason = 'stop',
}: {
    text: string;
    finishReason?: LanguageModelV3GenerateResult['finishReason']['unified'];
}): LanguageModelV3GenerateResult => ({
    content: [
        {
            type: 'text',
            text,
        },
    ],
    finishReason: {
        unified: finishReason,
        raw: finishReason,
    },
    usage: createUsage(),
    warnings: [],
});

describe('definePrompt', () => {
    it('returns structured output when the mock model responds with JSON text', async () => {
        const mockModel = new MockLanguageModelV3({
            doGenerate: async () =>
                createModelResponse({
                    text: '{"result":42}',
                }),
        });

        const sumPrompt = definePrompt({
            name: 'mocked-sum',
            model: mockModel,
            inputSchema: z.object({
                value: z.number(),
            }),
            outputSchema: z.object({
                result: z.number(),
            }),
            template: ({ value }) => `Return JSON {"result": ${value} }`,
        });

        const output = await sumPrompt({ value: 42 });

        expect(output).toEqual({ result: 42 });
        expect(mockModel.doGenerateCalls).toHaveLength(1);
    });

    it('recovers structured output when the provider does not stop cleanly', async () => {
        const mockModel = new MockLanguageModelV3({
            doGenerate: async () =>
                createModelResponse({
                    text: '{"recovered":true}',
                    finishReason: 'length',
                }),
        });

        const prompt = definePrompt({
            name: 'recovery-case',
            model: mockModel,
            inputSchema: z.object({
                flag: z.boolean(),
            }),
            outputSchema: z.object({
                recovered: z.boolean(),
            }),
            template: () => 'Return JSON {"recovered": true }',
        });

        expect(prompt({ flag: true })).resolves.toEqual({ recovered: true });
        expect(mockModel.doGenerateCalls).toHaveLength(1);
    });

    it('recovers structured output from the raw response body when an API call fails', async () => {
        const responseBody = JSON.stringify({
            output: [
                {
                    content: [
                        {
                            text: '{"value":99}',
                        },
                    ],
                },
            ],
        });

        const mockModel = new MockLanguageModelV3({
            doGenerate: async () => {
                throw new APICallError({
                    message: 'Invalid JSON response',
                    url: 'http://localhost:11434/v1/responses',
                    requestBodyValues: {},
                    responseBody,
                });
            },
        });

        const prompt = definePrompt({
            name: 'response-body-recovery',
            model: mockModel,
            inputSchema: z.object({
                any: z.string(),
            }),
            outputSchema: z.object({
                value: z.number(),
            }),
            template: () => 'Return JSON {"value": 99}',
        });

        expect(prompt({ any: 'input' })).resolves.toEqual({ value: 99 });
        expect(mockModel.doGenerateCalls).toHaveLength(1);
    });

    it('renders Eta templates when provided', async () => {
        const eta = new Eta();
        const renderCalls: Array<{ template: string | TemplateFunction; data: Record<string, unknown> }> = [];
        eta.renderAsync = (async (template: string | TemplateFunction, data: Record<string, unknown>) => {
            renderCalls.push({ template, data });
            return `Rendered for ${String((data as { name?: string }).name)}`;
        }) as typeof eta.renderAsync;
        const mockModel = new MockLanguageModelV3({
            doGenerate: async () =>
                createModelResponse({
                    text: '{"message":"Hello"}',
                }),
        });

        const prompt = definePrompt({
            name: 'eta-prompt',
            model: mockModel,
            eta,
            inputSchema: z.object({
                name: z.string(),
            }),
            outputSchema: z.object({
                message: z.string(),
            }),
            template: 'greeting.eta',
        });

        const result = await prompt({ name: 'Grace' });

        expect(result).toEqual({ message: 'Hello' });
        expect(renderCalls).toEqual([
            {
                template: 'greeting.eta',
                data: { name: 'Grace' },
            },
        ]);
    });
});
