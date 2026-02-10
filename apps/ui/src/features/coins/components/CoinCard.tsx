import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { formatWalletAddress } from '@/features/wallet/components/util'
import type { Mode } from '@memedime/contracts'

interface CoinCardProps {
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
  filterMode?: Mode | null
}

export function CoinCard({
  id,
  name,
  ticker,
  tagline = '',
  description = '',
  walletAddress = '',
  mode,
  filterMode,
}: CoinCardProps) {
  const getModeColor = (modeStr: string) => {
    switch (modeStr) {
      case 'random':
        return 'rgb(251, 191, 36)'
      case 'prompt':
        return 'rgb(34, 211, 238)'
      case 'social':
        return 'rgb(192, 132, 252)'
      default:
        return 'rgb(255, 255, 255)'
    }
  }

  const modeColor = filterMode ? getModeColor(filterMode) : getModeColor(mode)

  return (
    <Link to="/coins/$coinId" params={{ coinId: id.toString() }} className="group block">
      <div className="relative h-full" style={{ perspective: '1000px', transform: 'translateZ(0)' }}>
        <div
          className="relative h-full bg-black/60 backdrop-blur-sm rounded-2xl border-4 overflow-hidden
                     transition-all duration-500 ease-out
                     group-hover:scale-105 group-hover:-translate-y-2
                     group-hover:rotate-1"
          style={{
            borderColor: modeColor,
            boxShadow: `8px 8px 0px rgba(0,0,0,0.8), 0 0 0 4px ${modeColor}20`,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `12px 12px 0px rgba(0,0,0,0.9), 0 0 40px ${modeColor}60, 0 0 0 4px ${modeColor}40`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `8px 8px 0px rgba(0,0,0,0.8), 0 0 0 4px ${modeColor}20`
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 0%, ${modeColor}15, transparent 70%)` }}
          />
          <div className="relative p-6 h-full flex flex-col">
            <div className="flex-1 mb-4">
              <h3 className="text-2xl font-black mb-2 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                {name}
              </h3>
              <p className="text-lg font-mono font-bold mb-3" style={{ color: modeColor }}>
                {ticker}
              </p>
              <p className="text-white/60 italic text-sm mb-3 line-clamp-2">"{tagline}"</p>
              <p className="text-white/40 text-sm line-clamp-2">{description}</p>
            </div>
            {walletAddress && (
              <div className="flex items-center justify-between pt-4 border-t-2 border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: modeColor }} />
                  <span className="text-xs text-white/30 font-mono">{formatWalletAddress(walletAddress)}</span>
                </div>
                <Sparkles className="w-5 h-5 text-white/20 group-hover:text-yellow-400 transition-colors" />
              </div>
            )}
          </div>
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-20"
            style={{ background: `radial-gradient(circle at top right, ${modeColor}, transparent 70%)` }}
          />
        </div>
      </div>
    </Link>
  )
}
