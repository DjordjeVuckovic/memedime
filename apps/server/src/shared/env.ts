import { LLMProvider } from '../llms/schema'

export const appEnv = {
  PORT: process.env.PORT as string || "3000",
  DATABASE_URL: process.env.DATABASE_URL as string | undefined,
  LLM_PROVIDER: process.env.LLM_PROVIDER as LLMProvider || "groq",
  LLM_MODEL_ID: process.env.LLM_MODEL_ID as LLMProvider || "grok-4",
  LLM_API_KEY: process.env.LLM_API_KEY as string | undefined,
  LLM_BASE_URL: process.env.LLM_BASE_URL as string | undefined,
}

export type TEnv = typeof appEnv
