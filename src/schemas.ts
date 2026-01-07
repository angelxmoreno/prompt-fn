import type { LanguageModel } from 'ai';
import { Eta } from 'eta';
import type { Logger } from 'pino';
import { z } from 'zod';

/**
 * A function that renders a template using the provided input.
 *
 * @template T - The type of the input data.
 * @param input - The data to use for rendering the template.
 * @returns The rendered string or a promise that resolves to the rendered string.
 */
export type TemplateRenderer<T extends Record<string, unknown> = Record<string, unknown>> = (
    input: T
) => string | Promise<string>;

const ZodSchema = z.custom<z.ZodTypeAny>(
    (value): value is z.ZodTypeAny => value instanceof z.ZodType,
    'Expected a Zod schema'
);

const TemplateSchema = z.union([
    z.string().trim().min(1, 'Template string cannot be empty'),
    z.custom<TemplateRenderer>((value) => typeof value === 'function', 'Template must be a function'),
]);

const LanguageModelSchema = z.union([
    z.string().trim().min(1, 'Model id cannot be empty'),
    z.custom<LanguageModel>((value) => typeof value === 'object' && value !== null, 'Model instance must be an object'),
]);

const LoggerSchema = z
    .custom<Logger>(
        (value) =>
            typeof value === 'object' &&
            value !== null &&
            typeof (value as Record<string, unknown>).info === 'function' &&
            typeof (value as Record<string, unknown>).child === 'function',
        'Logger must be a pino instance'
    )
    .optional();

/**
 * Zod schema validation for prompt definitions.
 */
export const DefinePromptConfigSchema = z.object({
    name: z.string().trim().min(1, 'name is required'),
    description: z.string().trim().min(1, 'description cannot be empty').optional(),
    inputSchema: ZodSchema,
    outputSchema: ZodSchema,
    template: TemplateSchema,
    model: LanguageModelSchema,
    eta: z.instanceof(Eta).optional(),
    logger: LoggerSchema.optional(),
});
