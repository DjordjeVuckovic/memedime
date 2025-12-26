import { type CoinItem, CoinResp, type CoinsResp, Mode, SearchReqSchema, SortBy } from '@memedime/contracts'
import { getDb } from '../db'
import { Coin, coins } from './db.ts'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { decodeCursor, encodeCursor } from '../shared/pagination.ts'
import { logger } from '../shared/logger'

export const buildFtsMatch = (query: string): string => {
  const term = query.trim().toLowerCase()

  if (term.length <= 3) {
    return `${term}*`
  }

  if (term.length <= 5 && /^[a-z0-9]+$/i.test(term)) {
    return `{name ticker tagline}: ${term}* OR ${term}`
  }

  return `${term}* OR ${term}`
}

export type FtsCoin = Pick<Coin, 'id' | 'mode' | 'name' | 'description' | 'tagline' | 'ticker' | 'walletAddress'> & {
  rank: number
  createdAt: string
}

type MapFn = (coin: FtsCoin) => CoinItem
type SearchParams = z.infer<typeof SearchReqSchema> & { mapFn: MapFn }

export const ftsSearchCoins = async (params: SearchParams): Promise<CoinsResp> => {
  const start = Date.now()
  const { q, mode, sortBy, limit, cursor } = params
  const hasSearchQuery = q && q.trim() !== '' && q !== '*'

  logger.debug(
    {
      query: q,
      mode,
      sortBy,
      limit,
      hasCursor: !!cursor,
      hasSearchQuery,
    },
    'Executing FTS search',
  )

  if (hasSearchQuery) {
    const ftsQuery = buildFtsMatch(q)

    const cursorSql = buildCursorSql(cursor, sortBy)
    const countQuery = sql`
        SELECT count(*) as count
        FROM coins c
               INNER JOIN coins_fts fts ON c.id = fts.rowid
        WHERE
          coins_fts MATCH ${ftsQuery}
          AND c.deleted_at IS NULL
          ${mode ? sql`AND c.mode = ${mode}` : sql``}${cursorSql}
    `

    // Execute count query
    const countResult = await getDb().all<{ count: number }>(countQuery)
    const count = Number(countResult[0]?.count) || 0

    if (!count) {
      return { items: [] }
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

    // Execute search query
    const results = await getDb().all<FtsCoin>(searchQuery)

    const response = toResponse(params, results, count)

    const duration = Date.now() - start
    logger.info(
      {
        query: q,
        resultCount: response.items.length,
        duration,
        hasMore: !!response.nextCursor,
        searchType: 'fts',
      },
      'FTS search completed',
    )

    return response
  }

  const cursorSql = buildCursorSql(cursor, sortBy)

  const allCoinsQuery = sql`
    SELECT
      c.id,
      c.name,
      c.ticker,
      c.tagline,
      c.description,
      c.wallet_address as walletAddress,
      c.created_at AS createdAt,
      c.mode
    FROM coins c
    WHERE deleted_at IS NULL
      ${mode ? sql`AND c.mode = ${mode}` : sql``}${cursorSql}
    ORDER BY ${sortBy === 'recent' ? sql`c.created_at DESC, c.id DESC` : sql`c.id ASC`}
    LIMIT ${limit + 1}
  `

  // Get count and results
  const countQuery = sql`SELECT count(*) as count FROM coins WHERE deleted_at IS NULL ${mode ? sql`AND mode = ${mode}` : sql``}`
  const countResult = await getDb().all<{ count: number }>(countQuery)
  const count = Number(countResult[0]?.count) || 0

  const results = await getDb().all<FtsCoin>(allCoinsQuery)

  const response = toResponse(params, results, count)

  const duration = Date.now() - start
  logger.info(
    {
      query: q,
      resultCount: response.items.length,
      duration,
      hasMore: !!response.nextCursor,
      searchType: 'all',
    },
    'FTS search completed',
  )

  return response
}

const buildCursorSql = (cursor: string | undefined, sortBy: SortBy) => {
  if (!cursor) {
    return sql``
  }

  const { id, date } = decodeCursor(cursor)

  if (sortBy === 'recent') {
    return sql`AND (c.created_at < ${date} OR (c.created_at = ${date} AND c.id < ${id}))`
  }
  return sql`AND c.id > ${id}`
}

const toResponse = (params: SearchParams, items: FtsCoin[], total?: number) => {
  if (!items.length) {
    return { items: [] }
  }
  const { sortBy, limit, mapFn } = params

  const hasMore = items.length > limit
  const coins = hasMore ? items.slice(0, limit) : items

  if (!hasMore) {
    return {
      items: coins.map(mapFn),
    }
  }

  const last = coins[coins.length - 1]!
  const nextCursor = sortBy === 'recent' ? encodeCursor(last.id, last.createdAt) : encodeCursor(last.id)

  return {
    items: coins.map(mapFn),
    nextCursor,
    total,
  }
}
