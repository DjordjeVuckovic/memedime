import { CoinResp, CoinSchema } from './schemas'
import { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompts'
import { withRetry } from '../shared/resilience'
import { coins, Coin } from './db'
import { db } from '../db'
import { spinEmojis } from './emojis'
import { LLMCoinResp } from '../llms/schemas'
import { eq, sql } from 'drizzle-orm'
import { omit } from '../shared/types'
import { CoinCombos, GenCoinReq, Mode, RandomCoinReq } from '@memedime/contracts'

export type GenCoinParams = {
  req: GenCoinReq
  mode: Mode
  llmClient: LLMClient
}
export const generateCoin = async ({ req, mode, llmClient }: GenCoinParams): Promise<CoinResp> => {
  const combos = spinEmojis()
  const enriched: RandomCoinReq = {
    ...req,
    combos,
  }
  const response: LLMCoinResp = await withRetry(() => llmClient.genCoin(toLLMPrompt(enriched)))
  console.log(response)

  const id = await createDbCoin(mode, response, req.prompt, combos)
  return CoinSchema.parse({
    id,
    ...response,
    combos,
  })
}

const createDbCoin = async (mode: Mode, coin: LLMCoinResp, prompt?: string, combos?: CoinCombos) => {
  const { name, ticker, supply, tokenomics, tagline, marketing, description } = coin

  const [resp] = await db
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

  return resp?.id
}

export const getCoinById = async (id: number): Promise<CoinResp | null> => {
  const coin = await db.select().from(coins).where(eq(coins.id, id)).limit(1)

  if (!coin[0]) {
    return null
  }

  return CoinSchema.parse(mapFromDb(coin[0]))
}

export const searchCoins = async (q: string, mode?: Mode): Promise<CoinResp[]> => {
  const rankQuery = sql`
    SELECT c.id,
           c.name,
           c.ticker,
           c.tagline,
           c.description,
           c.supply,
           c.marketing,
           c.lp_burned_percentage     AS lpBurnPercentage,
           c.dev_percentage           AS devPercentage,
           c.marketing_fee_percentage AS marketingFeePercentage,
           c.community_fee_percentage AS communityFeePercentage,
           c.mode,
           c.combos,
           c.prompt,
           c.created_at               AS createdAt,
           bm25(coins_fts)            AS rank
    FROM coins c
           JOIN coins_fts fts ON c.id = fts.rowid
    WHERE coins_fts MATCH ${q} ${mode ? sql`AND c.mode = '${mode}'` : sql``}
      AND c.deleted_at IS NULL
    ORDER BY rank
    LIMIT 100;

  `

  const results = db.all<Coin>(rankQuery)

  console.log(`searchCoins found ${results.length} results for query "${q}"${mode ? ` and mode "${mode}"` : ''}`)

  return results.map(mapFromDb)
}

const mapFromDb = (coin: Coin): CoinResp =>
  CoinSchema.parse({
    ...omit(coin, ['deletedAt', 'updatedAt', 'combos']),
    combos: mapCombosFromDb(coin.combos),
    tokenomics: {
      lpBurnPercentage: coin.lpBurnPercentage,
      devPercentage: coin.devPercentage,
      marketingFeePercentage: coin.marketingFeePercentage,
      communityFeePercentage: coin.communityFeePercentage,
    },
  })


const mapCombosFromDb = (combos: string | null | undefined): CoinCombos | undefined =>
  combos ? (JSON.parse(combos) as CoinCombos) : undefined
