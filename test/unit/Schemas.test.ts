import { describe, expect, it } from 'bun:test';
import { Eta } from 'eta';
import pino from 'pino';
import { z } from 'zod';
import { type DefinePromptConfig, DefinePromptConfigSchema } from '../../src';

describe('Schemas', () => {
    describe('DefinePromptConfigSchema', () => {
        const baseConfig: DefinePromptConfig = {
            name: 'generateUserBio',
            model: 'google:gemini-2.0-flash',
            inputSchema: z.object({ name: z.string() }),
            outputSchema: z.object({ bio: z.string() }),
            template: 'Hello {{name}}!',
        };

        it('accepts the minimal valid config', () => {
            const result = DefinePromptConfigSchema.safeParse(baseConfig);
            expect(result.success).toBeTrue();
        });

        it('rejects missing required fields', () => {
            const result = DefinePromptConfigSchema.safeParse({});
            expect(result.success).toBeFalse();
        });

        it('accepts optional fields and template functions', () => {
            const params: DefinePromptConfig = {
                ...baseConfig,
                description: 'Builds a user bio from hobbies',
                outputSchema: z.object({ bio: z.string() }),
                template: () => 'Hello {{name}}!',
                eta: new Eta(),
                logger: pino({ enabled: false }),
            };

            const { success, data } = DefinePromptConfigSchema.safeParse(params);
            expect(success).toBeTrue();
            expect(data).toMatchObject({
                name: 'generateUserBio',
                description: 'Builds a user bio from hobbies',
            });
        });
    });
});
