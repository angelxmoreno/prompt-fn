import pino, { type Logger } from 'pino';
import pinoPretty from 'pino-pretty';

interface CreateLoggerParams {
    logger?: Logger;
    moduleName?: string;
}

export const createLogger = (params: CreateLoggerParams = {}): Logger => {
    const logger = params.logger ?? pino(pinoPretty());
    const moduleName = params.moduleName;
    return moduleName ? logger.child({ module: moduleName }) : logger;
};
