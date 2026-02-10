import type { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompts'
import { withRetry } from './resilience'
import { coins } from './db'
import type { Coin, NewCoin } from './db'
import { getDb } from './db
import { spinEmojis } from './emojis'
import type { LLMCoinResp } from '../llms/schemas'
import { eq, isNull, and } from 'drizzle-orm'
import { omit } from './types'
import { logger } from './logger'
import { ValidationError } from './errors'
import {
  type CoinCombos,
  type Mode,
  type RandomCoinReq,
  type CoinResp,
  type GenCoinUnion,
  type PromptCoinReq,
  type SocialCoinReq,
  type SearchReq,
  CoinItemSchema,
} from '@memedime/contracts'
import { CoinRespSchema as CoinSchema } from '@memedime/contracts'
import type { GenReq } from './schemas'
import type { FtsCoin } from './fts'
import { ftsSearchCoins } from './fts'

export type GenCoinParams = {
  req: GenCoinUnion
  llmClient: LLMClient
}
export const generateCoin = async ({ req, llmClient }: GenCoinParams): Promise<CoinResp> => {
  const { prompt, combos } = createPrompt(req)
  const llmCoin: LLMCoinResp = await withRetry(() => llmClient.genCoin(prompt))

  logger.info(
    {
      coinName: llmCoin.name,
      ticker: llmCoin.ticker,
      mode: req.mode,
      hasContext: !!req.prompt,
      tokenomics: llmCoin.tokenomics,
    },
    'meme coin generated successfully',
  )

  const {id, createdAt } = await createDbCoin(req.mode, llmCoin, req.prompt, combos, req.walletAddress)
  return CoinSchema.parse({
    id,
    ...llmCoin,
    mode: req.mode,
    combos,
    walletAddress: req.walletAddress,
    createdAt: new Date(createdAt).toISOString(),
  })
}

const createPrompt = (req: GenCoinUnion) => {
  switch (req.mode) {
    case 'random':
      const combos = spinEmojis()

      const rand: GenReq = {
        ...(req as RandomCoinReq),
        combos,
      }
      return {
        prompt: toLLMPrompt(rand),
        combos,
      }
    case 'prompt':
      const prompt: PromptCoinReq = {
        ...(req as PromptCoinReq),
      }
      return {
        prompt: toLLMPrompt(prompt),
      }
    case 'social':
      const social: SocialCoinReq = {
        ...(req as SocialCoinReq),
      }
      return {
        prompt: toLLMPrompt(social),
      }
    default:
      throw new ValidationError(`Invalid mode: ${req}`)
  }
}

const createDbCoin = async (mode: Mode, coin: LLMCoinResp, prompt?: string, combos?: CoinCombos, walletAddress?: string) => {
  const { name, ticker, supply, tokenomics, tagline, marketing, description } = coin

  const [resp] = await getDb()
    .insert(coins)
    .values({
      name: name,
      ticker: ticker,
      supply: supply ? String(supply) : undefined,
      lpBurnPercentage: tokenomics.lpBurnPercentage,
      devPercentage: tokenomics.devPercentage,
      marketingFeePercentage: tokenomics.marketingFeePercentage,
      communityFeePercentage: tokenomics.communityFeePercentage,
      tagline: tagline,
      marketing: marketing,
      description: description,
      prompt: prompt,
      mode: mode,
      combos: combos,
      walletAddress: walletAddress,
    } as NewCoin)
    .returning({
      id: coins.id,
      createdAt: coins.createdAt,
    })

  return {
    id: resp?.id!,
    createdAt: resp?.createdAt!,
  }
}

export const getCoinById = async (id: number): Promise<CoinResp | null> => {
  // prettier-ignore
  const coin = await getDb()
    .select()
    .from(coins)
    .where(and(eq(coins.id, id), isNull(coins.deletedAt)))
    .limit(1)

  if (!coin[0]) {
    return null
  }

  return CoinSchema.parse(mapFromDb(coin[0]))
}

export const searchCoins = (req: SearchReq) => {
  return ftsSearchCoins({
    ...req,
    mapFn: (coin: FtsCoin) => CoinItemSchema.parse(coin),
  })
}

const mapFromDb = (coin: Coin): CoinResp =>
  CoinSchema.parse({
    ...omit(coin, ['createdAt', 'deletedAt', 'updatedAt', 'combos']),
    combos: mapCombosFromDb(coin.combos),
    tokenomics: {
      lpBurnPercentage: coin.lpBurnPercentage,
      devPercentage: coin.devPercentage,
      marketingFeePercentage: coin.marketingFeePercentage,
      communityFeePercentage: coin.communityFeePercentage,
    },
    createdAt: new Date(coin.createdAt).toISOString(),
  })

const mapCombosFromDb = (combos: unknown): CoinCombos | undefined => {
  if (!combos) {
    return undefined
  }

  if (typeof combos === 'string') {
    return JSON.parse(combos)
  }

  return combos as CoinCombos
}
