import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchReqSchema } from '@memedime/contracts'
import { CoinsSearchBar } from '@/features/coins/components/CoinsSearchBar'
import { CoinsModeFilter } from '@/features/coins/components/CoinsModeFilter'
import { CoinsSortOptions } from '@/features/coins/components/CoinsSortOptions'
import { CoinsGrid } from '@/features/coins/components/CoinsGrid'
import { LoadMoreButton } from '@/features/coins/components/LoadMoreButton'
import { useCoinSearch } from '@/features/coins/hooks/useCoinSearch'
import { ErrorPage } from '@/components/ErrorPage'

const CoinsSearchSchema = SearchReqSchema.omit({
  limit: true,
  cursor: true,
})

type CoinsSearch = z.infer<typeof CoinsSearchSchema>

export const Route = createFileRoute('/coins/')({
  validateSearch: (search: Record<string, unknown>): CoinsSearch => {
    return CoinsSearchSchema.parse(search)
  },
  component: CoinsCollectionPage,
  errorComponent: ({ error }) => (
    <ErrorPage
      title="INVALID SEARCH PARAMETERS"
      message={
        error instanceof z.ZodError
          ? `Invalid search parameters: ${error.issues.map((i) => i.message).join(', ')}`
          : 'The search parameters you provided are not valid. Please try again.'
      }
      errorCode="INVALID_SEARCH"
      showBackButton={true}
      showHomeButton={true}
    />
  ),
})

function CoinsCollectionPage() {
  const searchParams = Route.useSearch()
  const searchQuery = searchParams.q ?? ''
  const filterMode = searchParams.mode ?? null
  const sortBy = searchParams.sortBy ?? 'recent'

  const {
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
  } = useCoinSearch({
    initialQuery: searchQuery,
    initialMode: filterMode,
    initialSortBy: sortBy,
  })

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl font-black mb-6 uppercase tracking-tight">
            <span className="inline-block bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-grow">
              COIN VAULT
            </span>
          </h1>
          <p className="text-2xl text-white/70 font-bold font-mono">
            {isLoading ? 'LOADING...' : `${coins.length} LEGENDARY COINS`}
          </p>
        </div>

        <CoinsSearchBar value={localSearchQuery} onChange={setLocalSearchQuery} isDebouncing={isDebouncing} />

        <CoinsModeFilter currentMode={filterMode} onModeChange={(mode) => updateSearch({ mode })} />

        <CoinsSortOptions currentSort={sortBy} onSortChange={(sortBy) => updateSearch({ sortBy })} />

        <CoinsGrid
          coins={coins}
          isLoading={isLoading}
          isError={isError}
          error={error}
          filterMode={filterMode}
        />

        {hasNextPage && !isLoading && !isError && coins.length > 0 && (
          <LoadMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage} isLoading={isFetchingNextPage} />
        )}
      </div>
    </div>
  )
}
