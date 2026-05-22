import pino from 'pino';

export const createLogger = (serviceName: string) =>
  pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: { service: serviceName },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
