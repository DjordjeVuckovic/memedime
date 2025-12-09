import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SuccessPreviewProps {
  coin: {
    name: string
    ticker: string
    tagline: string
    combos?: {
      animal: { emoji: string; name: string }
      food: { emoji: string; name: string }
      vibe: { emoji: string; name: string }
    }
  }
  onViewDetails: () => void
  onGenerateAnother: () => void
}

export function SuccessPreview({
  coin,
  onViewDetails,
  onGenerateAnother,
}: SuccessPreviewProps) {
  const [countdown, setCountdown] = useState(3)
  const [autoNavigate, setAutoNavigate] = useState(true)

  // Countdown timer for auto-navigation
  useEffect(() => {
    if (!autoNavigate) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onViewDetails()
          return 0
        }
        return prev - 1
      })
    }, 10000)

    return () => clearInterval(timer)
  }, [autoNavigate, onViewDetails])

  const handleViewDetails = () => {
    setAutoNavigate(false)
    onViewDetails()
  }

  const handleGenerateAnother = () => {
    setAutoNavigate(false)
    onGenerateAnother()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="max-w-2xl mx-auto"
    >
      {/* Sparkle/Celebration Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.2, 1.2, 1] }}
        transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
        className="absolute -top-20 left-1/2 -translate-x-1/2 text-8xl pointer-events-none"
      >
        ✨
      </motion.div>

      <Card className="glass brutal-shadow p-8 border-4 border-white relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(45deg, rgb(168, 85, 247), rgb(236, 72, 153), rgb(251, 191, 36))',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h2 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              {coin.name}
            </h2>
            <p className="text-3xl font-mono font-bold text-cyan-400 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {coin.ticker}
            </p>
            <p className="text-xl italic text-white/90 px-4">
              "{coin.tagline}"
            </p>
          </motion.div>

          {/* Combo Display (for random mode) */}
          {coin.combos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 glass brutal-shadow px-6 py-4 rounded-xl border-2 border-white">
                <span className="text-5xl" title={coin.combos.animal.name}>
                  {coin.combos.animal.emoji}
                </span>
                <span className="text-3xl text-white/40 font-bold">+</span>
                <span className="text-5xl" title={coin.combos.food.name}>
                  {coin.combos.food.emoji}
                </span>
                <span className="text-3xl text-white/40 font-bold">+</span>
                <span className="text-5xl" title={coin.combos.vibe.name}>
                  {coin.combos.vibe.emoji}
                </span>
              </div>
            </motion.div>
          )}

          {/* Auto-navigate countdown */}
          {autoNavigate && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <p className="text-sm text-white/60 font-mono">
                Auto-navigating in{' '}
                <span className="text-cyan-400 font-bold">{countdown}</span>...
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            {/* View Full Details Button */}
            <Button
              variant="cyan"
              size="lg"
              glow
              onClick={handleViewDetails}
              className="w-full hover-shake"
            >
              VIEW FULL DETAILS
            </Button>

            {/* Generate Another Button */}
            <Button
              variant="secondary"
              size="md"
              glow
              onClick={handleGenerateAnother}
              className="w-full"
            >
              GENERATE ANOTHER
            </Button>

            {/* Generate Image Button - Disabled with SOON badge */}
            <div className="relative">
              <Button
                variant="gold"
                size="md"
                disabled
                className="w-full opacity-60 cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                GENERATE IMAGE
              </Button>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black shadow-lg">
                SOON
              </span>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
