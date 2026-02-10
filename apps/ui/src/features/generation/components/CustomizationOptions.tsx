import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type CoinVibe, COIN_VIBES } from '@memedime/contracts'

interface CustomizationOptionsProps {
  vibe: CoinVibe
  onVibeChange: (vibe: CoinVibe) => void
  context?: string
  onContextChange?: (context: string) => void
  showContext?: boolean
  focusBorderClass: string
}

const vibeOptions = Object.values(COIN_VIBES).map((v) => ({
  value: v.id,
  label: v.id === '' ? 'Surprise me!' : `${v.id} - ${v.label}`,
}))

export function CustomizationOptions({
  vibe,
  onVibeChange,
  context = '',
  onContextChange,
  showContext = true,
  focusBorderClass,
}: CustomizationOptionsProps) {
  return (
    <Card className="glass brutal-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">CUSTOMIZE (OPTIONAL)</h3>
          <span className="text-white/40">•</span>
          <span className="text-sm pt-1 text-white/50 font-mono font-normal">
            Add personality and style to your coin
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vibe Dropdown */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">
            Vibe:
          </label>
          <select
            value={vibe}
            onChange={(e) => onVibeChange(e.target.value as CoinVibe)}
            className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                       focus:outline-none ${focusBorderClass} transition-colors cursor-pointer`}
          >
            {vibeOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bonus Context - Only shown when showContext is true */}
        {showContext && onContextChange && (
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">
              Extra Context:
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => onContextChange(e.target.value)}
              placeholder="e.g., 'make it about gaming' or 'add space theme'"
              maxLength={100}
              className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                       focus:outline-none ${focusBorderClass} transition-colors`}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-white/40 font-mono">Additional theme or twist</p>
              <p
                className={`text-xs font-mono ${context.length >= 100 ? 'text-red-400' : 'text-white/40'}`}
              >
                {context.length}/100
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}