import { describe, expect, it } from 'bun:test';
import { createPromptBuilder } from '../../src/utils/createPromptBuilder.ts';
import { createEtaStub } from '../helpers/stubs.ts';

describe('createPromptBuilder', () => {
    it('renders string templates through Eta when provided', async () => {
        const { eta, calls } = createEtaStub();
        const render = createPromptBuilder<{ name: string }>('Hello <%= it.name %>', eta);

        const result = await render({ name: 'Ada' });

        expect(result).toBe('Hello <%= it.name %>:{"name":"Ada"}');
        expect(calls).toHaveLength(1);
        expect(calls[0]).toEqual({
            template: 'Hello <%= it.name %>',
            data: { name: 'Ada' },
        });
    });

    it('returns literal template values when Eta is absent', async () => {
        const render = createPromptBuilder<Record<string, never>>('static prompt');
        const result = await render({});
        expect(result).toBe('static prompt');
    });

    it('supports functional templates', async () => {
        const render = createPromptBuilder<{ topic: string }>((data: { topic: string }) => `Explain ${data.topic}`);
        const result = await render({ topic: 'type safety' });
        expect(result).toBe('Explain type safety');
    });
});
