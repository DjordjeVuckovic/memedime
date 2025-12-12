import {z} from "zod";
import {percentageField} from "./util.ts";

export const ModeSchema = z.enum(['random', 'prompt', 'social'])

export type Mode = z.infer<typeof ModeSchema>

export const GenCoinReqSchema = z.object({
  prompt: z.string().optional(),
})

export const EmojiSchema = z.object({
  name: z.string(),
  emoji: z.string(),
})

export const CoinCombosSchema = z.object({
  animal: EmojiSchema,
  food: EmojiSchema,
  vibe: EmojiSchema,
})

export type CoinCombos = z.infer<typeof CoinCombosSchema>

export const RandomCoinReqSchema = GenCoinReqSchema.extend({
  combos: CoinCombosSchema,
})

export type GenCoinReq = z.infer<typeof GenCoinReqSchema>

export type RandomCoinReq = z.infer<typeof RandomCoinReqSchema>

export const CoinRespSchema = z
  .object({
    id: z.number(),
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
    walletAddress: z.string().optional(),
    combos: CoinCombosSchema.optional(),
  })
  .meta({
    description: 'Schema for meme coin generation response',
  })
