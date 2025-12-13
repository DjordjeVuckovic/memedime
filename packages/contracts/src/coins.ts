import {z} from "zod";
import {percentageField} from "./util.ts";

export const ModeSchema = z.enum(['random', 'prompt', 'social'])

export type Mode = z.infer<typeof ModeSchema>

export const SortBySchema = z.enum(['recent', 'relevance'])

export type SortBy = z.infer<typeof SortBySchema>


export const EmojiSchema = z.object({
  name: z.string(),
  emoji: z.string(),
  weight: z.number().default(1),
})

export const CoinCombosSchema = z.object({
  animal: EmojiSchema,
  food: EmojiSchema,
  vibe: EmojiSchema,
})
export type CoinCombos = z.infer<typeof CoinCombosSchema>

export const GenCoinReqSchema = z.object({
  mode: ModeSchema,
  walletAddress: z.string().optional(),
  prompt: z.string().optional(),
})


export const RandomCoinReqSchema = GenCoinReqSchema.extend({
  mode: z.literal('random'),
})
export type RandomCoinReq = z.infer<typeof RandomCoinReqSchema>

export const SocialCoinReqSchema = GenCoinReqSchema.extend({
  mode: z.literal('social'),
  postUrl: z.string().optional(),
  postContent: z.string().optional(),
})
export type SocialCoinReq = z.infer<typeof SocialCoinReqSchema>

export const PromptCoinReqSchema = GenCoinReqSchema.extend({
  mode: z.literal('prompt'),
  prompt: z.string(),
})
export type PromptCoinReq = z.infer<typeof PromptCoinReqSchema>

export const GenCoinReqUnionSchema = z.union([RandomCoinReqSchema, SocialCoinReqSchema, PromptCoinReqSchema])

export type GenCoinUnion = RandomCoinReq | SocialCoinReq | PromptCoinReq;

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
    mode: ModeSchema,
    combos: CoinCombosSchema.optional(),
    createdAt: z.string().optional(),
  })
  .meta({
    description: 'Schema for meme coin generation response',
  })
export type CoinResp = z.infer<typeof CoinRespSchema>

export const CoinsRespSchema = z.object(
  {
    items: CoinRespSchema.array(),
    nextCursor: z.string().optional(),
  },
)

export type CoinsResp = z.infer<typeof CoinsRespSchema>

export const SearchReqSchema = z.object({
  q: z.string().optional(),
  mode: ModeSchema.optional(),
  sortBy: SortBySchema.optional(),
  limit: z.coerce.number().optional().default(50),
  cursor: z.string().optional(),
})
