import { type FlexibleSchema, generateText, Output } from 'ai';
import type { z } from 'zod';
import { DefinePromptConfigSchema } from './schemas.ts';
import type { DefinePromptConfig } from './types.ts';
import { createLogger } from './utils/createLogger.ts';
import { createPromptBuilder } from './utils/createPromptBuilder.ts';
import { recoverFromContent } from './utils/recoverFromContent.ts';

type GenerationResult = Awaited<ReturnType<typeof generateText>>;

export const definePrompt = <
    TInputSchema extends z.ZodType<Record<string, unknown>>,
    TOutputSchema extends z.ZodTypeAny,
>(
    params: DefinePromptConfig<TInputSchema, TOutputSchema>
) => {
    const config = DefinePromptConfigSchema.parse(params) as DefinePromptConfig<TInputSchema, TOutputSchema>;
    const { name, description, inputSchema, outputSchema, template, eta, model } = config;

    const logger = createLogger({
        logger: config.logger,
        moduleName: name,
    });

    type InputType = z.infer<TInputSchema>;
    type OutputType = z.infer<TOutputSchema>;

    logger.debug(
        {
            name,
            description,
            model,
            useEta: !!eta,
            template,
            inputSchema,
            outputSchema,
        },
        'creating a prompt function'
    );

    const renderPrompt = createPromptBuilder<InputType>(template, eta);

    const fn = async (data: InputType): Promise<OutputType> => {
        logger.debug({ name, data }, 'validating prompt input');
        const parsed = inputSchema.parse(data);

        logger.debug({ name, parsed }, 'input validated');
        const prompt = await renderPrompt(parsed);
        logger.debug({ name, prompt }, 'prompt rendered');

        const schema = outputSchema as FlexibleSchema<OutputType>;
        let generation: GenerationResult;

        try {
            generation = await generateText({
                maxRetries: 0,
                model,
                prompt,
                output: Output.object<OutputType>({
                    schema,
                }),
            });
        } catch (error) {
            logger.error(
                {
                    errorName: (error as { name?: string }).name,
                },
                'Unable to generate response'
            );
            throw error;
        }

        logger.debug({ name, output: generation }, 'model call succeeded');

        try {
            return generation.output as OutputType;
        } catch (error) {
            const recovered = recoverFromContent<OutputType>({
                content: generation.content,
                logger,
                name,
                schema: outputSchema,
            });

            if (recovered !== null) {
                return recovered;
            }

            logger.error(
                {
                    errorName: (error as { name?: string }).name,
                    content: generation.content,
                },
                'Unable to read structured output'
            );

            throw error;
        }
    };

    logger.debug({ name }, 'prompt function created');

    return fn;
};
