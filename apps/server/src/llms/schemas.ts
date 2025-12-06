import { z } from 'zod'
import { percentageField } from '../shared/zod'

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

export type Prompt = {
  text: string
}

export const CoinRespSchema = z
  .object({
    name: z.string(),
    ticker: z.string(),
    tagline: z.string(),
    description: z.string().optional(),
    supply: z.preprocess(
      (val) => (typeof val === 'number' ? val.toString() : val),
      z.union([z.string(), z.number()]).optional(),
    ),
    marketing: z.string().optional(),
    tokenomics: z.object({
      lpBurnPercentage: percentageField,
      devPercentage: percentageField,
      marketingFeePercentage: percentageField,
      communityFeePercentage: percentageField,
    }),
  })
  .meta({
    description: 'Schema for meme coin generation response',
  })

export type CoinResp = z.infer<typeof CoinRespSchema>

export const PersonaSchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .meta({ description: 'Schema for LLM persona' })
