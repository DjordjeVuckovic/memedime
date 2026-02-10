import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PromptModeProps {
  value: string
  onChange: (value: string) => void
  focusBorderClass?: string
  hoverBorderColor?: string
}

export function PromptMode({ value, onChange, focusBorderClass = 'focus:border-cyan-400', hoverBorderColor = 'hover:border-cyan-400' }: PromptModeProps) {

  const examplePrompts = [
    'A dog-themed coin for gamers with aggressive marketing',
    'Wholesome pizza coin for the family',
    'Ultra-aggressive frog memecoins targeting degens',
    'Luxury diamond coin for high-rollers',
  ]

  const useExample = (example: string) => {
    onChange(example)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto glass brutal-shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">DESCRIBE YOUR COIN</CardTitle>
        <p className="text-white/60 font-mono text-sm mt-2">
          AI will generate based on your description
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Prompt Input */}
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., 'A super aggressive dog coin for gamers with wild marketing'"
            maxLength={500}
            rows={6}
            className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                     focus:outline-none ${focusBorderClass} transition-colors resize-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-white/50 font-mono">Be specific!</p>
            <p
              className={`text-sm font-mono ${value.length >= 500 ? 'text-red-400' : 'text-white/50'}`}
            >
              {value.length}/500
            </p>
          </div>
        </div>

        {/* Example Prompts */}
        <div>
          <p className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
            Example Prompts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => useExample(example)}
                className={`text-left px-3 py-2 bg-black/30 border-2 border-white/10 rounded
                         ${hoverBorderColor} hover:bg-black/40 transition-all text-sm
                         text-white/70 font-mono`}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
