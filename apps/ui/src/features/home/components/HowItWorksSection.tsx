import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/features/shared/components/ui/card'

const steps = [
  { id: '01', title: 'CONNECT', color: 'yellow', description: 'Link your wallet. Solflare, whatever.' },
  { id: '02', title: 'GENERATE', color: 'cyan', description: "Drop $0.10 USDC. AI creates your coin." },
  { id: '03', title: 'AI COOKS', color: 'purple', description: 'AI generates a complete coin concept. Name, ticker, the works.' },
  { id: '04', title: 'SHARE IT', color: 'green', description: 'Flex your creation on Twitter, share with frens, go viral.' },
]

export function HowItWorksSection() {
  return (
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
          {steps.map((step, index) => (
            <Card
              key={step.id}
              glow
              glowColor="purple"
              className="hover-lift"
              style={{
                animationDelay: `${index * 100}ms`,
                boxShadow: `6px 6px 0px ${step.color === 'yellow' ? 'rgb(251 191 36)' : step.color === 'cyan' ? 'rgb(34 211 238)' : step.color === 'purple' ? 'rgb(192 132 252)' : 'rgb(74 222 128)'}`,
              }}
            >
              <CardHeader>
                <div className={`text-6xl font-black mb-3 text-${step.color}-400`}>{step.id}</div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
