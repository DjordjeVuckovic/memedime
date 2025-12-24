import pino from 'pino'
import { appEnv } from './env'

const isDevelopment = appEnv.NODE_ENV !== 'production'

export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context)
}

export const logger = pino({
  level: appEnv.LOG_LEVEL,

  base: {
    env: appEnv.NODE_ENV,
    service: 'memedime-server',
    version: '1.0.0',
  },

  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,

  timestamp: pino.stdTimeFunctions.isoTime,

  redact: {
    paths: ['req.headers.authorization', '*.apiKey', '*.password'],
    remove: true,
  },

  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
})

export const LogLevel = {
  DEBUG: 'debug' as const,
  INFO: 'info' as const,
  WARN: 'warn' as const,
  ERROR: 'error' as const,
  FATAL: 'fatal' as const,
} as const

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]
