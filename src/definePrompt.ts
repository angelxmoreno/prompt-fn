import { APICallError, type FlexibleSchema, generateText, Output } from 'ai';
import type { z } from 'zod';
import { DefinePromptConfigSchema } from './schemas.ts';
import type { DefinePromptConfig } from './types.ts';
import { createLogger } from './utils/createLogger.ts';
import { createPromptBuilder } from './utils/createPromptBuilder.ts';
import { recoverFromContent, recoverFromResponseBody } from './utils/outputRecovery.ts';

type GenerationResult = Awaited<ReturnType<typeof generateText>>;

/**
 * Defines a strongly-typed AI prompt function using Zod schemas for input and output validation.
 *
 * @template TInputSchema - The Zod schema for validation of the prompt input parameters.
 * @template TOutputSchema - The Zod schema for validation of the structured output.
 * @param params - Configuration object for the prompt. Includes the prompt name/description, input/output schemas, template, model, optional Eta instance, and logger.
 * @returns An async function that accepts valid input, sends the prompt to the AI model, and returns the validated structured output.
 * @throws {z.ZodError} If input validation fails.
 * @throws {APICallError} If the AI model call fails and recovery is not possible.
 * @throws {Error} If output validation or parsing fails and recovery is not possible.
 */
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
            if (APICallError.isInstance(error)) {
                const recovered = recoverFromResponseBody<OutputType>({
                    responseBody: error.responseBody,
                    schema: outputSchema,
                    logger,
                    name,
                });

                if (recovered !== null) {
                    return recovered;
                }

                logger.info({ responseBody: error.responseBody });
            }

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
                content: generation.content?.map((part) =>
                    'text' in part && typeof part.text === 'string' ? { text: part.text } : { text: null }
                ),
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
