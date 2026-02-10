import { Loader2 } from 'lucide-react'
import { ErrorPage } from '@/components/ErrorPage'
import type { Mode } from '@memedime/contracts'
import { CoinCard } from './CoinCard'

interface CoinsGridProps {
  coins: Array<{
    id: number
    name: string
    ticker: string
    tagline?: string
    description?: string
    walletAddress?: string
    mode: Mode
    combos?: {
      animal: { emoji: string }
      food: { emoji: string }
      vibe: { emoji: string }
    }
  }>
  isLoading: boolean
  isError: boolean
  error: unknown
  filterMode?: Mode | null
}

export function CoinsGrid({ coins, isLoading, isError, error, filterMode }: CoinsGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
        <p className="text-2xl font-black text-white/40">LOADING COINS...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorPage
        title="ERROR LOADING COINS"
        message={error instanceof Error ? error.message : 'Failed to load coins. Please try again later.'}
        errorCode="FETCH_ERROR"
        showBackButton={false}
        showHomeButton={true}
      />
    )
  }

  if (coins.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-3xl font-black text-white/20 mb-2">VAULT EMPTY</p>
        <p className="text-white/40 font-mono">No coins match your search</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coins.map((coin) => (
        <CoinCard key={coin.id} {...coin} filterMode={filterMode} />
      ))}
    </div>
  )
}
