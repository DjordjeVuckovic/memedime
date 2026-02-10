import pino from 'pino'

export type LoggerConfig = {
  logLevel: string
  nodeEnv: string
  serviceName?: string
  serviceVersion?: string
}

export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context)
}

export const createLogger = (config: LoggerConfig) => {
  const { logLevel, nodeEnv, serviceName = 'memedime-core', serviceVersion = '1.0.0' } = config

  return pino({
    level: logLevel,

    base: {
      env: nodeEnv,
      service: serviceName,
      version: serviceVersion,
    },

    transport: nodeEnv !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            singleLine: false,
            minimumLevel: 'trace',
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
}

// Default logger instance (will be configured by consumer)
export const logger = createLogger({
  logLevel: 'info',
  nodeEnv: 'development',
})

export const LogLevel = {
  DEBUG: 'debug' as const,
  INFO: 'info' as const,
  WARN: 'warn' as const,
  ERROR: 'error' as const,
  FATAL: 'fatal' as const,
} as const

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]
