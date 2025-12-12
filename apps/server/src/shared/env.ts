import { LLMProvider, LLMProviderSchema } from '../llms/schemas'
import { z } from 'zod'

export const appEnvSchema = z.object({
  PORT: z.string().optional().default('3000'),
  DB_URL: z.string().optional().default('./memedime.db'),
  USE_WAL: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .default(false),
  LLM_PROVIDER: LLMProviderSchema.optional().default('groq'),
  LLM_MODEL_ID: z.string().optional().default('grok-4'),
  LLM_API_KEY: z.string().optional(),
  LLM_BASE_URL: z.string().optional(),
})

export const appEnv = appEnvSchema.parse(Bun.env)
