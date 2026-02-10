import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onClose?: () => void
  show: boolean
}

const variantStyles: Record<ToastVariant, string> = {
  info: 'bg-cyan-400 border-cyan-600 text-black',
  success: 'bg-green-400 border-green-600 text-black',
  warning: 'bg-yellow-400 border-yellow-600 text-black',
  error: 'bg-red-400 border-red-600 text-black',
}

const variantShadows: Record<ToastVariant, string> = {
  info: 'shadow-[6px_6px_0px_rgb(8,145,178)]',
  success: 'shadow-[6px_6px_0px_rgb(21,128,61)]',
  warning: 'shadow-[6px_6px_0px_rgb(202,138,4)]',
  error: 'shadow-[6px_6px_0px_rgb(185,28,28)]',
}

/**
 * Neobrutalist Toast Component
 * Displays notification messages with brutal design aesthetic
 */
export function Toast({ message, variant = 'info', duration = 5000, onClose, show }: ToastProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (!isVisible || !duration) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] max-w-md w-full px-6 py-4 border-4 border-black font-bold transform transition-all duration-300',
        variantStyles[variant],
        variantShadows[variant],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-sm uppercase flex-1">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}

/**
 * Toast Manager Hook
 * Manages toast state and provides show/hide functions
 */
export function useToast() {
  const [toastState, setToastState] = useState<{
    show: boolean
    message: string
    variant: ToastVariant
  }>({
    show: false,
    message: '',
    variant: 'info',
  })

  const showToast = (message: string, variant: ToastVariant = 'info') => {
    setToastState({ show: true, message, variant })
  }

  const hideToast = () => {
    setToastState((prev) => ({ ...prev, show: false }))
  }

  return {
    toastState,
    showToast,
    hideToast,
  }
}