import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSearchCoins } from '@/routes/coins/-queries'
import { useDebounce } from '@/hooks/useDebounce'
import type { Mode } from '@memedime/contracts'

interface UseCoinSearchParams {
  initialQuery?: string
  initialMode?: Mode | null
  initialSortBy?: 'recent' | 'relevance'
}

export function useCoinSearch({
  initialQuery = '',
  initialMode = null,
  initialSortBy = 'recent',
}: UseCoinSearchParams = {}) {
  const navigate = useNavigate({ from: '/coins' })

  const [localSearchQuery, setLocalSearchQuery] = useState(initialQuery)
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  // Sync local state with URL params on initial load
  useEffect(() => {
    setLocalSearchQuery(initialQuery)
  }, [initialQuery])

  // Update URL when debounced value changes (prevents excessive navigation)
  useEffect(() => {
    if (debouncedSearchQuery !== initialQuery) {
      navigate({
        search: (prev) => ({
          ...prev,
          q: debouncedSearchQuery || undefined,
        }),
      })
    }
  }, [debouncedSearchQuery, initialQuery, navigate])

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchCoins(initialQuery, initialMode ?? undefined, initialSortBy)

  // Flatten pages into single array
  const coins = useMemo(() => {
    return data?.pages?.flatMap((page) => page.items) ?? []
  }, [data?.pages])

  const isDebouncing = localSearchQuery !== debouncedSearchQuery

  // Update multiple search params at once
  const updateSearch = useCallback(
    (updates: { q?: string; mode?: Mode | null; sortBy?: 'recent' | 'relevance' }) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
          mode: updates.mode === null ? undefined : updates.mode,
        }),
      })
    },
    [navigate],
  )

  return {
    coins,
    isLoading,
    isError,
    error,
    localSearchQuery,
    setLocalSearchQuery,
    isDebouncing,
    updateSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
