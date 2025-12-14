import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { Search, TrendingUp, Clock, Sparkles, Loader2 } from 'lucide-react'
import { useSearchCoins } from './queries'
import { useDebounce } from '@/hooks/useDebounce'
import { type Mode, SearchReqSchema } from '@memedime/contracts'
import { formatWalletAddress } from '@/wallet/util.ts'
import { ErrorPage } from '@/components/ErrorPage'
import { z } from 'zod'

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
  const navigate = useNavigate({ from: '/coins' })
  const searchParams = Route.useSearch()

  // Extract and sanitize search params
  const searchQuery = searchParams.q ?? ''
  const filterMode = searchParams.mode ?? null
  const sortBy = searchParams.sortBy ?? 'recent'

  // Local search input state
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Debounce the local search query
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  // Sync local state with URL params on initial load
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      navigate({
        search: (prev) => ({
          ...prev,
          q: debouncedSearchQuery || undefined,
        }),
      })
    }
  }, [debouncedSearchQuery, searchQuery, navigate])

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchCoins(searchQuery, filterMode ?? undefined, sortBy)

  const coins = useMemo(() => {
    return data?.pages?.flatMap((page) => page.items) ?? []
  }, [data?.pages])

  // Check if currently debouncing
  const isDebouncing = localSearchQuery !== debouncedSearchQuery

  const updateSearch = useCallback(
    (updates: Partial<CoinsSearch>) => {
      navigate({
        search: (prev) => ({ ...prev, ...updates }),
      })
    },
    [navigate],
  )

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    const sanitized = value.slice(0, 200) // Max 200 chars
    setLocalSearchQuery(sanitized)
  }, [])

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'random':
        return 'rgb(251, 191, 36)' // yellow
      case 'prompt':
        return 'rgb(34, 211, 238)' // cyan
      case 'social':
        return 'rgb(192, 132, 252)' // purple
      default:
        return 'rgb(255, 255, 255)'
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
          {isDebouncing && (
            <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
          )}
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search the vault..."
            maxLength={200}
            aria-label="Search coins"
            className="w-full pl-16 pr-14 py-5 bg-black/60 border-4 border-purple-400/40 rounded-2xl text-white text-lg font-mono
                     focus:outline-none focus:border-purple-400 focus:shadow-[0_0_30px_rgba(192,132,252,0.3)] transition-all duration-300
                     placeholder:text-white/30"
          />
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/60 rounded-2xl p-2 border-4 border-white/10">
            {[
              { id: null, label: 'ALL', icon: '🌟', color: 'rgb(168, 85, 247)' },
              { id: 'random' as Mode, label: 'RANDOM', icon: '🎲', color: 'rgb(251, 191, 36)' },
              { id: 'prompt' as Mode, label: 'PROMPT', icon: '✍️', color: 'rgb(34, 211, 238)' },
              { id: 'social' as Mode, label: 'SOCIAL', icon: '💬', color: 'rgb(192, 132, 252)' },
            ].map((mode) => {
              const isActive = filterMode === mode.id
              return (
                <button
                  key={mode.label}
                  onClick={() => updateSearch({ mode: mode.id ?? undefined })}
                  className={`
                    px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-300
                    ${
                      isActive
                        ? 'text-white scale-105'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }
                  `}
                  style={
                    isActive
                      ? {
                          backgroundColor: mode.color,
                          boxShadow: `0 4px 20px ${mode.color}80`,
                        }
                      : {}
                  }
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-3">
            <button
              onClick={() => updateSearch({ sortBy: 'recent' })}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all duration-300
                ${
                  sortBy === 'recent'
                    ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-black/40 text-white/50 border-2 border-white/10 hover:border-white/30'
                }
              `}
            >
              <Clock className="w-4 h-4" />
              RECENT
            </button>
            <button
              onClick={() => updateSearch({ sortBy: 'relevance' })}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all duration-300
                ${
                  sortBy === 'relevance'
                    ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    : 'bg-black/40 text-white/50 border-2 border-white/10 hover:border-white/30'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              RELEVANCE
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
            <p className="text-2xl font-black text-white/40">LOADING COINS...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <ErrorPage
            title="ERROR LOADING COINS"
            message={
              error instanceof Error
                ? error.message
                : 'Failed to load coins. Please try again later.'
            }
            errorCode="FETCH_ERROR"
            showBackButton={false}
            showHomeButton={true}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && coins.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl font-black text-white/20 mb-2">VAULT EMPTY</p>
            <p className="text-white/40 font-mono">No coins match your search</p>
          </div>
        )}

        {/* Coins Grid */}
        {!isLoading && !isError && coins.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coins.map((coin) => {
              // Use coin's mode color when "all" filter is active, otherwise use filter mode color
              const modeColor = filterMode ? getModeColor(filterMode) : getModeColor(coin.mode)

              return (
                <Link
                  key={coin.id}
                  to="/coins/$coinId"
                  params={{ coinId: coin.id.toString() }}
                  className="group block"
                >
                  {/* 3D Card Container */}
                  <div
                    className="relative h-full"
                    style={{
                      perspective: '1000px',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {/* Card */}
                    <div
                      className="relative h-full bg-black/60 backdrop-blur-sm rounded-2xl border-4 overflow-hidden
                                 transition-all duration-500 ease-out
                                 group-hover:scale-105 group-hover:-translate-y-2
                                 group-hover:rotate-1"
                      style={{
                        borderColor: modeColor,
                        boxShadow: `
                          8px 8px 0px rgba(0,0,0,0.8),
                          0 0 0 4px ${modeColor}20
                        `,
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `
                          12px 12px 0px rgba(0,0,0,0.9),
                          0 0 40px ${modeColor}60,
                          0 0 0 4px ${modeColor}40
                        `
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `
                          8px 8px 0px rgba(0,0,0,0.8),
                          0 0 0 4px ${modeColor}20
                        `
                      }}
                    >
                      {/* Glow Effect on Hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${modeColor}15, transparent 70%)`,
                        }}
                      />

                      {/* Content */}
                      <div className="relative p-6 h-full flex flex-col">
                        {/* Coin Info */}
                        <div className="flex-1 mb-4">
                          <h3 className="text-2xl font-black mb-2 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                            {coin.name}
                          </h3>
                          <p
                            className="text-lg font-mono font-bold mb-3"
                            style={{ color: modeColor }}
                          >
                            {coin.ticker}
                          </p>
                          <p className="text-white/60 italic text-sm mb-3 line-clamp-2">
                            "{coin.tagline}"
                          </p>
                          <p className="text-white/40 text-sm line-clamp-2">{coin.description}</p>
                        </div>

                        {/* Footer - Wallet Address */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-white/10">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: modeColor }}
                            />
                            <span className="text-xs text-white/30 font-mono">
                              {formatWalletAddress(coin.walletAddress)}
                            </span>
                          </div>
                          <Sparkles className="w-5 h-5 text-white/20 group-hover:text-yellow-400 transition-colors" />
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div
                        className="absolute top-0 right-0 w-20 h-20 opacity-20"
                        style={{
                          background: `radial-gradient(circle at top right, ${modeColor}, transparent 70%)`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50
                           text-white font-black uppercase rounded-xl transition-all duration-300
                           shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                           disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      LOADING MORE...
                    </span>
                  ) : (
                    'LOAD MORE COINS'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
