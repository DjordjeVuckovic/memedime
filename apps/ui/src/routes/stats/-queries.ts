import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import * as api from '@/api/api-client'

// Query Keys
export const statsKeys = {
  all: ['stats'] as const,
  global: () => [...statsKeys.all, 'global'] as const,
  recentCoins: (limit: number) => [...statsKeys.all, 'recent', limit] as const,
}

export const useGlobalStats = (
  options?: Omit<UseQueryOptions<api.GlobalStatsResp>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: statsKeys.global(),
    queryFn: () => api.getGlobalStats(),
    staleTime: 60_000, // Consider stats fresh for 1 minute
    refetchInterval: 60_000, // Auto-refetch every 1 minute for live feel
    placeholderData: (previousData) => previousData,
    ...options,
  })
}

export const useRecentCoins = (
  limit: number = 3,
  options?: Omit<UseQueryOptions<api.CoinsResp>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: statsKeys.recentCoins(limit),
    queryFn: () => api.getRecentCoins(limit),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000,
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
