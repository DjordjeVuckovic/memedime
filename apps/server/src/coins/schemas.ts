import { z } from 'zod'
import { LLMCoinRespSchema } from '../llms/schemas'
import {
  CoinCombosSchema,
  GenCoinReqSchema,
  ModeSchema,
  PromptCoinReq,
  RandomCoinReqSchema,
  SocialCoinReq,
} from '@memedime/contracts'

export const CoinSchema = z
  .object({
    id: z.number(),
    mode: ModeSchema,
    combos: CoinCombosSchema.optional(),
    walletAddress: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .and(LLMCoinRespSchema)

export type CoinResp = z.infer<typeof CoinSchema>

export const RandomCoinCombosSchema = RandomCoinReqSchema.extend({
  combos: CoinCombosSchema,
})

export type RandomCoinReq = z.infer<typeof RandomCoinCombosSchema>

export type GenReq = RandomCoinReq | SocialCoinReq | PromptCoinReq
