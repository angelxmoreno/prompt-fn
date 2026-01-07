import { describe, expect, it } from 'bun:test';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ai-sdk-ollama';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { z } from 'zod';
import { type DefinePromptConfig, definePrompt } from '../../src';

const renderer = (input: Record<string, unknown>) => {
    const number1 = input.number1 as number;
    const number2 = input.number2 as number;
    return `Answer this math question:  what is ${number1} + ${number2}`;
};

describe('definePrompt integration', () => {
    describe('using string templates', () => {
        const inputSchema = z.object({
            number1: z.number().min(1),
            number2: z.number().min(1),
        });
        const outputSchema = z
            .object({
                answer: z.number(),
            })
            .extend(inputSchema.shape);
        const logger = pino(pinoPretty());
        logger.level = 'error';
        const params: DefinePromptConfig<typeof inputSchema, typeof outputSchema> = {
            name: 'Adder Prompt',
            description: 'prompt for adding',
            model: 'placeholder',
            template: renderer,
            inputSchema,
            outputSchema,
            logger,
        };

        const dataObj = {
            number1: 3,
            number2: 7,
        };

        const expectedResponseObj = {
            answer: dataObj.number1 + dataObj.number2,
            ...dataObj,
        };

        describe('Using Ollama sdk', () => {
            it('returns a response object', async () => {
                const ollama = createOllama({
                    baseURL: 'http://127.0.0.1:11434',
                });
                const ollamaModel = ollama('gemma3:270m');

                const promptFn = definePrompt<typeof inputSchema, typeof outputSchema>({
                    ...params,
                    model: ollamaModel,
                });
                const response = await promptFn(dataObj);
                expect(response).toMatchObject(expectedResponseObj);
            }, 10_000);
        });
        describe('Using Google Gemini', () => {
            it('returns a response object', async () => {
                const googleModel = google('gemini-flash-lite-latest');

                const promptFn = definePrompt<typeof inputSchema, typeof outputSchema>({
                    ...params,
                    model: googleModel,
                });
                const response = await promptFn(dataObj);
                expect(response).toMatchObject(expectedResponseObj);
            }, 10_000);
        });

        describe('Using Ollama as OpenAi', () => {
            it('returns a response object', async () => {
                const ollama2 = createOpenAI({
                    apiKey: 'ollama',
                    baseURL: 'http://127.0.0.1:11434/v1',
                });

                const ollamaModel2 = ollama2('gemma3:270m');

                const promptFn = definePrompt<typeof inputSchema, typeof outputSchema>({
                    ...params,
                    model: ollamaModel2,
                });
                const response = await promptFn(dataObj);
                expect(response).toMatchObject(expectedResponseObj);
            }, 10_000);
        });
    });
});
