import { Search, Loader2 } from 'lucide-react'
import { useCallback } from 'react'

interface CoinsSearchBarProps {
  value: string
  onChange: (value: string) => void
  isDebouncing: boolean
}

export function CoinsSearchBar({ value, onChange, isDebouncing }: CoinsSearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = e.target.value.slice(0, 200) // Max 200 chars
      onChange(sanitized)
    },
    [onChange],
  )

  return (
    <div className="relative max-w-2xl mx-auto mb-12">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
      {isDebouncing && (
        <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search the vault..."
        maxLength={200}
        aria-label="Search coins"
        className="w-full pl-16 pr-14 py-5 bg-black/60 border-4 border-purple-400/40 rounded-2xl text-white text-lg font-mono
                 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_30px_rgba(192,132,252,0.3)] transition-all duration-300
                 placeholder:text-white/30"
      />
    </div>
  )
}
