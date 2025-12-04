import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Twitter, Copy, Check, TrendingUp, User, Rocket } from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const Route = createFileRoute('/coins/$coinId')({
  component: CoinDetailPage,
})

// Mock data - replace with actual API call
const mockCoinData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'CAPYBARA PIZZA QUEST',
    ticker: '$CAPYPIZZA',
    tagline: 'AFK farming with diamond paws',
    description:
      'The first gaming memecoin that combines capybara vibes with pizza rewards. Holders earn passive pizza tokens while staking their capybaras in the ultimate chill gaming experience.',
    supply: '420,690,000,000',
    tokenomics: {
      lpBurnPercentage: 80,
      devPercentage: 5,
      marketingFeePercentage: 5,
      communityFeePercentage: 10,
    },
    marketing:
      "Launch a browser-based idle game where users stake $CAPYPIZZA to earn pizza NFTs. Partner with gaming influencers and run a 'Chillest Capybara' meme contest.",
    createdAt: '2024-12-04T10:30:00Z',
    owner: 'DegenKing420',
    ownerAddress: '7xKX...4Ry9',
    mode: 'random',
    prompt: null,
    combo: {
      animal: '🦫',
      animalName: 'Capybara',
      food: '🍕',
      foodName: 'Pizza',
      vibe: '💎',
      vibeName: 'Diamond',
    },
    context: 'make it about gaming',
    views: 1247,
    launched: false,
  },
}

function CoinDetailPage() {
  const { coinId } = Route.useParams()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const [copiedTicker, setCopiedTicker] = useState(false)

  const coin = mockCoinData[coinId]

  // Check if current user is the coin creator
  const isCreator = publicKey && coin?.ownerAddress === publicKey.toBase58().slice(0, 4) + '...' + publicKey.toBase58().slice(-4)

  if (!coin) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white/40 mb-4">COIN NOT FOUND</h1>
          <Button onClick={() => navigate({ to: '/coins' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
        </div>
      </div>
    )
  }

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

  const handleCopyTicker = () => {
    navigator.clipboard.writeText(coin.ticker)
    setCopiedTicker(true)
    setTimeout(() => setCopiedTicker(false), 2000)
  }

  const handleShareTwitter = () => {
    const text = `Just discovered ${coin.ticker} on @memedime.fun! 🎰\n\n"${coin.tagline}"\n\nCheck it out:`
    const url = `https://memedime.fun/coins/${coin.id}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8 animate-slide-up">
          <Button variant="ghost" onClick={() => navigate({ to: '/coins' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
        </div>

        {/* Main Header Card */}
        <Card
          className="mb-8 animate-slide-up"
          style={{
            animationDelay: '100ms',
            boxShadow: `8px 8px 0px ${getModeColor(coin.mode)}`,
          }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{getModeIcon(coin.mode)}</span>
                  <div
                    className="px-4 py-2 rounded-lg font-bold uppercase text-sm"
                    style={{
                      backgroundColor: `${getModeColor(coin.mode)}20`,
                      color: getModeColor(coin.mode),
                    }}
                  >
                    {coin.mode} MODE
                  </div>
                  {coin.launched && (
                    <div className="px-4 py-2 rounded-lg font-bold uppercase text-sm bg-green-500/20 text-green-400">
                      LAUNCHED
                    </div>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tight">
                  {coin.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-2xl font-mono font-bold text-cyan-400">{coin.ticker}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyTicker}
                    className="hover:bg-white/10"
                  >
                    {copiedTicker ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xl italic text-white/80 mb-6">"{coin.tagline}"</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" glow onClick={handleShareTwitter}>
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>

              {/* Launch buttons - only visible to creator */}
              {isCreator && (
                <>
                  <div className="relative">
                    <Button variant="gold" glow disabled className="opacity-60 cursor-not-allowed">
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch on LetsBonk
                    </Button>
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black">
                      SOON
                    </span>
                  </div>
                  <div className="relative">
                    <Button variant="green" glow disabled className="opacity-60 cursor-not-allowed">
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch on Pump.fun
                    </Button>
                    <span className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black">
                      SOON
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">{coin.description}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="animate-slide-up" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Supply:</span>
                <span className="font-bold font-mono">{coin.supply}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Views:</span>
                <span className="font-bold font-mono">{coin.views}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Created:</span>
                <span className="font-bold font-mono">
                  {new Date(coin.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle>
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Tokenomics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">LP Burned</span>
                  <span className="font-bold text-green-400">
                    {coin.tokenomics.lpBurnPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400"
                    style={{ width: `${coin.tokenomics.lpBurnPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Dev</span>
                  <span className="font-bold text-yellow-400">
                    {coin.tokenomics.devPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${coin.tokenomics.devPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Marketing</span>
                  <span className="font-bold text-purple-400">
                    {coin.tokenomics.marketingFeePercentage}%
                  </span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400"
                    style={{ width: `${coin.tokenomics.marketingFeePercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Community</span>
                  <span className="font-bold text-cyan-400">
                    {coin.tokenomics.communityFeePercentage}%
                  </span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${coin.tokenomics.communityFeePercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner/Generator */}
          <Card className="animate-slide-up" style={{ animationDelay: '350ms' }}>
            <CardHeader>
              <CardTitle>
                <User className="w-5 h-5 inline mr-2" />
                Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Owner:</span>
                <span className="font-bold">{coin.owner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Address:</span>
                <span className="font-bold font-mono text-sm">{coin.ownerAddress}</span>
              </div>
              {coin.combo && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-2">Random Combo:</p>
                  <div className="flex items-center gap-2 text-2xl">
                    <span title={coin.combo.animalName}>{coin.combo.animal}</span>
                    <span className="text-white/40">+</span>
                    <span title={coin.combo.foodName}>{coin.combo.food}</span>
                    <span className="text-white/40">+</span>
                    <span title={coin.combo.vibeName}>{coin.combo.vibe}</span>
                  </div>
                </div>
              )}
              {coin.context && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-2">Context:</p>
                  <p className="text-white/80 italic">"{coin.context}"</p>
                </div>
              )}
              {coin.prompt && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-2">Prompt:</p>
                  <p className="text-white/80 italic">"{coin.prompt}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marketing Strategy */}
          {coin.marketing && (
            <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle>Marketing Strategy</CardTitle>
                <CardDescription>AI-generated go-to-market plan</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 leading-relaxed">{coin.marketing}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
