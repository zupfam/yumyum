import pino from 'pino';

const isDev = import.meta.env.DEV;

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  browser: {
    asObject: true,
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});

export const log = {
  debug: (event: string, method: string, metadata: Record<string, unknown> = {}) => 
    logger.debug({ event, method, ...metadata }),
  info: (event: string, method: string, metadata: Record<string, unknown> = {}) => 
    logger.info({ event, method, ...metadata }),
  warn: (event: string, method: string, metadata: Record<string, unknown> = {}) => 
    logger.warn({ event, method, ...metadata }),
  error: (event: string, method: string, metadata: Record<string, unknown> = {}) => 
    logger.error({ event, method, ...metadata }),
};

export default log;
