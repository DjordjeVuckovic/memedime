import { getDb } from '../db'
import { coins } from '../coins/db'
import { sql, and, isNull, gte, ne, count } from 'drizzle-orm'
import type { GlobalStatsResp } from '@memedime/contracts'

const INCINERATOR_ADDRESS = '1nc1nerator11111111111111111111111111111111'

export const getGlobalStats = async (): Promise<GlobalStatsResp> => {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // Total coins count
  const totalCoinsResult = await getDb()
    .select({ count: count() })
    .from(coins)
    .where(isNull(coins.deletedAt))

  const totalCoins = totalCoinsResult[0]?.count ?? 0

  // Coins today (last 24 hours)
  const coinsTodayResult = await getDb()
    .select({ count: count() })
    .from(coins)
    .where(and(isNull(coins.deletedAt), gte(coins.createdAt, oneDayAgo)))

  const coinsToday = coinsTodayResult[0]?.count ?? 0

  // Coins in last hour
  const lastHourResult = await getDb()
    .select({ count: count() })
    .from(coins)
    .where(and(isNull(coins.deletedAt), gte(coins.createdAt, oneHourAgo)))

  const lastHour = lastHourResult[0]?.count ?? 0

  // Unique wallets (excluding incinerator)
  const uniqueWalletsResult = await getDb()
    .select({ count: sql<number>`COUNT(DISTINCT ${coins.walletAddress})` })
    .from(coins)
    .where(and(isNull(coins.deletedAt), ne(coins.walletAddress, INCINERATOR_ADDRESS)))

  const uniqueWallets = uniqueWalletsResult[0]?.count ?? 0

  return {
    totalCoins,
    coinsToday,
    uniqueWallets,
    totalSpins: totalCoins, // Each coin generation = 1 spin
    recentActivity: {
      lastHour,
      last24Hours: coinsToday,
    },
  }
}
