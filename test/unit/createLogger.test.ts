import { describe, expect, it } from 'bun:test';
import { createLogger } from '../../src/utils/createLogger.ts';
import { createStubLogger } from '../helpers/stubs.ts';

describe('createLogger', () => {
    it('reuses the provided logger when no module name is supplied', () => {
        const { logger: stub, childCalls } = createStubLogger();

        const loggerInstance = createLogger({ logger: stub });

        expect(loggerInstance).toBe(stub);
        expect(childCalls).toHaveLength(0);
    });

    it('creates a child logger when module name is provided', () => {
        const { logger: stub, childCalls } = createStubLogger();

        const loggerInstance = createLogger({ logger: stub, moduleName: 'definePrompt' });

        expect(loggerInstance).toBe(stub);
        expect(childCalls).toEqual([{ module: 'definePrompt' }]);
    });

    it('returns a functional pino logger by default', () => {
        const logger = createLogger();

        expect(typeof logger.info).toBe('function');
        expect(typeof logger.child).toBe('function');
    });
});
