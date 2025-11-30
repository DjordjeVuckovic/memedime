import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SlotMachine, type SlotMachineRef } from '@/components/slot/SlotMachine'
import { GenerationModePicker, type GenerationMode } from '@/components/generate/GenerationModePicker'
import { PromptMode } from '@/components/generate/PromptMode'
import { SocialMode } from '@/components/generate/SocialMode'
import type { EmojiData } from '@/components/slot/emoji-data'

type GenerateSearch = {
  mode?: GenerationMode
}

export const Route = createFileRoute('/generate')({
  component: GeneratePage,
  validateSearch: (search: Record<string, unknown>): GenerateSearch => {
    return {
      mode: (search.mode as GenerationMode) || 'random',
    }
  },
})

type CoinVibe = 'degen' | 'diamond-hands' | 'wholesome' | 'shitpost' | 'moon-mission' | 'normie' | ''

function GeneratePage() {
  const navigate = useNavigate({ from: '/generate' })
  const { mode = 'random' } = Route.useSearch()
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')

  // Slot machine ref for triggering spins
  const slotMachineRef = useRef<SlotMachineRef>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  // Mode-specific state
  const [prompt, setPrompt] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [socialContent, setSocialContent] = useState('')
  const [randomResult, setRandomResult] = useState<{
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  } | null>(null)

  // Validation
  const validateUrl = (url: string) => {
    if (!url) return true // URL is optional
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }
  const isUrlValid = validateUrl(socialUrl)

  const handleModeChange = (newMode: GenerationMode) => {
    navigate({ search: { mode: newMode } })
  }

  const vibeOptions = [
    { value: '', label: 'None (Surprise me!)' },
    { value: 'degen', label: 'Degen Energy - Aggressive & risky' },
    { value: 'diamond-hands', label: 'Diamond Hands - Long-term HODLer' },
    { value: 'wholesome', label: 'Wholesome - Family-friendly vibes' },
    { value: 'shitpost', label: 'Shitpost Mode - Maximum chaos' },
    { value: 'moon-mission', label: 'Moon Mission - Extreme hype' },
    { value: 'normie', label: 'Normie-Friendly - Accessible to all' },
  ]

  const handleRandomComplete = (result: {
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  }) => {
    setRandomResult(result)
    setIsSpinning(false)
    // TODO: Trigger payment modal here for random mode (combo + context + vibe)
  }

  const handleGenerate = () => {
    if (mode === 'random') {
      // Trigger slot machine spin
      setIsSpinning(true)
      slotMachineRef.current?.spin()
    } else if (mode === 'prompt') {
      if (!prompt.trim()) {
        alert('Please enter a prompt!')
        return
      }
      console.log('Generate - Prompt:', prompt, 'Vibe:', vibe)
      // TODO: Trigger payment modal here
    } else if (mode === 'social') {
      if (!socialContent.trim()) {
        alert('Please enter post content!')
        return
      }
      if (socialUrl && !isUrlValid) {
        alert('Please enter a valid URL or leave it empty!')
        return
      }
      console.log('Generate - Social:', { url: socialUrl, content: socialContent, context, vibe })
      // TODO: Trigger payment modal here
    }
  }

  // Check if generate button should be enabled
  const canGenerate =
    mode === 'random' ||
    (mode === 'prompt' && prompt.trim().length > 0) ||
    (mode === 'social' && socialContent.trim().length > 0 && isUrlValid)

  // Get button variant based on mode
  const getButtonVariant = () => {
    if (mode === 'random') return 'gold'
    if (mode === 'prompt') return 'cyan'
    return 'primary' // social
  }

  // Get accent color based on mode
  const getAccentColor = () => {
    if (mode === 'random') return 'rgb(251, 191, 36)' // yellow/gold
    if (mode === 'prompt') return 'rgb(34, 211, 238)' // cyan
    return 'rgb(192, 132, 252)' // purple for social
  }

  const getFocusBorderClass = () => {
    if (mode === 'random') return 'focus:border-yellow-400'
    if (mode === 'prompt') return 'focus:border-cyan-400'
    return 'focus:border-purple-400' // social
  }

  const getHoverBorderClass = () => {
    if (mode === 'random') return 'hover:border-yellow-400'
    if (mode === 'prompt') return 'hover:border-cyan-400'
    return 'hover:border-purple-400' // social
  }

  // Check if button should be disabled
  const isButtonDisabled = () => {
    if (mode === 'random') {
      return isSpinning
    }
    return !canGenerate
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
        <GenerationModePicker
          activeMode={mode}
          onModeChange={handleModeChange}
        />

        {/* Generation Area - Main Input */}
        <div className="flex flex-col items-center gap-8 mb-8">
          {mode === 'random' && (
            <SlotMachine ref={slotMachineRef} onSpin={handleRandomComplete} />
          )}

          {mode === 'prompt' && (
            <PromptMode
              value={prompt}
              onChange={setPrompt}
              focusBorderClass={getFocusBorderClass()}
              hoverBorderColor={getHoverBorderClass()}
            />
          )}

          {mode === 'social' && (
            <SocialMode
              url={socialUrl}
              content={socialContent}
              onUrlChange={setSocialUrl}
              onContentChange={setSocialContent}
              isUrlValid={isUrlValid}
              focusBorderClass={getFocusBorderClass()}
              accentColor={getAccentColor()}
            />
          )}
        </div>

        {/* Customization Options - Below main input */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="glass brutal-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">CUSTOMIZE (OPTIONAL)</h3>
                <span className="text-white/40">•</span>
                <span className="text-sm pt-1 text-white/50 font-mono font-normal">Add personality and style to your coin</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vibe Dropdown */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">
                  Coin Vibe:
                </label>
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value as CoinVibe)}
                  className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                           focus:outline-none ${getFocusBorderClass()} transition-colors cursor-pointer`}
                >
                  {vibeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bonus Context - Only for Random & Social */}
              {mode !== 'prompt' && (
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wide">
                    Extra Context:
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., 'make it about gaming' or 'add space theme'"
                    maxLength={100}
                    className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                             focus:outline-none ${getFocusBorderClass()} transition-colors`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-white/40 font-mono">
                      Additional theme or twist
                    </p>
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
        </div>

        {/* Unified Generate Button */}
        <div className="max-w-3xl mx-auto text-center">
          <Button
            variant={getButtonVariant()}
            size="xl"
            glow
            className="hover-shake w-full max-w-md"
            onClick={handleGenerate}
            disabled={isButtonDisabled()}
          >
            {mode === 'random' && (isSpinning ? 'SPINNING...' : 'PULL LEVER')}
            {mode === 'prompt' && 'GENERATE FROM PROMPT'}
            {mode === 'social' && 'GENERATE FROM POST'}
          </Button>
        </div>
      </div>
    </div>
  )
}
