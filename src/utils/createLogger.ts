import pino, { type Logger } from 'pino';
import pinoPretty from 'pino-pretty';

/**
 * Parameters for creating a logger instance.
 */
interface CreateLoggerParams {
    /**
     * Optional existing pino Logger instance to wrap or use.
     * If not provided, a new pino logger with pino-pretty will be created.
     */
    logger?: Logger;
    /**
     * Optional module name to attach to the logger context.
     * If provided, a child logger with `{ module: moduleName }` will be returned.
     */
    moduleName?: string;
}

/**
 * Creates or configures a pino Logger instance.
 *
 * @param params - Configuration parameters for the logger.
 * @returns A pino Logger instance, optionally configured as a child logger with a module name.
 */
export const createLogger = (params: CreateLoggerParams = {}): Logger => {
    const logger = params.logger ?? pino(pinoPretty());
    const moduleName = params.moduleName;
    return moduleName ? logger.child({ module: moduleName }) : logger;
};
