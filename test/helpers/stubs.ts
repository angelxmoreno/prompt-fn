import type { Eta } from 'eta';
import type { Logger } from 'pino';

export type LoggerStub = {
    logger: Logger;
    childCalls: Array<Record<string, unknown>>;
};

export const createStubLogger = (): LoggerStub => {
    const childCalls: Array<Record<string, unknown>> = [];
    const stub = {
        child(bindings: Record<string, unknown>) {
            childCalls.push(bindings);
            return stub;
        },
        info: () => undefined,
        debug: () => undefined,
        error: () => undefined,
        warn: () => undefined,
        fatal: () => undefined,
        trace: () => undefined,
        silent: () => undefined,
        level: 'info',
    } as unknown as Logger;

    return { logger: stub, childCalls };
};

export type EtaStub = {
    eta: Eta;
    calls: Array<{ template: string; data: Record<string, unknown> }>;
};

export const createEtaStub = (): EtaStub => {
    const calls: EtaStub['calls'] = [];

    const eta = {
        async renderAsync(template: string, data: Record<string, unknown>) {
            calls.push({ template, data });
            return `${template}:${JSON.stringify(data)}`;
        },
    } as Eta;

    return { eta, calls };
};
