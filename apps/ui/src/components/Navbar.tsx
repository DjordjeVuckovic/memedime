import { Link } from '@tanstack/react-router'
import { Wallet, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-purple-900/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              🎰
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent transition-all group-hover:tracking-wider">
                MEMEDIME
              </span>
              <span className="text-[10px] font-mono text-purple-300 -mt-1 transition-colors group-hover:text-cyan-400">
                .FUN
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#stats"
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              Stats
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block animate-pulse-grow">
            <Button variant="gold" glow size="md" className="hover-shake">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/10',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <div className="px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Home
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            How It Works
          </a>
          <a
            href="#stats"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Stats
          </a>
          <div className="pt-2">
            <Button variant="gold" glow className="w-full">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}