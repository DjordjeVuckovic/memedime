import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import * as api from '@/api/api-client.ts'
import type { Mode, SortBy } from '@memedime/contracts'
import { useWalletContext } from '@/wallet'

// Query Keys
const coinKeys = {
  all: ['coins'] as const,
  lists: () => [...coinKeys.all, 'list'] as const,
  list: (query: string, mode?: Mode, sortBy?: SortBy) => [...coinKeys.lists(), { query, mode, sortBy }] as const,
  details: () => [...coinKeys.all, 'detail'] as const,
  detail: (id: number) => [...coinKeys.details(), id] as const,
}

// Queries
export const useCoin = (id: number, options?: Omit<UseQueryOptions<api.CoinResp>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: coinKeys.detail(id),
    queryFn: () => api.getCoinById(id),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    ...options,
  })
}

/**
 * Infinite query hook for searching coins with pagination
 *
 * Returns InfiniteData<api.CoinsResp> with pages array
 * Type parameters:
 * - TQueryFnData: api.CoinsResp (what the API returns)
 * - TError: Error
 * - TData: InfiniteData<api.CoinsResp, string | undefined> (transformed data with pages)
 * - TQueryKey: ReturnType<typeof coinKeys.list>
 * - TPageParam: string | undefined (cursor)
 */
export const useSearchCoins = (
  query: string,
  mode?: Mode,
  sortBy?: SortBy,
  limit: number = 50,
  options?: Omit<
    UseInfiniteQueryOptions<
      api.CoinsResp, // TQueryFnData
      Error, // TError
      InfiniteData<api.CoinsResp, string | undefined>, // TData
      ReturnType<typeof coinKeys.list>, // TQueryKey
      string | undefined // TPageParam
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >,
) => {
  // Sanitize search query
  const searchQuery = query?.trim() || ''

  return useInfiniteQuery({
    queryKey: coinKeys.list(searchQuery, mode, sortBy),
    queryFn: ({ pageParam }) => api.searchCoins(searchQuery, mode, sortBy, limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    ...options,
  })
}

// Mutations
export const useGenerateCoin = (
  options?: Omit<
    UseMutationOptions<api.CoinResp, Error, api.RandomCoinReq | api.PromptCoinReq | api.SocialCoinReq>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient()
  const wallet = useWalletContext()

  return useMutation({
    mutationFn: (data: api.RandomCoinReq | api.PromptCoinReq | api.SocialCoinReq) => api.generateCoin({
      ...data,
      walletAddress: wallet.address || undefined,
    }),
    onSuccess: (data) => {
      // Invalidate and refetch coins list
      queryClient.invalidateQueries({ queryKey: coinKeys.lists() }).then()
      // Set the coin detail in cache
      queryClient.setQueryData(coinKeys.detail(data.id), data)
    },
    ...options,
  })
}
