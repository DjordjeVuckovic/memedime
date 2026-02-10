import { Card, CardContent } from '@/components/ui/card'
import { Bolt, Brain, Shield, Trophy } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      id: 'instant',
      icon: Bolt,
      title: 'INSTANT GENERATION',
      description: 'AI creates your complete coin concept in seconds. No design skills needed.',
      color: 'cyan',
    },
    {
      id: 'ai',
      icon: Brain,
      title: 'AI POWERED',
      description: 'Advanced AI ensures every coin is unique, creative, and meme-worthy.',
      color: 'purple',
    },
    {
      id: 'secure',
      icon: Shield,
      title: 'SECURE x402',
      description: 'Built on Solana with x402 micropayments. Fast, cheap, and secure.',
      color: 'yellow',
    },
    {
      id: 'viral',
      icon: Trophy,
      title: 'VIRAL READY',
      description: 'Every coin comes with marketing angles designed to go viral.',
      color: 'green',
    },
  ]

  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-400 bg-cyan-400/10',
    purple: 'border-purple-400 bg-purple-400/10',
    yellow: 'border-yellow-400 bg-yellow-400/10',
    green: 'border-green-400 bg-green-400/10',
  }

  const bgClasses: Record<string, string> = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    yellow: 'bg-yellow-400',
    green: 'bg-green-400',
  }

  return (
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
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.id} className={`hover-lift border-4 ${colorClasses[feature.color]}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 border-4 border-black brutal-shadow-sm flex items-center justify-center ${bgClasses[feature.color]}`}>
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase">{feature.title}</h3>
                    <p className="text-sm text-white/70 font-bold">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
