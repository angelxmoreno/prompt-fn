import type { generateText } from 'ai';
import type { z } from 'zod';
import type { createLogger } from './createLogger.ts';

export type GenerationContent = Awaited<ReturnType<typeof generateText>>['content'];

export const recoverFromContent = <OutputType>({
    content,
    schema,
    logger,
    name,
}: {
    content: GenerationContent;
    schema: z.ZodTypeAny;
    logger: ReturnType<typeof createLogger>;
    name: string;
}): OutputType | null => {
    if (!content?.length) {
        return null;
    }

    const textBlob = content
        .map((part) => ('text' in part ? part.text : null))
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
