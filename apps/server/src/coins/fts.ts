import { type CoinItem, CoinResp, type CoinsResp, Mode, SearchReqSchema, SortBy } from '@memedime/contracts'
import { db } from '../db'
import { Coin } from './db.ts'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

export const buildFtsQuery = (query: string): string => {
  const term = query.trim().toLowerCase()

  if (term.length <= 3) {
    return `${term}*`
  }

  if (term.length <= 5 && /^[a-z0-9]+$/i.test(term)) {
    return `{name ticker tagline description}: ${term}* OR ${term}`
  }

  return `${term}* OR ${term}`
}

export type FtsCoin = Pick<Coin, 'id' | 'mode' | 'name' | 'description' | 'tagline' | 'ticker' | 'createdAt' | 'walletAddress'> & {
  rank: number
}

type SearchParams = z.infer<typeof SearchReqSchema> & { mapFn: (coin: FtsCoin) => CoinItem }


export const ftsSearchCoins = async (params: SearchParams): Promise<CoinsResp> => {
  const { q, mode, sortBy, limit, cursor, mapFn } = params
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
        c.id,
        c.name,
        c.ticker,
        c.tagline,
        c.description,
        c.mode,
        c.wallet_address as walletAddress,
        c.created_at AS createdAt,
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

    const results = db.all<FtsCoin>(searchQuery)
    const hasMore = results.length > limit
    const coins = hasMore ? results.slice(0, limit) : results

    let nextCursor: string | undefined
    if (hasMore) {
      const lastCoin = coins[coins.length - 1]!
      nextCursor = sortBy === 'recent' ? `${lastCoin.createdAt}:${lastCoin.id}` : `${lastCoin.id}`
    }

    return {
      items: coins.map(mapFn),
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
      id, 
      name,
      ticker,
      tagline,
      description,
      wallet_address as walletAddress,
      created_at AS createdAt,
      mode
    FROM coins
    WHERE deleted_at IS NULL
      ${mode ? sql`AND mode = ${mode}` : sql``}${cursorSql}
    ORDER BY ${sortBy === 'recent' ? sql`created_at DESC, id DESC` : sql`id ASC`}
    LIMIT ${limit + 1}
  `

  const results = db.all<FtsCoin>(allCoinsQuery)
  const hasMore = results.length > limit
  const coins = hasMore ? results.slice(0, limit) : results

  let nextCursor: string | undefined
  if (hasMore) {
    const lastCoin = coins[coins.length - 1]!
    nextCursor = sortBy === 'recent' ? `${lastCoin.createdAt}:${lastCoin.id}` : `${lastCoin.id}`
  }

  return {
    items: coins.map(mapFn),
    nextCursor,
  }
}
