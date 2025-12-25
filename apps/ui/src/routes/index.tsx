import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Zap, Rocket, TrendingUp, Sparkles, Shield, Bolt, Brain, Trophy } from 'lucide-react'
import { ConnectIcon } from '@/components/ConnectIcon'
import { CoinTicker } from '@/components/CoinTicker'
import { RobotIcon } from '@/components/RobotIcon'
import { useWalletContext } from '@/wallet/WalletContext'
import { WalletModal } from '@/wallet'
import { useState } from 'react'
import ReactIcon from '@/assets/icons/react.svg'
import TanStackIcon from '@/assets/icons/tanstack.svg'
import SolanaIcon from '@/assets/icons/solana.svg'
import HonoIcon from '@/assets/icons/hono.svg'
import SQLiteIcon from '@/assets/icons/sqlite.svg'
import { useGlobalStats, useRecentCoins } from '@/routes/stats/-queries.ts'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { connected } = useWalletContext()
  const navigate = useNavigate()
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const { data: stats } = useGlobalStats()
  const { data: recentCoins } = useRecentCoins(3)

  const handleCTAClick = () => {
    if (connected) {
      navigate({ to: '/generate/random' })
    } else {
      setWalletModalOpen(true)
    }
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
               style={{ animationDelay: '700ms' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"
               style={{ animationDelay: '1400ms' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Main Title */}
            <div className="space-y-6 animate-slide-up">
              <RobotIcon />
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent inline-block animate-pulse-grow">
                  MEMEDIME
                </span>
              </h1>
              <div className="relative inline-block">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white px-8 py-4 bg-black border-4 border-white brutal-shadow-lg inline-block transform -rotate-1">
                  SPEND A DIME
                </p>
              </div>
              <div className="relative inline-block">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-black px-8 py-4 bg-cyan-400 border-4 border-black brutal-shadow-lg inline-block transform rotate-1">
                  GET A MEME COIN
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl text-yellow-400 font-bold">
                <Zap className="w-6 h-6 animate-pulse" />
                <span className="font-mono">$0.10 PER GEN</span>
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
                AI-powered meme coin generator running on{' '}
                <span className="text-purple-400 font-bold">x402 protocol</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Button
                variant="gold"
                size="xl"
                glow
                className="hover-shake"
                onClick={handleCTAClick}
              >
                {connected ? <Sparkles className="w-5 h-5" /> : <ConnectIcon />}
                {connected ? 'GENERATE' : 'CONNECT & GEN'}
              </Button>
            </div>

            {/* Stats ticker */}
            <div className="pt-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/60 border-4 border-white/20 backdrop-blur font-mono text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold">LIVE:</span>
                <span>{stats?.totalSpins.toLocaleString() ?? '...'} SPINS</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-400">LAUNCH SOON</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Viral Coins Ticker */}
      <CoinTicker />

      {/* Why Choose MemeDime */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                WHY MEMEDIME?
              </span>
            </h2>
            <p className="text-xl text-white/70 font-bold">THE FASTEST WAY TO MEME COIN GREATNESS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift border-4 border-cyan-400 bg-cyan-400/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-cyan-400 border-4 border-black brutal-shadow-sm flex items-center justify-center">
                    <Bolt className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase">INSTANT GENERATION</h3>
                  <p className="text-sm text-white/70 font-bold">
                    AI creates your complete coin concept in seconds. No design skills needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-4 border-purple-400 bg-purple-400/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-purple-400 border-4 border-black brutal-shadow-sm flex items-center justify-center">
                    <Brain className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase">AI POWERED</h3>
                  <p className="text-sm text-white/70 font-bold">
                    Advanced AI ensures every coin is unique, creative, and meme-worthy.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-4 border-yellow-400 bg-yellow-400/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-yellow-400 border-4 border-black brutal-shadow-sm flex items-center justify-center">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase">SECURE x402</h3>
                  <p className="text-sm text-white/70 font-bold">
                    Built on Solana with x402 micropayments. Fast, cheap, and secure.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-4 border-green-400 bg-green-400/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-green-400 border-4 border-black brutal-shadow-sm flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase">VIRAL READY</h3>
                  <p className="text-sm text-white/70 font-bold">
                    Every coin comes with marketing angles designed to go viral.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                HOW IT WORKS
              </span>
            </h2>
            <p className="text-xl text-white/70 font-bold">4 STEPS TO MOON</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card glow glowColor="purple" className="hover-lift" style={{ boxShadow: '6px 6px 0px rgb(251 191 36)' }}>
              <CardHeader>
                <div className="text-6xl font-black text-yellow-400 mb-3">01</div>
                <CardTitle className="text-xl">CONNECT</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Link your wallet. Phantom, Solflare, whatever.
                </CardDescription>
              </CardContent>
            </Card>

            <Card glow glowColor="purple" className="hover-lift" style={{ animationDelay: '100ms', boxShadow: '6px 6px 0px rgb(34 211 238)' }}>
              <CardHeader>
                <div className="text-6xl font-black text-cyan-400 mb-3">02</div>
                <CardTitle className="text-xl">GENERATE</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Drop $0.10 USDC. AI creates your coin.
                </CardDescription>
              </CardContent>
            </Card>

            <Card glow glowColor="purple" className="hover-lift" style={{ animationDelay: '200ms', boxShadow: '6px 6px 0px rgb(192 132 252)' }}>
              <CardHeader>
                <div className="text-6xl font-black text-purple-400 mb-3">03</div>
                <CardTitle className="text-xl">AI COOKS</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI generates a complete coin concept. Name, ticker, the works.
                </CardDescription>
              </CardContent>
            </Card>

            <Card glow glowColor="purple" className="hover-lift" style={{ animationDelay: '300ms', boxShadow: '6px 6px 0px rgb(74 222 128)' }}>
              <CardHeader>
                <div className="text-6xl font-black text-green-400 mb-3">04</div>
                <CardTitle className="text-xl">SHARE IT</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Flex your creation on Twitter, share with frens, go viral.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Card glow glowColor="gold" padding="lg" className="hover-lift">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl sm:text-5xl flex items-center justify-center gap-3">
                <TrendingUp className="w-10 h-10" />
                LIVE STATS
                <TrendingUp className="w-10 h-10" />
              </CardTitle>
              <CardDescription className="text-lg">
                Real degens. Real spins. Real coins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-yellow-400 group-hover:scale-110 transition-transform">
                    {stats?.coinsToday ?? '...'}
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Coins Today
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-cyan-400 group-hover:scale-110 transition-transform">
                    {stats?.totalCoins.toLocaleString() ?? '...'}
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Total Generated
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-purple-400 group-hover:scale-110 transition-transform">
                    {stats?.uniqueWallets ?? '...'}
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Unique Wallets
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-green-400 group-hover:scale-110 transition-transform">
                    24/7
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Uptime
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t-4 border-white/10">
                <div className="flex items-center justify-center gap-3 text-center flex-wrap">
                  <Rocket className="w-6 h-6 text-purple-400 animate-pulse" />
                  <span className="text-lg font-black text-purple-400 uppercase">
                    PUMP.FUN & BONK.FUN LAUNCH COMING SOON
                  </span>
                  <Rocket className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <p className="text-sm text-white/60 mt-3 font-bold">
                  One-click deployment to your favorite platforms. Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
              <span className="bg-white text-black px-6 py-3 border-4 border-black brutal-shadow inline-block">
                BUILT WITH
              </span>
            </h2>
            <p className="text-xl text-white/70 font-bold mt-6">CUTTING-EDGE TECH STACK</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* React */}
            <div className="group">
              <div className="bg-white/5 hover:bg-white/10 border-4 border-white/20 hover:border-cyan-400 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm hover:shadow-[6px_6px_0px_rgba(34,211,238,1)]">
                <div className="flex flex-col items-center gap-3">
                  <img src={ReactIcon} alt="React" className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-black text-white uppercase">React 19</span>
                </div>
              </div>
            </div>

            {/* TanStack */}
            <div className="group">
              <div className="bg-white/5 hover:bg-white/10 border-4 border-white/20 hover:border-yellow-400 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm hover:shadow-[6px_6px_0px_rgba(251,191,36,1)]">
                <div className="flex flex-col items-center gap-3">
                  <img src={TanStackIcon} alt="TanStack" className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-black text-white uppercase">TanStack</span>
                </div>
              </div>
            </div>

            {/* Solana */}
            <div className="group">
              <div className="bg-white/5 hover:bg-white/10 border-4 border-white/20 hover:border-purple-400 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm hover:shadow-[6px_6px_0px_rgba(192,132,252,1)]">
                <div className="flex flex-col items-center gap-3">
                  <img src={SolanaIcon} alt="Solana" className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-black text-white uppercase">Solana</span>
                </div>
              </div>
            </div>

            {/* Hono */}
            <div className="group">
              <div className="bg-white/5 hover:bg-white/10 border-4 border-white/20 hover:border-orange-400 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm hover:shadow-[6px_6px_0px_rgba(251,146,60,1)]">
                <div className="flex flex-col items-center gap-3">
                  <img src={HonoIcon} alt="Hono" className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-black text-white uppercase">Hono</span>
                </div>
              </div>
            </div>

            {/* SQLite */}
            <div className="group">
              <div className="bg-white/5 hover:bg-white/10 border-4 border-white/20 hover:border-green-400 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm hover:shadow-[6px_6px_0px_rgba(74,222,128,1)]">
                <div className="flex flex-col items-center gap-3">
                  <img src={SQLiteIcon} alt="SQLite" className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span className="text-sm font-black text-white uppercase">SQLite</span>
                </div>
              </div>
            </div>
          </div>

          {/* x402 Protocol Callout */}
          <div className="mt-12">
            <Card glow glowColor="purple" padding="lg">
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-500 border-4 border-black flex items-center justify-center brutal-shadow-sm">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase">x402 Protocol</h3>
                      <p className="text-white/70 font-bold">Next-gen micropayments on Solana</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-black font-mono text-yellow-400">$0.10</div>
                    <p className="text-sm text-white/60 font-bold uppercase mt-1">Per Transaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
              <span className="bg-linear-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                RECENT HITS
              </span>
            </h2>
            <p className="text-xl text-white/70 font-bold">FRESH FROM THE GENERATOR</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCoins?.items && recentCoins.items.length > 0 ? (
              recentCoins.items.map((coin, index) => {
                const colors = ['gold', 'purple', 'green']
                const textColors = ['text-yellow-400', 'text-purple-400', 'text-green-400']
                return (
                  <Card key={coin.id} glow glowColor={colors[index % 3] as any} className="hover-lift">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        {coin.combos && (
                          <div className="text-4xl mb-2">
                            {coin.combos.animal.emoji}
                            {coin.combos.food.emoji}
                            {coin.combos.vibe.emoji}
                          </div>
                        )}
                        <h3 className={`text-2xl font-black ${textColors[index % 3]}`}>
                          {coin.ticker}
                        </h3>
                        <p className="text-sm text-white/70 font-bold">
                          "{coin.tagline}"
                        </p>
                        <div className="pt-4 border-t-2 border-white/10">
                          <div className="text-xs text-white/50 font-mono">
                            {new Date(coin.createdAt || '').toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              // Fallback when no data
              <div className="col-span-3 text-center text-white/50 py-12">
                Loading recent coins...
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="gold"
              size="lg"
              glow
              className="hover-shake"
              onClick={handleCTAClick}
            >
              <Sparkles className="w-5 h-5" />
              CREATE YOUR OWN
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-8 border-yellow-400 bg-gradient-to-br from-purple-900/80 to-purple-800/80 brutal-shadow-lg">
            <CardContent className="py-12 px-6">
              <div className="text-center space-y-8">
                <div className="inline-block animate-pulse-grow">
                  <span className="text-6xl">🎰</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase">
                  READY TO GO
                  <span className="block text-yellow-400 mt-2">VIRAL?</span>
                </h2>
                <p className="text-xl text-white/80 font-bold max-w-2xl mx-auto">
                  Join the degens creating the next generation of meme coins.
                  <span className="text-cyan-400"> Only $0.10 per spin.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button
                    variant="gold"
                    size="xl"
                    glow
                    className="hover-shake text-xl px-12"
                    onClick={handleCTAClick}
                  >
                    <Sparkles className="w-6 h-6" />
                    {connected ? 'START GENERATING' : 'CONNECT WALLET'}
                  </Button>
                </div>
                <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-bold text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span>{stats?.coinsToday ?? '...'} COINS TODAY</span>
                  </div>
                  <div className="text-white/40 hidden sm:block">•</div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>SECURE x402</span>
                  </div>
                  <div className="text-white/40 hidden sm:block">•</div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>INSTANT DEPLOY</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  )
}
