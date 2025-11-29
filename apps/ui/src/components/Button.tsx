import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  glow?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  glow = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 hover:border-purple-300',
    secondary:
      'glass text-white hover:bg-white/20 border-white/30',
    gold: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold border-2 border-yellow-400',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const glowClass = glow
    ? variant === 'gold'
      ? 'glow-gold'
      : 'glow-purple'
    : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
