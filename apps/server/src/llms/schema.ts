import { z } from 'zod'

// prettier-ignore
export type LLMProvider =
  | 'xai'
  | 'openai'
  | 'ollama'
  | 'openrouter'
  | 'groq';

export type LLMOptions = {
  provider: LLMProvider
  modelId: string
  apiKey?: string
  baseURL?: string
}

export type LLMPrompt = {
  text: string
}

export const LLMRespSchema = z.object({
  text: z.string(),
  streaming: z.boolean().optional(),
})

export type LLMResponse = z.infer<typeof LLMRespSchema>

export const MemeCoinResponseSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  tagline: z.string(),
  concept: z.string().optional(),
  supply: z.string().optional(),
  tokenomics: z.object({
    lpBurnPercentage: z.number().optional(),
    developerFeePercentage: z.number().optional(),
    marketingFeePercentage: z.number().optional(),
    communityFeePercentage: z.number().optional(),
  }),
  marketing: z.string().optional(),
})
