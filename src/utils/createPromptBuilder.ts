import type { Eta } from 'eta';
import type { TemplateRenderer } from '../schemas.ts';

/**
 * Creates a function that renders a prompt based on the provided template and options.
 *
 * @template T - The type of input data expected by the template.
 * @param template - A literal template string or a TemplateRenderer function.
 * @param eta - Optional Eta instance for rendering string templates using the Eta engine.
 * @returns A TemplateRenderer function that accepts data and returns the rendered string (or a promise when Eta is used).
 * @throws {Error} If the template type is invalid.
 */
export const createPromptBuilder = <T extends Record<string, unknown>>(
    template: string | TemplateRenderer<T> | TemplateRenderer,
    eta?: Eta
): TemplateRenderer<T> => {
    if (typeof template === 'string' && eta !== undefined) {
        return async (data: T) => eta.renderAsync(template, data);
    }

    if (typeof template === 'function') {
        return (data: T) => template(data);
    }

    if (typeof template === 'string') {
        return () => template;
    }

    throw new Error('Unable to create template renderer');
};
