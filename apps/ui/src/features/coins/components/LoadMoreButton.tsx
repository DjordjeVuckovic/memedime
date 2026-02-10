import { Loader2 } from 'lucide-react'

interface LoadMoreButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export function LoadMoreButton({ onClick, disabled, isLoading }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-8 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50
                 text-white font-black uppercase rounded-xl transition-all duration-300
                 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            LOADING MORE...
          </span>
        ) : (
          'LOAD MORE COINS'
        )}
      </button>
    </div>
  )
}
