import { GenCoinResp, GenCoinReq, RandomCoinReq, CoinCombos, Mode } from './schemas'
import { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompts'
import { withRetry } from '../shared/resilience'
import { coins } from './db'
import { db } from '../db'
import { spinEmojis } from './emojis'
import { CoinResp } from '../llms/schemas'

export const generateCoin = async (req: GenCoinReq, llmClient: LLMClient): Promise<GenCoinResp> => {
  const combos = spinEmojis()
  const enriched: RandomCoinReq = {
    ...req,
    combos
  }
  const response = await withRetry(
    () => llmClient.genMemeCoin(toLLMPrompt(enriched))
  )
  console.log(response)

  const id = await createDbCoin('random', response, combos)
  return {
    id,
    ...response,
    combos
  }
}


const createDbCoin = async (mode: Mode, coin: CoinResp, combos?: CoinCombos) => {
  const {name, ticker, supply, tokenomics, tagline, marketing, description} = coin

  const [{id}] = await db.insert(coins).values({
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
    mode: mode,
    combos: combos ? JSON.stringify(combos) : undefined,
  }).returning({
    id: coins.id
  })

  return id
}
