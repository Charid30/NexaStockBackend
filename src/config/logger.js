// src/config/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename:    'logs/nexastock-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '30d',
      maxSize:     '20m',
    }),
  ],
});

module.exports = logger;
