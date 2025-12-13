import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PromptMode } from '@/components/generate/PromptMode'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/queries'

export const Route = createFileRoute('/generate/prompt')({
  component: PromptModePage,
})

function PromptModePage() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')

  const generateMutation = useGenerateCoin({
    onError: (error) => {
      console.error('Failed to generate coin:', error)
      alert(`Failed to generate coin: ${error.message}`)
    },
  })

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt!')
      return
    }

    // Trigger coin generation with prompt
    generateMutation.mutate({
      mode: 'prompt',
      prompt: prompt.trim(),
    })
  }

  const handleViewDetails = () => {
    if (generateMutation.data) {
      navigate({ to: '/coins/$coinId', params: { coinId: String(generateMutation.data.id) } })
    }
  }

  const handleGenerateAnother = () => {
    generateMutation.reset()
    setPrompt('')
  }

  // Coin data from mutation for SuccessPreview
  const generatedCoin = generateMutation.data
    ? {
        name: generateMutation.data.name,
        ticker: generateMutation.data.ticker,
        tagline: generateMutation.data.tagline,
        combos: generateMutation.data.combos!,
      }
    : null

  const canGenerate = prompt.trim().length > 0 && !generateMutation.isPending

  return (
    <>
      {/* Show Success Preview after generation */}
      {generateMutation.isSuccess && generatedCoin ? (
        <div className="py-12">
          <SuccessPreview
            coin={generatedCoin}
            onViewDetails={handleViewDetails}
            onGenerateAnother={handleGenerateAnother}
          />
        </div>
      ) : (
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
              {generateMutation.isPending ? 'GENERATING...' : 'GENERATE FROM PROMPT'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}