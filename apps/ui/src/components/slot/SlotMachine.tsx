import { useState, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import { emojis } from '@memedime/contracts'

interface EmojiData {
  emoji: string
  name: string
  weight?: number
}

const ANIMALS: EmojiData[] = emojis.animals
const FOODS: EmojiData[] = emojis.foods
const VIBES: EmojiData[] = emojis.vibes

interface SlotReelProps {
  emojis: EmojiData[]
  isSpinning: boolean
  finalIndex: number
  delay?: number
}

function SlotReel({ emojis, isSpinning, finalIndex, delay = 0 }: SlotReelProps) {
  // Create extended array for seamless loop (show emoji 3 times for smooth animation)
  const extendedEmojis = [...emojis, ...emojis, ...emojis]

  // Calculate position: when spinning, show all emojis scrolling
  // When stopped, show the final emoji centered
  const itemHeight = 160 // Height of each emoji in pixels
  const yPosition = isSpinning
    ? -itemHeight * emojis.length * 2 // Scroll through 2 full sets
    : -itemHeight * finalIndex // Stop at final position

  return (
    <div
      className="w-32 h-40 border-4 border-black rounded-lg overflow-hidden relative"
      style={{
        background: 'linear-gradient(to bottom, rgb(88, 28, 135), rgb(49, 16, 76))',
        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.5), 6px 6px 12px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Window mask */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Scrolling emoji strip */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{ y: yPosition }}
        transition={{
          duration: isSpinning ? 2 : 0.5,
          ease: isSpinning ? 'linear' : [0.4, 0, 0.2, 1],
          delay: delay,
        }}
      >
        {extendedEmojis.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center"
            style={{ height: `${itemHeight}px` }}
          >
            <span
              className="text-6xl select-none"
              style={{
                filter: isSpinning ? 'blur(6px)' : 'blur(0px)',
                transition: 'filter 0.3s ease'
              }}
            >
              {item.emoji}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Center line indicator */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-cyan-400/50 transform -translate-y-1/2 pointer-events-none z-10" />
    </div>
  )
}

interface SlotMachineProps {
  onSpin?: () => void
}

export interface SlotMachineRef {
  spin: () => void
  setFinalResult: (combos: { animal: EmojiData; food: EmojiData; vibe: EmojiData }) => void
  isSpinning: boolean
}

export const SlotMachine = forwardRef<SlotMachineRef, SlotMachineProps>(({ onSpin }, ref) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [results, setResults] = useState({
    animal: 0,
    food: 0,
    vibe: 0,
  })

  const handleSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)

    // Generate random results for visual effect only
    const newResults = {
      animal: Math.floor(Math.random() * ANIMALS.length),
      food: Math.floor(Math.random() * FOODS.length),
      vibe: Math.floor(Math.random() * VIBES.length),
    }

    // Stop spinning after 2.5 seconds (animation is 2s + 0.5s settle)
    setTimeout(() => {
      setResults(newResults)
      setIsSpinning(false)

      // Call callback when spin completes (no data sent - backend generates combos)
      onSpin?.()
    }, 2500)
  }

  // Method to set final result from backend
  const setFinalResult = (combos: { animal: EmojiData; food: EmojiData; vibe: EmojiData }) => {
    // Find indices of the backend-generated emojis
    const animalIndex = ANIMALS.findIndex((e) => e.emoji === combos.animal.emoji)
    const foodIndex = FOODS.findIndex((e) => e.emoji === combos.food.emoji)
    const vibeIndex = VIBES.findIndex((e) => e.emoji === combos.vibe.emoji)

    setResults({
      animal: animalIndex >= 0 ? animalIndex : 0,
      food: foodIndex >= 0 ? foodIndex : 0,
      vibe: vibeIndex >= 0 ? vibeIndex : 0,
    })
  }

  // Expose spin method, setFinalResult, and isSpinning state to parent
  useImperativeHandle(ref, () => ({
    spin: handleSpin,
    setFinalResult,
    isSpinning,
  }))

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Slot Reels Container */}
      <div className="glass brutal-shadow border-4 border-black rounded-lg p-8">
        {/* Pull the Lever Label */}
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white uppercase">
            PULL THE LEVER
          </h3>
        </div>

        <div className="flex justify-center gap-4">
          <SlotReel
            emojis={ANIMALS}
            isSpinning={isSpinning}
            finalIndex={results.animal}
            delay={0}
          />
          <SlotReel
            emojis={FOODS}
            isSpinning={isSpinning}
            finalIndex={results.food}
            delay={0.1}
          />
          <SlotReel
            emojis={VIBES}
            isSpinning={isSpinning}
            finalIndex={results.vibe}
            delay={0.2}
          />
        </div>

        {/* Result Display - Just the combo */}
        {!isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <p className="text-2xl font-black text-white/90 font-mono">
              {ANIMALS[results.animal].name} + {FOODS[results.food].name} + {VIBES[results.vibe].name}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
})

SlotMachine.displayName = 'SlotMachine'
