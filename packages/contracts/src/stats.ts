import { z } from 'zod'

export const GlobalStatsRespSchema = z.object({
  totalCoins: z.number(),
  coinsToday: z.number(),
  uniqueWallets: z.number(),
  totalSpins: z.number(),
  recentActivity: z.object({
    lastHour: z.number(),
    last24Hours: z.number(),
  }),
})

export type GlobalStatsResp = z.infer<typeof GlobalStatsRespSchema>
