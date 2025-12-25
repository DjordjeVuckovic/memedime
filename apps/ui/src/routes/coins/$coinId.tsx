import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Copy, Check, TrendingUp, User, Rocket, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ErrorPage } from '@/components/ErrorPage'
import { useCoin } from './-queries.ts'
import XIcon from '@/assets/icons/x.svg'
import FarcasterIcon from '@/assets/icons/farcaster.svg'
import RedditIcon from '@/assets/icons/reddit.svg'
import { z } from 'zod'

const CoinParamsSchema = z.object({
  coinId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Coin ID must be a valid positive number',
  }),
})

export const Route = createFileRoute('/coins/$coinId')({
  params: {
    parse: (params) => CoinParamsSchema.parse(params),
    stringify: (params) => ({ coinId: params.coinId }),
  },
  component: CoinDetailPage,
  errorComponent: ({ error }) => (
    <ErrorPage
      title="INVALID COIN ID"
      message={
        error instanceof z.ZodError
          ? error.issues[0]?.message || 'The coin ID provided is not valid.'
          : 'The coin ID provided is not valid. Please check the URL and try again.'
      }
      errorCode="INVALID_PARAM"
      showBackButton={true}
      showHomeButton={true}
    />
  ),
})

function CoinDetailPage() {
  const { coinId } = Route.useParams()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const [copiedTicker, setCopiedTicker] = useState(false)
  // Fetch coin data
  const { data: coin, isLoading, isError } = useCoin(Number(coinId))

  // Check if current user is the coin creator
  const isCreator = publicKey && coin?.walletAddress === publicKey.toBase58()

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
          <p className="text-2xl font-black text-white/40">LOADING COIN...</p>
        </div>
      </div>
    )
  }

  if (isError || !coin) {
    return (
      <ErrorPage
        title="COIN NOT FOUND"
        message="The coin you are looking for does not exist or has been removed."
        errorCode="404"
        showBackButton={true}
        showHomeButton={true}
        onBack={() => navigate({ to: '/coins', search: { sortBy: 'recent' } })}
      />
    )
  }

  const getModeColor = (mode?: string) => {
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

  const getModeIcon = (mode?: string) => {
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

  const handleShareX = () => {
    const text = `Just discovered ${coin.ticker} on @memedime.fun! 🎰\n\n"${coin.tagline}"\n\nCheck it out:`
    const url = `https://memedime.fun/coins/${coin.id}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    )
  }

  const handleShareTelegram = () => {
    const text = `Just discovered ${coin.ticker} on memedime.fun! 🎰\n\n"${coin.tagline}"\n\nCheck it out: https://memedime.fun/coins/${coin.id}`
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(`https://memedime.fun/coins/${coin.id}`)}&text=${encodeURIComponent(text)}`,
      '_blank',
    )
  }

  const handleShareReddit = () => {
    const url = `https://memedime.fun/coins/${coin.id}`
    const title = `${coin.ticker} - ${coin.tagline}`
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      '_blank',
    )
  }

  const handleShareFarcaster = () => {
    const text = `Just discovered ${coin.ticker} on memedime.fun! 🎰\n\n"${coin.tagline}"`
    const url = `https://memedime.fun/coins/${coin.id}`
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`,
      '_blank',
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate({ to: '/coins', search: { sortBy: 'recent' } })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
        </div>

        {/* Main Header Card */}
        <Card
          className="mb-8"
          style={{
            boxShadow: `8px 8px 0px ${getModeColor(coin.mode)}`,
          }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{getModeIcon(coin.combos?.animal.emoji)}</span>
                  <div
                    className="px-4 py-2 rounded-lg font-bold uppercase text-sm"
                    style={{
                      backgroundColor: `${getModeColor()}20`,
                      color: getModeColor(),
                    }}
                  >
                    MEME COIN
                  </div>
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
            <div className="space-y-4">
              {/* Social Share Buttons */}
              <div>
                <p className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
                  Share on Social:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="blackwhite" onClick={handleShareX}>
                    <img src={XIcon} alt="X" className="w-4 h-4 mr-2" />
                    Share on X
                  </Button>

                  <Button variant="cyan" glow onClick={handleShareTelegram}>
                    <Send className="w-4 h-4 mr-2" />
                    Share on Telegram
                  </Button>

                  <Button variant="orange" glow onClick={handleShareReddit}>
                    <img src={RedditIcon} alt="Reddit" className="w-4 h-4 mr-2" />
                    Share on Reddit
                  </Button>

                  <Button variant="secondary" glow onClick={handleShareFarcaster}>
                    <img src={FarcasterIcon} alt="Farcaster" className="w-4 h-4 mr-2" />
                    Share on Farcaster
                  </Button>
                </div>
              </div>

              {/* Launch buttons - only visible to creator */}
              {isCreator && (
                <div>
                  <p className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
                    Launch Your Coin:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Button variant="green" glow disabled className="opacity-60 cursor-not-allowed">
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch on Pump.fun
                      </Button>
                      <span className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black">
                        SOON
                      </span>
                    </div>
                    <div className="relative">
                      <Button variant="gold" glow disabled className="opacity-60 cursor-not-allowed">
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch on LetsBonk
                      </Button>
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black">
                        SOON
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">{coin.description}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-mono text-sm">Supply:</span>
                <span className="font-bold font-mono">{coin.supply}</span>
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
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="w-5 h-5 inline mr-2" />
                Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coin.walletAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-mono text-sm">Wallet:</span>
                  <span className="font-bold font-mono text-sm break-all">{coin.walletAddress}</span>
                </div>
              )}
              {coin.combos && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm text-white/60 mb-2">Combo:</p>
                  <div className="flex items-center gap-2 text-2xl">
                    <span title={coin.combos.animal.name}>{coin.combos.animal.emoji}</span>
                    <span className="text-white/40">+</span>
                    <span title={coin.combos.food.name}>{coin.combos.food.emoji}</span>
                    <span className="text-white/40">+</span>
                    <span title={coin.combos.vibe.name}>{coin.combos.vibe.emoji}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marketing Strategy */}
          {coin.marketing && (
            <Card className="lg:col-span-2">
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
