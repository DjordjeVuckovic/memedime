import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast, useToast } from '@/components/ui'
import { PromptMode } from '@/components/generate/PromptMode'
import { CustomizationOptions } from '@/components/generate/CustomizationOptions'
import type { CoinVibe } from '@memedime/contracts'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/-queries.ts'
import { useWalletContext } from '@/wallet/WalletContext'

export const Route = createFileRoute('/generate/prompt')({
  component: PromptModePage,
})

function PromptModePage() {
  const navigate = useNavigate()
  const { connected } = useWalletContext()
  const { toastState, showToast, hideToast } = useToast()
  const [prompt, setPrompt] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')
  const [showResult, setShowResult] = useState(false)

  const generateMutation = useGenerateCoin({
    onError: (error) => {
      console.error('Failed to generate coin:', error)
      showToast(`FAILED TO GENERATE COIN: ${error.message.toUpperCase()}`, 'error')
      setShowResult(false)
    },
  })

  // Show result when API succeeds
  useEffect(() => {
    if (generateMutation.isSuccess && generateMutation.data && !showResult) {
      setShowResult(true)
    }
  }, [generateMutation.isSuccess, generateMutation.data, showResult])

  const handleGenerate = () => {
    if (!connected) {
      showToast('PLEASE CONNECT YOUR WALLET FIRST!', 'error')
      return
    }

    if (!prompt.trim()) {
      showToast('PLEASE ENTER A PROMPT!', 'warning')
      return
    }

    setShowResult(false)

    // Trigger coin generation with prompt
    generateMutation.mutate({
      mode: 'prompt',
      prompt: prompt.trim(),
    })
  }

  const handleViewDetails = () => {
    if (generateMutation.data) {
      void navigate({ to: '/coins/$coinId', params: { coinId: String(generateMutation.data.id) } })
    }
  }

  const handleGenerateAnother = () => {
    setShowResult(false)
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
      {showResult && generatedCoin ? (
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
              disabled={!connected || !canGenerate}
            >
              <Sparkles className="w-5 h-5" />
              {generateMutation.isPending
                ? 'GENERATING...'
                : !connected
                  ? 'CONNECT WALLET TO GENERATE'
                  : 'GENERATE FROM PROMPT'}
            </Button>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <Toast
        show={toastState.show}
        message={toastState.message}
        variant={toastState.variant}
        onClose={hideToast}
      />
    </>
  )
}
