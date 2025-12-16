import { useState, useEffect } from 'react'

interface UseConfettiOnSuccessOptions {
  isSuccess: boolean
  duration?: number
  onComplete?: () => void
}

/**
 * Custom hook to manage confetti animation after successful coin generation
 *
 * @param isSuccess - Whether the generation was successful
 * @param delay - Delay in ms before hiding confetti and calling onComplete (default: 3000)
 * @param onComplete - Callback to execute after confetti completes
 * @returns Object with showConfetti state and reset function
 */
export function useConfetti({
  isSuccess,
  duration = 3000,
  onComplete,
}: UseConfettiOnSuccessOptions) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true)

      const timeout = setTimeout(() => {
        console.log(showConfetti)
        setShowConfetti(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [isSuccess, duration, onComplete])

  const reset = () => {
    setShowConfetti(false)
  }

  return {
    showConfetti,
    reset,
  }
}
