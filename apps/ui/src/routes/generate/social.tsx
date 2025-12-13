import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SocialMode } from '@/components/generate/SocialMode'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'
import { SuccessPreview } from '@/components/generate/SuccessPreview'
import { useGenerateCoin } from '@/routes/coins/queries'

export const Route = createFileRoute('/generate/social')({
  component: SocialModePage,
})

function SocialModePage() {
  const navigate = useNavigate()
  const [socialUrl, setSocialUrl] = useState('')
  const [socialContent, setSocialContent] = useState('')
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')

  const generateMutation = useGenerateCoin({
    onError: (error) => {
      console.error('Failed to generate coin:', error)
      alert(`Failed to generate coin: ${error.message}`)
    },
  })

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
    if (!socialContent.trim()) {
      alert('Please enter post content!')
      return
    }
    if (socialUrl && !isUrlValid) {
      alert('Please enter a valid URL or leave it empty!')
      return
    }

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
      navigate({ to: '/coins/$coinId', params: { coinId: String(generateMutation.data.id) } })
    }
  }

  const handleGenerateAnother = () => {
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
              disabled={!canGenerate}
            >
              {generateMutation.isPending ? 'GENERATING...' : 'GENERATE FROM POST'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}