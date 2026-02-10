import { z } from 'zod'
import { percentageField } from '@memedime/contracts'

export { VibeInfoSchema } from '@memedime/contracts'

export const LLMProviderSchema = z.enum([
  'xai',
  'openai',
  'ollama',
  'openrouter',
  'groq',
]).meta({ description: 'Supported LLM providers' })

export type LLMProvider = z.infer<typeof LLMProviderSchema>

export type LLMOptions = {
  provider: LLMProvider
  modelId: string
  apiKey?: string
  baseURL?: string
}

export type Prompt = {
  text: string
}

export const LLMCoinRespSchema = z
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

export type LLMCoinResp = z.infer<typeof LLMCoinRespSchema>