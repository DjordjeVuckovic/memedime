import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50 border-4 border-black uppercase tracking-wide hover-lift',
  {
    variants: {
      variant: {
        primary:
          'bg-purple-600 hover:bg-purple-700 text-white brutal-shadow',
        secondary:
          'glass text-white hover:bg-white/20 brutal-shadow',
        gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black brutal-shadow',
        cyan: 'bg-cyan-400 hover:bg-cyan-300 text-black brutal-shadow',
        green: 'bg-green-500 hover:bg-green-400 text-black brutal-shadow',
        red: 'bg-red-500 hover:bg-red-400 text-white brutal-shadow',
        ghost:
          'bg-transparent hover:bg-white/10 text-white border-white',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-16 px-8 text-base',
        xl: 'h-20 px-12 text-xl',
        icon: 'h-12 w-12',
      },
      glow: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'gold',
        glow: true,
        class: 'glow-gold hover-lift',
      },
      {
        variant: ['primary', 'secondary'],
        glow: true,
        class: 'glow-purple hover-lift',
      },
      {
        variant: 'green',
        glow: true,
        class: 'glow-green hover-lift',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }