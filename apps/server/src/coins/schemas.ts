import {z} from 'zod'
import { EmojiSchema } from './emojis'
import { CoinRespSchema } from '../llms/schemas'

export const ModeSchema = z.enum(['random', 'prompt', 'social'])

export type Mode = z.infer<typeof ModeSchema>

export const GenCoinReqSchema = z.object({
  prompt: z.string().optional(),
})

export const CoinCombosSchema = z.object({
  animal: EmojiSchema,
  food: EmojiSchema,
  vibe: EmojiSchema,
})

export type CoinCombos = z.infer<typeof CoinCombosSchema>

export const RandomCoinReqSchema = GenCoinReqSchema.extend({
  combos: CoinCombosSchema
})

export type GenCoinReq = z.infer<typeof GenCoinReqSchema>

export type RandomCoinReq = z.infer<typeof RandomCoinReqSchema>

export const GenCoinRespSchema = CoinRespSchema.extend({
  id: z.number(),
  combos: CoinCombosSchema.optional()
})

export type GenCoinResp = z.infer<typeof GenCoinRespSchema>
