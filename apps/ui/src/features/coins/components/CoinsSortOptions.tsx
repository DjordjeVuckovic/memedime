import { Clock, TrendingUp } from 'lucide-react'

type SortOption = 'recent' | 'relevance'

interface CoinsSortOptionsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function CoinsSortOptions({ currentSort, onSortChange }: CoinsSortOptionsProps) {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex gap-3">
        <button
          onClick={() => onSortChange('recent')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all duration-300
            ${
              currentSort === 'recent'
                ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                : 'bg-black/40 text-white/50 border-2 border-white/10 hover:border-white/30'
            }
          `}
        >
          <Clock className="w-4 h-4" />
          RECENT
        </button>
        <button
          onClick={() => onSortChange('relevance')}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all duration-300
            ${
              currentSort === 'relevance'
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
  )
}
