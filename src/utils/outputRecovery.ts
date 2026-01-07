import type { generateText } from 'ai';
import type { z } from 'zod';
import type { createLogger } from './createLogger.ts';

type RecoveredPart = { text?: string | null };
export type GenerationContent = Awaited<ReturnType<typeof generateText>>['content'];

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
        // when using Output.object/json/choice. We only handle that shape here.
        const content = (parsed.output as Array<{ content?: Array<{ text?: string }> }> | undefined)?.flatMap(
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
