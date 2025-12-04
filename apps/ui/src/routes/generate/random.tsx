import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SlotMachine, type SlotMachineRef } from '@/components/slot/SlotMachine'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import type { EmojiData } from '@/components/slot/emoji-data'

export const Route = createFileRoute('/generate/random')({
  component: RandomModePage,
})

function RandomModePage() {
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')
  const slotMachineRef = useRef<SlotMachineRef>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRandomComplete = (result: {
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  }) => {
    console.log('Random spin complete:', result)
    setIsSpinning(false)
    // TODO: Trigger payment modal here for random mode (combo + context + vibe)
  }

  const handleGenerate = () => {
    setIsSpinning(true)
    slotMachineRef.current?.spin()
  }

  return (
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
  )
}
