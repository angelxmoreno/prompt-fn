import type { Eta } from 'eta';
import type { TemplateRenderer } from '../schemas.ts';

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
