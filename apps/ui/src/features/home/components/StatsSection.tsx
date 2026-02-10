import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { TrendingUp, Rocket } from 'lucide-react'
import { useGlobalStats } from '@/routes/stats/-queries.ts'

export function StatsSection() {
  const { data: stats } = useGlobalStats()

  const statsData = [
    { label: 'Coins Today', value: stats?.coinsToday ?? '...', color: 'text-yellow-400' },
    { label: 'Total Generated', value: stats?.totalCoins.toLocaleString() ?? '...', color: 'text-cyan-400' },
    { label: 'Unique Wallets', value: stats?.uniqueWallets ?? '...', color: 'text-purple-400' },
    { label: 'Uptime', value: '24/7', color: 'text-green-400' },
  ]

  return (
    <section id="stats" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Card glow glowColor="gold" padding="lg" className="hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl sm:text-5xl flex items-center justify-center gap-3">
              <TrendingUp className="w-10 h-10" />
              LIVE STATS
              <TrendingUp className="w-10 h-10" />
            </CardTitle>
            <CardDescription className="text-lg">Real degens. Real spins. Real coins.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
              {statsData.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className={`text-6xl font-black font-mono ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 mt-2 font-bold uppercase">{stat.label}</div>
                </div>
              ))}
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
  )
}
