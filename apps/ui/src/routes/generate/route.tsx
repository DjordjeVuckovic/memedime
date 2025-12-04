import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { GenerationModePicker, type GenerationMode } from '@/components/generate/GenerationModePicker'

export const Route = createFileRoute('/generate')({
  component: GenerateLayout,
})

function GenerateLayout() {
  const location = useLocation()

  // Determine active mode from pathname
  const getActiveModeFromPath = (): GenerationMode => {
    if (location.pathname.includes('/random')) return 'random'
    if (location.pathname.includes('/prompt')) return 'prompt'
    if (location.pathname.includes('/social')) return 'social'
    return 'random'
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              GENERATE YOUR COIN
            </span>
          </h1>
          <p className="text-xl text-white/70 font-bold font-mono">
            $0.10 PER GENERATION • AI-POWERED MEME COINS
          </p>
        </div>

        {/* Mode Picker */}
        <GenerationModePicker activeMode={getActiveModeFromPath()} />

        {/* Child route content */}
        <Outlet />
      </div>
    </div>
  )
}