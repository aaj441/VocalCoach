import winston from 'winston';
import { env } from './env.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export function logInfo(message: string, meta?: Record<string, unknown>) {
  logger.info(message, meta);
}

export function logError(message: string, error?: Error | unknown, meta?: Record<string, unknown>) {
  logger.error(message, { ...meta, error: error instanceof Error ? error.stack : error });
}

export function logWarn(message: string, meta?: Record<string, unknown>) {
  logger.warn(message, meta);
}

export function logDebug(message: string, meta?: Record<string, unknown>) {
  logger.debug(message, meta);
}
