import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Zap, Rocket, TrendingUp, Sparkles } from 'lucide-react'
import { ConnectIcon } from '@/components/ConnectIcon'
import { CoinTicker } from '@/components/CoinTicker'
import { RobotIcon } from '@/components/RobotIcon'
import { useWalletContext } from '@/wallet/WalletContext'
import { WalletModal } from '@/wallet'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { connected } = useWalletContext()
  const navigate = useNavigate()
  const [walletModalOpen, setWalletModalOpen] = useState(false)

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
                <span>247 SPINS</span>
                <span className="text-white/40">•</span>
                <span>12 LAUNCHED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Viral Coins Ticker */}
      <CoinTicker />

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
                <CardTitle className="text-xl">SEND IT</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Launch on pump.fun or just flex it on Twitter.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6">
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-yellow-400 group-hover:scale-110 transition-transform">
                    247
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Spins Today
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-green-400 group-hover:scale-110 transition-transform">
                    12
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase flex items-center justify-center gap-1">
                    Coins Launched <Rocket className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-6xl font-black font-mono text-cyan-400 group-hover:scale-110 transition-transform">
                    4.9%
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">
                    Launch Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Component Demo Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-black text-center mb-12 uppercase">
            <span className="bg-white text-black px-6 py-3 border-4 border-black brutal-shadow inline-block">
              UI Components
            </span>
          </h2>

          {/* Button Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Button Styles</CardTitle>
              <CardDescription>
                Brutalist buttons with hard shadows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="gold">Gold</Button>
                <Button variant="cyan">Cyan</Button>
                <Button variant="green">Green</Button>
                <Button variant="red">Red</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* Button Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>
                From smol to absolute unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Glowing Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Glow Effects</CardTitle>
              <CardDescription>
                Maximum attention grabbing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" glow>
                  Purple Glow
                </Button>
                <Button variant="gold" glow>
                  Gold Glow
                </Button>
                <Button variant="green" glow>
                  Green Glow
                </Button>
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
