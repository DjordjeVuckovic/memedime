import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'

interface ErrorPageProps {
  title?: string
  message?: string
  errorCode?: string | number
  showHomeButton?: boolean
  showBackButton?: boolean
  onBack?: () => void
}

export function ErrorPage({
  title = 'SOMETHING WENT WRONG',
  message = 'The page you are looking for does not exist or an error occurred.',
  errorCode,
  showHomeButton = true,
  showBackButton = true,
  onBack,
}: ErrorPageProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const handleHome = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div
          className="relative bg-black/60 backdrop-blur-sm rounded-2xl border-4 border-red-400 p-8 md:p-12"
          style={{
            boxShadow: `
              8px 8px 0px rgba(0,0,0,0.8),
              0 0 40px rgba(239, 68, 68, 0.3)
            `,
          }}
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 opacity-20 rounded-2xl"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgb(239, 68, 68), transparent 70%)',
            }}
          />

          {/* Content */}
          <div className="relative text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <AlertCircle className="w-20 h-20 text-red-400" strokeWidth={2} />
                {errorCode && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full border-2 border-black">
                    {errorCode}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight text-red-400">
              {title}
            </h1>

            {/* Message */}
            <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed max-w-lg mx-auto">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              {showBackButton && (
                <Button variant="secondary" size="lg" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
              {showHomeButton && (
                <Button variant="primary" size="lg" glow onClick={handleHome}>
                  <Home className="w-4 h-4 mr-2" />
                  Home Page
                </Button>
              )}
            </div>
          </div>

          {/* Corner Accent */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-tr-2xl"
            style={{
              background: 'radial-gradient(circle at top right, rgb(239, 68, 68), transparent 70%)',
            }}
          />
        </div>

        {/* Fun Footer Message */}
        <div className="text-center mt-8">
          <p className="text-white/40 font-mono text-sm">
            Error code: <span className="text-red-400 font-bold">{errorCode || 'UNKNOWN'}</span>
          </p>
          <p className="text-white/30 font-mono text-xs mt-2">
            "Even the best degens hit errors sometimes 🎲"
          </p>
        </div>
      </div>
    </div>
  )
}
