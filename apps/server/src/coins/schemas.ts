import { z } from 'zod'
import { LLMCoinRespSchema } from '../llms/schemas'
import { CoinCombosSchema } from '@memedime/contracts'

export const CoinSchema = z
  .object({
    id: z.number(),
    combos: CoinCombosSchema.optional(),
    walletAddress: z.string().optional(),
  })
  .and(LLMCoinRespSchema)

export type CoinResp = z.infer<typeof CoinSchema>
