export type GenerationMode = 'random' | 'prompt' | 'social'

interface GenerationModePickerProps {
  activeMode: GenerationMode
  onModeChange: (mode: GenerationMode) => void
}

export function GenerationModePicker({
  activeMode,
  onModeChange,
}: GenerationModePickerProps) {
  const modes = [
    {
      id: 'random' as const,
      label: 'RANDOM',
      icon: '🎲',
      description: 'Spin the slot',
      color: 'rgb(251, 191, 36)', // yellow
    },
    {
      id: 'prompt' as const,
      label: 'PROMPT',
      icon: '✍️',
      description: 'Describe your coin',
      color: 'rgb(34, 211, 238)', // cyan
    },
    {
      id: 'social' as const,
      label: 'SOCIAL',
      icon: '💬',
      description: 'From viral post',
      color: 'rgb(192, 132, 252)', // purple
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="grid grid-cols-3 gap-4">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                relative p-6 rounded-lg border-4 border-black transition-all duration-200
                ${isActive ? 'bg-white/10 scale-105' : 'bg-black/20 hover:bg-black/30'}
              `}
              style={{
                boxShadow: isActive
                  ? `6px 6px 0px ${mode.color}`
                  : '4px 4px 0px rgba(0,0,0,0.5)',
              }}
            >
              {/* Icon */}
              <div className="text-5xl mb-2">{mode.icon}</div>

              {/* Label */}
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                {mode.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/60 font-mono">{mode.description}</p>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: mode.color }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
