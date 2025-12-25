import { LLMProviderSchema } from '../llms/schemas'
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
  LLM_MODEL_ID: z.string().optional().default('grok-4'),
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

export const appEnv = appEnvSchema.parse(process.env)
