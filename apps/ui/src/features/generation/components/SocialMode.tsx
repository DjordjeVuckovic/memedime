import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SocialModeProps {
  url: string
  content: string
  onUrlChange: (value: string) => void
  onContentChange: (value: string) => void
  isUrlValid: boolean
  focusBorderClass?: string
  accentColor?: string
}

export function SocialMode({ url, content, onUrlChange, onContentChange, isUrlValid, focusBorderClass = 'focus:border-purple-400', accentColor = 'rgb(192, 132, 252)' }: SocialModeProps) {

  const exampleUrls = [
    'https://x.com/user/status/1234567890',
    'https://reddit.com/r/cryptocurrency/comments/abc123',
    'https://www.tiktok.com/@user/video/1234567890',
  ]

  return (
    <Card className="w-full max-w-3xl mx-auto glass brutal-shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">GENERATE FROM SOCIAL POST</CardTitle>
        <p className="text-white/60 font-mono text-sm mt-2">
          AI analyzes the post vibe and creates your coin
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Post URL Input */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
            Post URL (Optional):
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://x.com/user/status/1234567890"
            className={`w-full px-4 py-3 bg-black/40 border-4 rounded-lg text-white font-mono
                       focus:outline-none transition-colors
                       ${
                         url && !isUrlValid
                           ? 'border-red-400 focus:border-red-400'
                           : `border-white/20 ${focusBorderClass}`
                       }`}
          />
          <div className="mt-2">
            {url && !isUrlValid && (
              <p className="text-sm text-red-400 font-mono">
                Invalid URL format
              </p>
            )}
            {isUrlValid && (
              <p className="text-sm text-green-400 font-mono">
                ✓ Valid URL
              </p>
            )}
          </div>
        </div>

        {/* Post Content Input */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
            Post Content:
          </label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Paste the post content here... AI will analyze the vibe and create your coin"
            maxLength={1000}
            rows={6}
            className={`w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono
                     focus:outline-none ${focusBorderClass} transition-colors resize-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-white/50 font-mono">Paste viral content</p>
            <p
              className={`text-sm font-mono ${content.length >= 1000 ? 'text-red-400' : 'text-white/50'}`}
            >
              {content.length}/1000
            </p>
          </div>
        </div>

        {/* Example URLs */}
        <div>
          <p className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wide">
            Supported Platforms:
          </p>
          <div className="space-y-2">
            {exampleUrls.map((example, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-black/30 border-2 border-white/10 rounded
                         text-sm text-white/50 font-mono break-all"
              >
                {example}
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div
          className="border-2 rounded-lg p-4"
          style={{
            backgroundColor: `${accentColor}10`,
            borderColor: `${accentColor}30`
          }}
        >
          <h4
            className="font-black mb-2 uppercase tracking-wide text-sm"
            style={{ color: accentColor }}
          >
            How It Works:
          </h4>
          <ul className="space-y-1 text-sm text-white/70 font-mono">
            <li>• Find a viral post you like (X, Reddit, TikTok, etc.)</li>
            <li>• Paste the post content in the text area</li>
            <li>• Optionally add the URL for reference</li>
            <li>• AI analyzes the vibe and creates a matching coin</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
