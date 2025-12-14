import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast, useToast } from '@/components/ui'
import { SocialMode } from '@/components/generate/SocialMode'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/queries'
import { useWalletContext } from '@/wallet/WalletContext'

export const Route = createFileRoute('/generate/social')({
  component: SocialModePage,
})

function SocialModePage() {
  const navigate = useNavigate()
  const { connected } = useWalletContext()
  const { toastState, showToast, hideToast } = useToast()
  const [socialUrl, setSocialUrl] = useState('')
  const [socialContent, setSocialContent] = useState('')
  const [context, setContext] = useState('')
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

  const handleGenerate = () => {
    // Auth guard - check if wallet is connected
    if (!connected) {
      showToast('PLEASE CONNECT YOUR WALLET FIRST!', 'error')
      return
    }

    if (!socialContent.trim()) {
      showToast('PLEASE ENTER POST CONTENT!', 'warning')
      return
    }
    if (socialUrl && !isUrlValid) {
      showToast('PLEASE ENTER A VALID URL OR LEAVE IT EMPTY!', 'warning')
      return
    }

    // Reset states
    setShowResult(false)

    // Construct prompt from context if provided
    let prompt = context.trim() || undefined

    // Trigger coin generation with social content
    generateMutation.mutate({
      mode: 'social',
      postUrl: socialUrl.trim() || undefined,
      postContent: socialContent.trim(),
      prompt,
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
    setSocialContent('')
    setSocialUrl('')
    setContext('')
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

  const canGenerate =
    socialContent.trim().length > 0 && isUrlValid && !generateMutation.isPending

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
          {/* Generation Area - Social Input */}
          <div className="flex flex-col items-center gap-8 mb-8">
            <SocialMode
              url={socialUrl}
              content={socialContent}
              onUrlChange={setSocialUrl}
              onContentChange={setSocialContent}
              isUrlValid={isUrlValid}
              focusBorderClass="focus:border-purple-400"
              accentColor="rgb(192, 132, 252)"
            />
          </div>

          {/* Customization Options */}
          <div className="max-w-3xl mx-auto mb-8">
            <CustomizationOptions
              vibe={vibe}
              onVibeChange={setVibe}
              context={context}
              onContextChange={setContext}
              showContext={true}
              focusBorderClass="focus:border-purple-400"
            />
          </div>

          {/* Generate Button */}
          <div className="max-w-3xl mx-auto text-center">
            <Button
              variant="primary"
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
                  : 'GENERATE FROM POST'}
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
