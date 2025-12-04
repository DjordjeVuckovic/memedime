import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SocialMode } from '@/components/generate/SocialMode'
import { CustomizationOptions, type CoinVibe } from '@/components/generate/CustomizationOptions'

export const Route = createFileRoute('/generate/social')({
  component: SocialModePage,
})

function SocialModePage() {
  const [socialUrl, setSocialUrl] = useState('')
  const [socialContent, setSocialContent] = useState('')
  const [context, setContext] = useState('')
  const [vibe, setVibe] = useState<CoinVibe>('')

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
    console.log('Generate - Social:', { url: socialUrl, content: socialContent, context, vibe })
    // TODO: Trigger payment modal here
  }

  const canGenerate = socialContent.trim().length > 0 && isUrlValid

  return (
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
          GENERATE FROM POST
        </Button>
      </div>
    </>
  )
}