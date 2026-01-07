import type { generateText } from 'ai';
import type { z } from 'zod';
import type { createLogger } from './createLogger.ts';

interface RecoveredPart {
    text?: string | null;
}

/**
 * Type representing the content returned by the AI `generateText` function.
 */
export type GenerationContent = Awaited<ReturnType<typeof generateText>>['content'];

/**
 * Attempts to recover structured output from raw content parts.
 *
 * @template OutputType - The expected type of the output.
 * @param params - The parameters for recovery.
 * @param params.content - The list of content parts to recover from.
 * @param params.schema - The Zod schema to validate the recovered data against.
 * @param params.logger - The logger instance for recording recovery attempts and errors.
 * @param params.name - The name of the prompt/operation context.
 * @returns The parsed and validated output if successful, otherwise `null`.
 */
export const recoverFromContent = <OutputType>({
    content,
    schema,
    logger,
    name,
}: {
    content?: RecoveredPart[] | null;
    schema: z.ZodTypeAny;
    logger: ReturnType<typeof createLogger>;
    name: string;
}): OutputType | null => {
    if (!content?.length) {
        return null;
    }

    const textBlob = content
        .map((part) => part.text ?? null)
        .filter((text): text is string => Boolean(text))
        .join('\n')
        .trim();

    if (!textBlob) {
        return null;
    }

    try {
        const parsed = JSON.parse(textBlob);
        const coerced = schema.parse(parsed) as OutputType;
        logger.warn({ name }, 'Recovered structured output from raw model content');
        return coerced;
    } catch (parseError) {
        logger.warn({ name, error: parseError }, 'Failed to recover structured output from raw model content');
        return null;
    }
};

/**
 * Attempts to recover structured output from a raw response body string.
 *
 * @template OutputType - The expected type of the output.
 * @param params - The parameters for recovery.
 * @param params.responseBody - The raw response body string.
 * @param params.schema - The Zod schema to validate the recovered data against.
 * @param params.logger - The logger instance for recording recovery attempts and errors.
 * @param params.name - The name of the prompt/operation context.
 * @returns The parsed and validated output if successful, otherwise `null`.
 */
export const recoverFromResponseBody = <OutputType>({
    responseBody,
    schema,
    logger,
    name,
}: {
    responseBody?: string;
    schema: z.ZodTypeAny;
    logger: ReturnType<typeof createLogger>;
    name: string;
}): OutputType | null => {
    if (!responseBody) {
        return null;
    }

    try {
        const parsed = JSON.parse(responseBody);
        // Structured output from ai@6 generateText emits:
        // { output: [{ content: [{ text: '...' }, ...] }, ...] }
        // when using Output.object/json/choice. See AI SDK docs for LanguageModelV3.
        const content = (parsed.output as { content?: Array<{ text?: string }> }[] | undefined)?.flatMap(
            (message) => message.content ?? []
        );

        if (!content?.length) {
            return null;
        }

        return recoverFromContent({
            content: content.map((part) => ({ text: part.text })),
            schema,
            logger,
            name,
        });
    } catch (error) {
        logger.warn({ name, error }, 'Failed to parse response body for fallback recovery');
        return null;
    }
};
