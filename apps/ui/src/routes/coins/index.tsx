import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, TrendingUp, Clock, Sparkles, Eye } from 'lucide-react'

export const Route = createFileRoute('/coins/')({
  component: CoinsCollectionPage,
})

// Mock data - replace with actual API call
const mockCoins = [
  {
    id: '1',
    name: 'CAPYBARA PIZZA QUEST',
    ticker: '$CAPYPIZZA',
    tagline: 'AFK farming with diamond paws',
    description: 'The first gaming memecoin that combines capybara vibes with pizza rewards',
    supply: '420,690,000,000',
    createdAt: '2024-12-04T10:30:00Z',
    owner: 'DegenKing420',
    mode: 'random',
    views: 1247,
  },
  {
    id: '2',
    name: 'DOGE TACO MOON',
    ticker: '$DOGOTACO',
    tagline: 'Much taco, very moon',
    description: 'When dogs meet tacos in space, magic happens',
    supply: '1,000,000,000',
    createdAt: '2024-12-04T09:15:00Z',
    owner: 'TacoLover',
    mode: 'prompt',
    views: 892,
  },
  {
    id: '3',
    name: 'UNICORN SUSHI ROCKET',
    ticker: '$UNISUSHI',
    tagline: 'Rainbow rolls to the stars',
    description: 'Mythical creatures eating sushi while riding rockets',
    supply: '777,777,777',
    createdAt: '2024-12-04T08:00:00Z',
    owner: 'CryptoWhale',
    mode: 'social',
    views: 2103,
  },
  {
    id: '4',
    name: 'FROG BURGER DIAMOND',
    ticker: '$FROGBURG',
    tagline: 'Hopping to wealth one patty at a time',
    description: 'Frogs serving diamond-tier burgers in the metaverse',
    supply: '690,420,000',
    createdAt: '2024-12-03T22:00:00Z',
    owner: 'BurgerFrog',
    mode: 'random',
    views: 456,
  },
  {
    id: '5',
    name: 'PENGUIN RAMEN FIRE',
    ticker: '$PENRAMEN',
    tagline: 'Ice cold penguins serving hot ramen',
    description: 'Antarctic penguins bringing the heat with spicy ramen NFTs',
    supply: '100,000,000',
    createdAt: '2024-12-03T18:30:00Z',
    owner: 'RamenMaster',
    mode: 'prompt',
    views: 1893,
  },
  {
    id: '6',
    name: 'MONKEY PIZZA ROCKET',
    ticker: '$MONKPIZZA',
    tagline: 'Apes together deliver pizza',
    description: 'Decentralized pizza delivery powered by space monkeys',
    supply: '888,888,888',
    createdAt: '2024-12-03T14:15:00Z',
    owner: 'ApeDelivery',
    mode: 'social',
    views: 2456,
  },
]

function CoinsCollectionPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'random' | 'prompt' | 'social'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  // Filter and sort coins
  const filteredCoins = mockCoins
    .filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMode = filterMode === 'all' || coin.mode === filterMode
      return matchesSearch && matchesMode
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return b.views - a.views
    })

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

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'random':
        return '🎲'
      case 'prompt':
        return '✍️'
      case 'social':
        return '💬'
      default:
        return '🎯'
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl font-black mb-6 uppercase tracking-tight">
            <span className="inline-block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-grow">
              COIN VAULT
            </span>
          </h1>
          <p className="text-2xl text-white/70 font-bold font-mono">
            {filteredCoins.length} LEGENDARY COINS
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the vault..."
            className="w-full pl-16 pr-6 py-5 bg-black/60 border-4 border-purple-400/40 rounded-2xl text-white text-lg font-mono
                     focus:outline-none focus:border-purple-400 focus:shadow-[0_0_30px_rgba(192,132,252,0.3)] transition-all duration-300
                     placeholder:text-white/30"
          />
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/60 rounded-2xl p-2 border-4 border-white/10">
            {[
              { id: 'all', label: 'ALL', icon: '🌟', color: 'rgb(168, 85, 247)' },
              { id: 'random', label: 'RANDOM', icon: '🎲', color: 'rgb(251, 191, 36)' },
              { id: 'prompt', label: 'PROMPT', icon: '✍️', color: 'rgb(34, 211, 238)' },
              { id: 'social', label: 'SOCIAL', icon: '💬', color: 'rgb(192, 132, 252)' },
            ].map((mode) => {
              const isActive = filterMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => setFilterMode(mode.id as any)}
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
              onClick={() => setSortBy('recent')}
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
              onClick={() => setSortBy('popular')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all duration-300
                ${
                  sortBy === 'popular'
                    ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    : 'bg-black/40 text-white/50 border-2 border-white/10 hover:border-white/30'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              POPULAR
            </button>
          </div>
        </div>

        {/* Coins Grid */}
        {filteredCoins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl font-black text-white/20 mb-2">VAULT EMPTY</p>
            <p className="text-white/40 font-mono">No coins match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoins.map((coin, index) => {
              // Cycle through colors when "all" filter is active
              const getCardColor = () => {
                if (filterMode === 'all') {
                  const colors = [
                    'rgb(251, 191, 36)', // yellow
                    'rgb(34, 211, 238)', // cyan
                    'rgb(192, 132, 252)', // purple
                  ]
                  return colors[index % colors.length]
                }
                return getModeColor(coin.mode)
              }
              const modeColor = getCardColor()

              return (
                <Link
                  key={coin.id}
                  to="/coins/$coinId"
                  params={{ coinId: coin.id }}
                  className="group block"
                  style={{
                    animation: 'slideUpFade 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  {/* 3D Card Container */}
                  <div
                    className="relative h-full perspective-1000"
                    style={{
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
                        {/* Header */}
                        <div className="flex items-start justify-end mb-4">
                          <div className="flex items-center gap-1 text-white/40 text-sm font-mono">
                            <Eye className="w-4 h-4" />
                            {coin.views}
                          </div>
                        </div>

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

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-white/10">
                          <div className="text-xs text-white/30 font-mono">By {coin.owner}</div>
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
        )}
      </div>

      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
