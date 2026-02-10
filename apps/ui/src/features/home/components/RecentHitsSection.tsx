import { Card, CardContent } from '@/features/shared/components/ui/card'
import { Button } from '@/features/shared/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useRecentCoins } from '@/routes/stats/-queries.ts'

export function RecentHitsSection({ onCTAClick }: { onCTAClick: () => void }) {
  const { data: recentCoins } = useRecentCoins(3)

  const colors = ['gold', 'purple', 'green'] as const
  const textColors = ['text-yellow-400', 'text-purple-400', 'text-green-400'] as const

  return (
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
            recentCoins.items.map((coin, index) => (
              <Card key={coin.id} glow glowColor={colors[index % 3]} className="hover-lift">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    {coin.combos && (
                      <div className="text-4xl mb-2">
                        {coin.combos.animal.emoji}
                        {coin.combos.food.emoji}
                        {coin.combos.vibe.emoji}
                      </div>
                    )}
                    <h3 className={`text-2xl font-black ${textColors[index % 3]}`}>{coin.ticker}</h3>
                    <p className="text-sm text-white/70 font-bold">"{coin.tagline}"</p>
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
            ))
          ) : (
            <div className="col-span-3 text-center text-white/50 py-12">Loading recent coins...</div>
          )}
        </div>

        <div className="text-center mt-12">
          <Button variant="gold" size="lg" glow className="hover-shake" onClick={onCTAClick}>
            <Sparkles className="w-5 h-5" />
            CREATE YOUR OWN
          </Button>
        </div>
      </div>
    </section>
  )
}
