import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SlotMachine, type SlotMachineRef } from '@/components/slot/SlotMachine'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import type { EmojiData } from '@/components/slot/emoji-data'

export const Route = createFileRoute('/generate/random')({
  component: RandomModePage,
})

function RandomModePage() {
  const navigate = useNavigate()
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')
  const slotMachineRef = useRef<SlotMachineRef>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [spinResult, setSpinResult] = useState<{
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  } | null>(null)

  const handleRandomComplete = (result: {
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  }) => {
    console.log('Random spin complete:', result)
    setIsSpinning(false)
    setSpinResult(result)

    // Simulate API call delay (2 seconds), then show success
    setTimeout(() => {
      setShowSuccess(true)
    }, 2000)
  }

  const handleGenerate = () => {
    setIsSpinning(true)
    setShowSuccess(false)
    slotMachineRef.current?.spin()
  }

  const handleViewDetails = () => {
    // Navigate to coin detail page
    navigate({ to: '/coins/$coinId', params: { coinId: '1' } })
  }

  const handleGenerateAnother = () => {
    setShowSuccess(false)
    setSpinResult(null)
  }

  // Mock coin data for SuccessPreview
  const mockCoin = spinResult ? {
    name: 'CAPYBARA PIZZA QUEST',
    ticker: '$CAPYPIZZA',
    tagline: 'AFK farming with diamond paws',
    combos: {
      animal: { emoji: spinResult.animal.emoji, name: spinResult.animal.name },
      food: { emoji: spinResult.food.emoji, name: spinResult.food.name },
      vibe: { emoji: spinResult.vibe.emoji, name: spinResult.vibe.name },
    },
  } : null

  return (
    <>
      {/* Show Success Preview after generation */}
      {showSuccess && mockCoin ? (
        <div className="py-12">
          <SuccessPreview
            coin={mockCoin}
            onViewDetails={handleViewDetails}
            onGenerateAnother={handleGenerateAnother}
          />
        </div>
      ) : (
        <>
          {/* Generation Area - Slot Machine */}
          <div className="flex flex-col items-center gap-8 mb-8">
            <SlotMachine ref={slotMachineRef} onSpin={handleRandomComplete} />
          </div>

          {/* Customization Options */}
          <div className="max-w-3xl mx-auto mb-8">
            <CustomizationOptions
              vibe={vibe}
              onVibeChange={setVibe}
              context={context}
              onContextChange={setContext}
              showContext={true}
              focusBorderClass="focus:border-yellow-400"
            />
          </div>

          {/* Generate Button */}
          <div className="max-w-3xl mx-auto text-center">
            <Button
              variant="gold"
              size="xl"
              glow
              className="hover-shake w-full max-w-md"
              onClick={handleGenerate}
              disabled={isSpinning}
            >
              {isSpinning ? 'SPINNING...' : 'GENERATE RANDOM COIN'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
