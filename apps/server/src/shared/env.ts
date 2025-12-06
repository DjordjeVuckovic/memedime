import { LLMProvider } from '../llms/schemas'

export const appEnv = {
  PORT: Bun.env.PORT as string || "3000",
  DB_URL: Bun.env.DB_URL as string | "./memedime.db",
  LLM_PROVIDER: Bun.env.LLM_PROVIDER as LLMProvider || "groq",
  LLM_MODEL_ID: Bun.env.LLM_MODEL_ID as LLMProvider || "grok-4",
  LLM_API_KEY: Bun.env.LLM_API_KEY as string | undefined,
  LLM_BASE_URL: Bun.env.LLM_BASE_URL as string | undefined,
}

export type AppEnv = typeof appEnv
