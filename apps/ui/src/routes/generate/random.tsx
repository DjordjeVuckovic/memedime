import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast, useToast } from '@/components/ui/toast'
import { SlotMachine, type SlotMachineRef } from '@/features/slot/components/SlotMachine'
import { CustomizationOptions } from '@/features/generation/components/CustomizationOptions'
import type { CoinVibe } from '@memedime/contracts'
import { SuccessPreview } from '@/features/generation/components/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/-queries'
import { useWalletContext } from '@/features/wallet/components/WalletContext'

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

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (animationComplete && generateMutation.isSuccess && !showResult) {
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
    if (!connected) {
      showToast('PLEASE CONNECT YOUR WALLET FIRST!', 'error')
      return
    }

    setIsSpinning(true)
    setAnimationComplete(false)
    setShowResult(false)
    generateMutation.reset()

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
          <div className="flex flex-col items-center gap-8 mb-8">
            <SlotMachine ref={slotMachineRef} onSpin={handleRandomComplete} />
          </div>

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

      <Toast show={toastState.show} message={toastState.message} variant={toastState.variant} onClose={hideToast} />
    </>
  )
}
