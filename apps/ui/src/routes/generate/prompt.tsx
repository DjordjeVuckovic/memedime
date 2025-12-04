import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PromptMode } from '@/components/generate/PromptMode'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'

export const Route = createFileRoute('/generate/prompt')({
  component: PromptModePage,
})

function PromptModePage() {
  const [prompt, setPrompt] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt!')
      return
    }
    console.log('Generate - Prompt:', prompt, 'Vibe:', vibe)
    // TODO: Trigger payment modal here
  }

  const canGenerate = prompt.trim().length > 0

  return (
    <>
      {/* Generation Area - Prompt Input */}
      <div className="flex flex-col items-center gap-8 mb-8">
        <PromptMode
          value={prompt}
          onChange={setPrompt}
          focusBorderClass="focus:border-cyan-400"
          hoverBorderColor="hover:border-cyan-400"
        />
      </div>

      {/* Customization Options */}
      <div className="max-w-3xl mx-auto mb-8">
        <CustomizationOptions
          vibe={vibe}
          onVibeChange={setVibe}
          showContext={false}
          focusBorderClass="focus:border-cyan-400"
        />
      </div>

      {/* Generate Button */}
      <div className="max-w-3xl mx-auto text-center">
        <Button
          variant="cyan"
          size="xl"
          glow
          className="hover-shake w-full max-w-md"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          GENERATE FROM PROMPT
        </Button>
      </div>
    </>
  )
}