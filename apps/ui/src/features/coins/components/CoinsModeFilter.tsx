import { type Mode } from '@memedime/contracts'

interface CoinsModeFilterProps {
  currentMode: Mode | null
  onModeChange: (mode: Mode | null) => void
}

const modes = [
  { id: null, label: 'ALL', icon: '🌟', color: 'rgb(168, 85, 247)' },
  { id: 'random' as Mode, label: 'RANDOM', icon: '🎲', color: 'rgb(251, 191, 36)' },
  { id: 'prompt' as Mode, label: 'PROMPT', icon: '✍️', color: 'rgb(34, 211, 238)' },
  { id: 'social' as Mode, label: 'SOCIAL', icon: '💬', color: 'rgb(192, 132, 252)' },
] as const

export function CoinsModeFilter({ currentMode, onModeChange }: CoinsModeFilterProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-black/60 rounded-2xl p-2 border-4 border-white/10">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id
          return (
            <button
              key={mode.label}
              onClick={() => onModeChange(mode.id)}
              className={`
                px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-300
                ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
              `}
              style={
                isActive
                  ? {
                      backgroundColor: mode.color,
                      boxShadow: `0 4px 20px ${mode.color}80`,
                    }
                  : {}
              }
            >
              <span className="mr-2">{mode.icon}</span>
              {mode.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
