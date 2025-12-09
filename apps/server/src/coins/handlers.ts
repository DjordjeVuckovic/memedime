import { GenCoinResp, GenCoinReq, RandomCoinReq, CoinCombos, Mode } from './schemas'
import { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompts'
import { withRetry } from '../shared/resilience'
import { coins, ReadCoin } from './db'
import { db } from '../db'
import { spinEmojis } from './emojis'
import { CoinResp } from '../llms/schemas'
import { eq } from 'drizzle-orm'

export type GenCoinParams = {
  req: GenCoinReq,
  mode: Mode,
  llmClient: LLMClient
}
export const generateCoin = async ({req, mode, llmClient}: GenCoinParams): Promise<GenCoinResp> => {
  const combos = spinEmojis()
  const enriched: RandomCoinReq = {
    ...req,
    combos,
  }
  const response = await withRetry(
    () => llmClient.genMemeCoin(toLLMPrompt(enriched))
  )
  console.log(response)

  const id = await createDbCoin(mode, response, req.prompt, combos)
  return {
    id,
    ...response,
    combos,
  }
}

const createDbCoin = async (mode: Mode, coin: CoinResp, prompt?: string, combos?: CoinCombos) => {
  const { name, ticker, supply, tokenomics, tagline, marketing, description } = coin

  const [{ id }] = await db
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
      combos: combos ? JSON.stringify(combos) : undefined,
    })
    .returning({
      id: coins.id,
    })

  return id
}

export const getCoinById = async (id: number): Promise<ReadCoin | null> => {
  const coin = await db
    .select()
    .from(coins)
    .where(eq(coins.id, id))
    .limit(1)

  if (coin.length === 0) {
    return null
  }

  return coin[0]
}
