import winston from 'winston';
import { config } from './env';

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, tenantId, requestId, ...meta }) => {
  const tenant = tenantId ? ` [Tenant: ${tenantId}]` : '';
  const req = requestId ? ` [Req: ${requestId}]` : '';
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}]${tenant}${req}: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: config.NODE_ENV === 'production' ? combine(timestamp(), json()) : combine(colorize(), timestamp(), customFormat),
  transports: [
    new winston.transports.Console(),
    ...(config.NODE_ENV === 'production'
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
});
