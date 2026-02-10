import { LLMProviderSchema, type DatabaseConfig, type LLMOptions, type LoggerConfig } from '@memedime/core'
import { z } from 'zod'

export const appEnvSchema = z.object({
  PORT: z.string().optional().default('3000'),
  DB_URL: z.string().optional().default('file:./memedime.db'),
  // Turso auth token (only needed for remote/production)
  DB_AUTH_TOKEN: z.string().optional(),
  USE_WAL: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .default(false),
  LLM_PROVIDER: LLMProviderSchema.optional().default('groq'),
  LLM_MODEL_ID: z.string().optional().default('llama-3.1-8b-instant'),
  LLM_API_KEY: z.string().optional(),
  LLM_BASE_URL: z.string().optional(),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((val) => {
      return val ? val.split(',').map((x) => x.trim()) : '*'
    }),
  APP_ORIGIN: z.string().optional().default('http://localhost:1312'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).optional().default('trace'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

export type AppEnv = z.infer<typeof appEnvSchema>

// process.env works in both Bun (local) and Cloudflare Workers (production with nodejs_compat)
export const appEnv = appEnvSchema.parse(process.env)

/**
 * Convert AppEnv to core config types
 * These helper functions make the contract between server env and core explicit
 */
export const getDatabaseConfig = (env: AppEnv = appEnv): DatabaseConfig => ({
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN,
})

export const getLLMConfig = (env: AppEnv = appEnv): LLMOptions => ({
  provider: env.LLM_PROVIDER,
  modelId: env.LLM_MODEL_ID,
  apiKey: env.LLM_API_KEY,
  baseURL: env.LLM_BASE_URL,
})

export const getLoggerConfig = (env: AppEnv = appEnv): LoggerConfig => ({
  logLevel: env.LOG_LEVEL,
  nodeEnv: env.NODE_ENV,
  serviceName: 'memedime-server',
  serviceVersion: '1.0.0',
})
