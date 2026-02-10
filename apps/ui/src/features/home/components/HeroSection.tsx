import { Button } from '@/components/ui/button'
import { Sparkles, Zap } from 'lucide-react'
import { ConnectIcon } from '@/components/ConnectIcon'
import { RobotIcon } from '@/components/RobotIcon'
import { useGlobalStats } from '@/routes/stats/-queries'

interface HeroSectionProps {
  onCTAClick: () => void
  connected: boolean
}

export function HeroSection({ onCTAClick, connected }: HeroSectionProps) {
  const { data: stats } = useGlobalStats()

  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '700ms' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1400ms' }}
        />
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
            <Button variant="gold" size="xl" glow className="hover-shake" onClick={onCTAClick}>
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
  )
}
