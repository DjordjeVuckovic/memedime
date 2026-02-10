import { Card, CardContent } from '@/features/shared/components/ui/card'
import { Button } from '@/features/shared/components/ui/button'
import { Sparkles, Shield, Zap } from 'lucide-react'
import { useGlobalStats } from '@/routes/stats/-queries.ts'
import slotImg from '@/assets/imgs/slot.png'

interface FinalCTASectionProps {
  onCTAClick: () => void
  connected: boolean
}

export function FinalCTASection({ onCTAClick, connected }: FinalCTASectionProps) {
  const { data: stats } = useGlobalStats()

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-8 border-yellow-400 bg-gradient-to-br from-purple-900/80 to-purple-800/80 brutal-shadow-lg">
          <CardContent className="py-12 px-6">
            <div className="text-center space-y-8">
              <div className="inline-block">
                <img src={slotImg} alt="slot" width="306" height="204" />
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
                <Button variant="gold" size="xl" glow className="hover-shake text-xl px-12" onClick={onCTAClick}>
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
  )
}
