import { Card, CardContent } from '@/features/shared/components/ui/card'
import { Zap } from 'lucide-react'
import ReactIcon from '@/assets/icons/react.svg'
import TanStackIcon from '@/assets/icons/tanstack.svg'
import SolanaIcon from '@/assets/icons/solana.svg'
import HonoIcon from '@/assets/icons/hono.svg'
import SQLiteIcon from '@/assets/icons/sqlite.svg'

const techStack = [
  { name: 'React 19', icon: ReactIcon, color: 'cyan' },
  { name: 'TanStack', icon: TanStackIcon, color: 'yellow' },
  { name: 'Solana', icon: SolanaIcon, color: 'purple' },
  { name: 'Hono', icon: HonoIcon, color: 'orange' },
  { name: 'SQLite', icon: SQLiteIcon, color: 'green' },
]

const colorBorders: Record<string, string> = {
  cyan: 'hover:border-cyan-400 hover:shadow-[6px_6px_0px_rgba(34,211,238,1)]',
  yellow: 'hover:border-yellow-400 hover:shadow-[6px_6px_0px_rgba(251,191,36,1)]',
  purple: 'hover:border-purple-400 hover:shadow-[6px_6px_0px_rgba(192,132,252,1)]',
  orange: 'hover:border-orange-400 hover:shadow-[6px_6px_0px_rgba(251,146,60,1)]',
  green: 'hover:border-green-400 hover:shadow-[6px_6px_0px_rgba(74,222,128,1)]',
}

export function TechStackSection() {
  return (
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
          {techStack.map((tech) => (
            <div key={tech.name} className="group">
              <div
                className={`bg-white/5 hover:bg-white/10 border-4 border-white/20 p-6 transition-all hover:-translate-y-2 brutal-shadow-sm ${colorBorders[tech.color]}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-16 h-16 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-sm font-black text-white uppercase">{tech.name}</span>
                </div>
              </div>
            </div>
          ))}
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
  )
}
