import type { z } from 'zod';
import type { DefinePromptConfigSchema } from './schemas.ts';

type SchemaType = z.infer<typeof DefinePromptConfigSchema>;

export type DefinePromptConfig<
    TInputSchema extends z.ZodTypeAny = z.ZodTypeAny,
    TOutputSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = Omit<SchemaType, 'inputSchema' | 'outputSchema'> & {
    inputSchema: TInputSchema;
    outputSchema: TOutputSchema;
};
