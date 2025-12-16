import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast, useToast } from '@/components/ui'
import { SlotMachine, type SlotMachineRef } from '@/components/slot/SlotMachine'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/queries'
import { useWalletContext } from '@/wallet/WalletContext'

const PREVIEW_DELAY = 1_500

export const Route = createFileRoute('/generate/random')({
  component: RandomModePage,
})

function RandomModePage() {
  const navigate = useNavigate()
  const { connected } = useWalletContext()
  const { toastState, showToast, hideToast } = useToast()
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')
  const slotMachineRef = useRef<SlotMachineRef>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const generateMutation = useGenerateCoin({
    onError: (error) => {
      console.error('Failed to generate coin:', error)
      showToast(`FAILED TO GENERATE COIN: ${error.message.toUpperCase()}`, 'error')
      setIsSpinning(false)
      setAnimationComplete(false)
      setShowResult(false)
    },
  })

  // When both animation completes AND API returns, update slot machine and show result
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (animationComplete && generateMutation.isSuccess && !showResult) {
      // Update slot machine to display backend-generated combos
      if (generateMutation.data.combos && slotMachineRef.current) {
        slotMachineRef.current.setFinalResult(generateMutation.data.combos)
      }
      timeout = setTimeout(() => setShowResult(true), PREVIEW_DELAY)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [animationComplete, generateMutation.isSuccess, generateMutation.data, showResult])

  const handleRandomComplete = () => {
    console.log('Random spin animation complete')
    setAnimationComplete(true)
    setIsSpinning(false)
  }

  const handleGenerate = () => {
    // Auth guard - check if wallet is connected
    if (!connected) {
      showToast('PLEASE CONNECT YOUR WALLET FIRST!', 'error')
      return
    }

    setIsSpinning(true)
    setAnimationComplete(false)
    setShowResult(false)
    generateMutation.reset()

    // Start slot machine animation
    slotMachineRef.current?.spin()

    generateMutation.mutate({
      mode: 'random',
      prompt: context.trim() || undefined,
    })
  }

  const handleViewDetails = () => {
    if (generateMutation.data) {
      void navigate({ to: '/coins/$coinId', params: { coinId: String(generateMutation.data.id) } })
    }
  }

  const handleGenerateAnother = () => {
    setShowResult(false)
    setAnimationComplete(false)
    generateMutation.reset()
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
              disabled={!connected || isSpinning || generateMutation.isPending}
            >
              <Sparkles className="w-5 h-5" />
              {isSpinning
                ? 'SPINNING...'
                : generateMutation.isPending
                  ? 'GENERATING...'
                  : !connected
                    ? 'CONNECT WALLET TO GENERATE'
                    : 'GENERATE RANDOM COIN'}
            </Button>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <Toast show={toastState.show} message={toastState.message} variant={toastState.variant} onClose={hideToast} />
    </>
  )
}
