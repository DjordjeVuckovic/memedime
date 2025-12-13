import { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompts'
import { withRetry } from '../shared/resilience'
import { coins, Coin, NewCoin } from './db'
import { db } from '../db'
import { spinEmojis } from './emojis'
import { LLMCoinResp } from '../llms/schemas'
import { eq, sql, isNull, and } from 'drizzle-orm'
import { omit } from '../shared/types'
import {
  CoinCombos,
  Mode,
  RandomCoinReq,
  SortBy,
  CoinResp,
  GenCoinUnion,
  PromptCoinReq,
  SocialCoinReq,
} from '@memedime/contracts'
import { CoinRespSchema as CoinSchema } from '@memedime/contracts'
import { buildFtsQuery } from './fts.ts'
import { GenReq } from './schemas.ts'

export type GenCoinParams = {
  req: GenCoinUnion
  llmClient: LLMClient
}
export const generateCoin = async ({ req, llmClient }: GenCoinParams): Promise<CoinResp> => {
  const { prompt, combos } = createPrompt(req)
  const response: LLMCoinResp = await withRetry(() => llmClient.genCoin(prompt))
  console.log(response)

  const id = await createDbCoin(req.mode, response, req.prompt, combos)
  return CoinSchema.parse({
    id,
    ...response,
    mode: req.mode,
    combos,
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
      throw new Error(`Invalid mode`)
  }
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
      combos: combos,
    } as NewCoin)
    .returning({
      id: coins.id,
    })

  return resp?.id
}

export const getCoinById = async (id: number): Promise<CoinResp | null> => {
  // prettier-ignore
  const coin = await db
    .select()
    .from(coins)
    .where(and(eq(coins.id, id), isNull(coins.deletedAt)))
    .limit(1)

  if (!coin[0]) {
    return null
  }

  return CoinSchema.parse(mapFromDb(coin[0]))
}
type SearchParams = {
  q?: string
  mode?: Mode
  sortBy?: SortBy
  limit: number
  cursor?: string
}

export const searchCoins = async (params: SearchParams): Promise<{ coins: CoinResp[]; nextCursor?: string }> => {
  const { q, mode, sortBy, limit, cursor } = params
  const hasSearchQuery = q && q.trim() !== '' && q !== '*'

  if (hasSearchQuery) {
    const ftsQuery = buildFtsQuery(q)

    // Build cursor conditions
    let cursorSql = sql``
    if (cursor && sortBy === 'recent') {
      const [createdAt, id] = cursor.split(':')
      cursorSql = sql` AND (c.created_at < ${createdAt} OR (c.created_at = ${createdAt} AND c.id < ${parseInt(id)}))`
    } else if (cursor) {
      cursorSql = sql` AND c.id > ${parseInt(cursor)}`
    }

    const searchQuery = sql`
      SELECT 
        c.id, c.name, c.ticker, c.tagline, c.description, c.supply,
        c.marketing, c.lp_burned_percentage AS lpBurnPercentage,
        c.dev_percentage AS devPercentage,
        c.marketing_fee_percentage AS marketingFeePercentage,
        c.community_fee_percentage AS communityFeePercentage,
        c.mode, c.combos, c.prompt, c.created_at AS createdAt,
        CASE 
          WHEN UPPER(c.ticker) = UPPER(${q}) THEN 10000
          WHEN LOWER(c.name) = LOWER(${q}) THEN 5000
          WHEN UPPER(c.ticker) LIKE UPPER(${q}) || '%' THEN 1000
          WHEN LOWER(c.name) LIKE LOWER(${q}) || '%' THEN 500
          ELSE bm25(coins_fts, 10.0, 5.0, 1.0, 1.0)
        END AS rank
      FROM coins c
      INNER JOIN coins_fts fts ON c.id = fts.rowid
      WHERE 
        coins_fts MATCH ${ftsQuery}
        AND c.deleted_at IS NULL
        ${mode ? sql`AND c.mode = ${mode}` : sql``}${cursorSql}
      ORDER BY 
        ${sortBy === 'recent' ? sql`c.created_at DESC, c.id DESC` : sql`rank DESC, c.id ASC`}
      LIMIT ${limit + 1}
    `

    const results = db.all<Coin>(searchQuery)
    const hasMore = results.length > limit
    const coins = hasMore ? results.slice(0, limit) : results

    let nextCursor: string | undefined
    if (hasMore) {
      const lastCoin = coins[coins.length - 1]!
      nextCursor = sortBy === 'recent' ? `${lastCoin.createdAt}:${lastCoin.id}` : `${lastCoin.id}`
    }

    return {
      coins: coins.map(mapFromDb),
      nextCursor,
    }
  }

  // Non-search query with cursor
  let cursorSql = sql``
  if (cursor && sortBy === 'recent') {
    const [createdAt, id] = cursor.split(':')
    cursorSql = sql` AND (created_at < ${createdAt} OR (created_at = ${createdAt} AND id < ${parseInt(id)}))`
  } else if (cursor) {
    cursorSql = sql` AND id > ${parseInt(cursor)}`
  }

  const allCoinsQuery = sql`
    SELECT 
      id, name, ticker, tagline, description, supply, marketing,
      lp_burned_percentage AS lpBurnPercentage,
      dev_percentage AS devPercentage,
      marketing_fee_percentage AS marketingFeePercentage,
      community_fee_percentage AS communityFeePercentage,
      mode, combos, prompt, created_at AS createdAt
    FROM coins
    WHERE deleted_at IS NULL
      ${mode ? sql`AND mode = ${mode}` : sql``}${cursorSql}
    ORDER BY ${sortBy === 'recent' ? sql`created_at DESC, id DESC` : sql`id ASC`}
    LIMIT ${limit + 1}
  `

  const results = db.all<Coin>(allCoinsQuery)
  const hasMore = results.length > limit
  const coins = hasMore ? results.slice(0, limit) : results

  let nextCursor: string | undefined
  if (hasMore) {
    const lastCoin = coins[coins.length - 1]!
    nextCursor = sortBy === 'recent' ? `${lastCoin.createdAt}:${lastCoin.id}` : `${lastCoin.id}`
  }

  return {
    coins: coins.map(mapFromDb),
    nextCursor,
  }
}
// const toSearchResponse = (dbCoins: CoinResp[], limit: number): CoinResp[] {
//   const hasMore = dbCoins.length > limit
//   const coins = hasMore ? dbCoins.slice(0, limit) : dbCoins
//
//   let nextCursor: string | undefined
//   if (hasMore) {
//     const lastCoin = coins[coins.length - 1]
//     nextCursor = sortBy === 'recent'
//       ? `${lastCoin.createdAt}:${lastCoin.id}`
//       : `${lastCoin.id}`
//   }
// }

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
