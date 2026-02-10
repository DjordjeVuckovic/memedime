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
import { useWalletContext } from '@/features/wallet/components/WalletContext'

const coinKeys = {
  all: ['coins'] as const,
  lists: () => [...coinKeys.all, 'list'] as const,
  list: (query: string, mode?: Mode, sortBy?: SortBy) => [...coinKeys.lists(), { query, mode, sortBy }] as const,
  details: () => [...coinKeys.all, 'detail'] as const,
  detail: (id: number) => [...coinKeys.details(), id] as const,
}

export const useCoin = (id: number, options?: Omit<UseQueryOptions<api.CoinResp>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: coinKeys.detail(id),
    queryFn: () => api.getCoinById(id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}

export const useSearchCoins = (
  query: string,
  mode?: Mode,
  sortBy?: SortBy,
  limit: number = 50,
  options?: Omit<
    UseInfiniteQueryOptions<
      api.CoinsResp,
      Error,
      InfiniteData<api.CoinsResp, string | undefined>,
      ReturnType<typeof coinKeys.list>,
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >,
) => {
  const searchQuery = query?.trim() || ''

  return useInfiniteQuery({
    queryKey: coinKeys.list(searchQuery, mode, sortBy),
    queryFn: ({ pageParam }) => api.searchCoins(searchQuery, mode, sortBy, limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: (previousData) => previousData,
    ...options,
  })
}

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
      queryClient.invalidateQueries({ queryKey: coinKeys.lists() }).then()
      queryClient.setQueryData(coinKeys.detail(data.id), data)
    },
    ...options,
  })
}
