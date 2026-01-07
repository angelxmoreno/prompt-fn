import type { z } from 'zod';
import type { DefinePromptConfigSchema } from './schemas.ts';

type SchemaType = z.infer<typeof DefinePromptConfigSchema>;

/**
 * Configuration for defining a prompt.
 *
 * @template TInputSchema - The Zod schema for the input parameters.
 * @template TOutputSchema - The Zod schema for the expected output.
 */
export type DefinePromptConfig<
    TInputSchema extends z.ZodTypeAny = z.ZodTypeAny,
    TOutputSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = Omit<SchemaType, 'inputSchema' | 'outputSchema'> & {
    /**
     * Zod schema defining the structure and validation for input parameters.
     */
    inputSchema: TInputSchema;
    /**
     * Zod schema defining the expected structure and validation for the output.
     */
    outputSchema: TOutputSchema;
};
