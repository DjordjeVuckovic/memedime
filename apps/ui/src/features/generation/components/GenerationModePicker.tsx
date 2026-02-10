import { Link } from '@tanstack/react-router'

export type GenerationMode = 'random' | 'prompt' | 'social'

interface GenerationModePickerProps {
  activeMode: GenerationMode
}

export function GenerationModePicker({ activeMode }: GenerationModePickerProps) {
  const modes = [
    {
      id: 'random' as const,
      label: 'RANDOM',
      icon: '🎲',
      description: 'Spin the slot',
      color: 'rgb(251, 191, 36)', // yellow
      path: '/generate/random',
    },
    {
      id: 'prompt' as const,
      label: 'PROMPT',
      icon: '✍️',
      description: 'Describe your coin',
      color: 'rgb(34, 211, 238)', // cyan
      path: '/generate/prompt',
    },
    {
      id: 'social' as const,
      label: 'SOCIAL',
      icon: '💬',
      description: 'From viral post',
      color: 'rgb(192, 132, 252)', // purple
      path: '/generate/social',
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="grid grid-cols-3 gap-4">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id

          return (
            <Link
              key={mode.id}
              to={mode.path}
              className={`
                relative p-6 rounded-lg border-4
                transition-all duration-300 ease-out
                ${isActive ? 'bg-white/10 scale-105 -translate-y-1' : 'bg-black/20 hover:bg-black/30 hover:-translate-y-0.5 border-black'}
                block
              `}
              style={{
                borderColor: isActive ? mode.color : 'black',
                boxShadow: isActive
                  ? `6px 6px 0px ${mode.color}, 0 0 30px ${mode.color}40`
                  : '4px 4px 0px rgba(0,0,0,0.5)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Icon */}
              <div
                className={`text-5xl mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
              >
                {mode.icon}
              </div>

              {/* Label */}
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                {mode.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/60 font-mono">{mode.description}</p>

              {/* Active indicator dot */}
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-full transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  backgroundColor: mode.color,
                  boxShadow: `0 0 10px ${mode.color}`
                }}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
