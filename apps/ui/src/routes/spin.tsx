import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SlotMachine } from '@/components/slot/SlotMachine'
import type { EmojiData } from '@/components/slot/emoji-data'

export const Route = createFileRoute('/spin')({
  component: SpinPage,
})

function SpinPage() {
  const [context, setContext] = useState('')
  const [lastResult, setLastResult] = useState<{
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  } | null>(null)

  const handleSpinComplete = (result: {
    animal: EmojiData
    food: EmojiData
    vibe: EmojiData
  }) => {
    setLastResult(result)
    console.log('Spin result:', result)
    console.log('Context:', context)
    // TODO: Trigger payment modal here
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 uppercase tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              SPIN THE SLOT
            </span>
          </h1>
          <p className="text-xl text-white/70 font-bold font-mono">
            $0.10 PER SPIN • AI-POWERED MEME COINS
          </p>
        </div>

        {/* Slot Machine Area */}
        <div className="flex flex-col items-center gap-8">
          <SlotMachine onSpin={handleSpinComplete} />

          {/* Optional Context Input */}
          <Card className="w-full max-w-3xl glass brutal-shadow">
            <CardHeader>
              <CardTitle className="text-xl">CUSTOMIZE YOUR COIN (OPTIONAL)</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., 'make it about gaming' or 'super aggressive marketing'"
                maxLength={100}
                className="w-full px-4 py-3 bg-black/40 border-4 border-white/20 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-white/50 font-mono">
                  Influences AI generation
                </p>
                <p className={`text-sm font-mono ${context.length >= 100 ? 'text-red-400' : 'text-white/50'}`}>
                  {context.length}/100
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
