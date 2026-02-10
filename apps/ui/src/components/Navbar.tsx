import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { ConnectIcon } from './ConnectIcon'
import { WalletModal } from '@/features/wallet/components/WalletModal'
import solLogo from '@/assets/imgs/sol-logo.svg'
import { WalletButton } from '@/features/wallet/components/WalletButton'
import XIcon from '@/assets/icons/x.svg'
import GithubIcon from '@/assets/icons/github.svg'
import RedditIcon from '@/assets/icons/reddit.svg'
import { appEnv } from '@/lib/env'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const { publicKey, disconnect, connected } = useWallet()

  const handleWalletClick = () => {
    if (connected) {
      disconnect()
    } else {
      setWalletModalOpen(true)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-purple-900/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 transition-all duration-300 group-hover:scale-110">
              <svg
                viewBox="0 0 240 200"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="navPurpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                    <stop offset="100%" stopColor="rgb(126, 34, 206)" />
                  </linearGradient>
                </defs>

                {/* Antenna */}
                <line x1="120" y1="25" x2="120" y2="50" stroke="black" strokeWidth="5" strokeLinecap="round" />
                <circle cx="120" cy="18" r="12" fill="black" stroke="black" strokeWidth="4" />
                <image href={solLogo} x="108" y="6" width="24" height="24" />

                {/* Robot Head */}
                <rect x="40" y="50" width="160" height="120" rx="12" fill="url(#navPurpleGrad)" stroke="black" strokeWidth="5" />
                <rect x="50" y="60" width="140" height="15" rx="4" fill="rgb(126, 34, 206)" stroke="black" strokeWidth="3" />

                {/* Left Solana Eye */}
                <circle cx="85" cy="110" r="24" fill="black" stroke="black" strokeWidth="4" />
                <image href={solLogo} x="65" y="90" width="40" height="40" />

                {/* Right Solana Eye */}
                <circle cx="155" cy="110" r="24" fill="black" stroke="black" strokeWidth="4" />
                <image href={solLogo} x="135" y="90" width="40" height="40" />

                {/* Mouth */}
                <rect x="80" y="145" width="80" height="12" rx="6" fill="rgb(34, 211, 238)" stroke="black" strokeWidth="3" />
                <line x1="100" y1="145" x2="100" y2="157" stroke="black" strokeWidth="2" />
                <line x1="120" y1="145" x2="120" y2="157" stroke="black" strokeWidth="2" />
                <line x1="140" y1="145" x2="140" y2="157" stroke="black" strokeWidth="2" />
              </svg>
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
            <Link
              to="/coins"
              search={{ sortBy: 'recent' }}
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              Coins
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/generate/random"
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              Generate
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a
              href="https://docs.memedime.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white/80 hover:text-white transition-all duration-200 hover:scale-110 uppercase tracking-wide relative group"
            >
              Docs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center gap-2 border-l border-white/20 pl-4">
            <a
              href={appEnv.X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-cyan-400 transition-all hover:scale-110"
              aria-label="X (Twitter)"
            >
              <img src={XIcon} alt="X" className="w-4 h-4" />
            </a>
            <a
              href={appEnv.GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <img src={GithubIcon} alt="GitHub" className="w-4 h-4" />
            </a>
            <a
              href={appEnv.REDDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-orange-500 transition-all hover:scale-110"
              aria-label="Reddit"
            >
              <img src={RedditIcon} alt="Reddit" className="w-4 h-4" />
            </a>
          </div>

          {/* Connect Wallet Button */}
          <WalletButton connecting={(x) => setWalletModalOpen(x)} />

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
          <Link
            to="/coins"
            search={{ sortBy: 'recent' }}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Coins
          </Link>
          <Link
            to="/generate/random"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Generate
          </Link>
          <a
            href="https://docs.memedime.fun"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Docs
          </a>

          {/* Social Media Icons - Mobile */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10">
            <span className="text-xs font-bold text-white/60 uppercase">Follow:</span>
            <a
              href={appEnv.X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-cyan-400/20 hover:bg-cyan-400/30 border-2 border-cyan-400/40 hover:border-cyan-400 transition-all"
              aria-label="X (Twitter)"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={XIcon} alt="X" className="w-5 h-5" />
            </a>
            <a
              href={appEnv.GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white transition-all"
              aria-label="GitHub"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={GithubIcon} alt="GitHub" className="w-5 h-5" />
            </a>
            <a
              href={appEnv.REDDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-orange-500/20 hover:bg-orange-500/30 border-2 border-orange-500/40 hover:border-orange-500 transition-all"
              aria-label="Reddit"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={RedditIcon} alt="Reddit" className="w-5 h-5" />
            </a>
          </div>

          <div className="pt-2">
            <Button
              variant={connected ? 'green' : 'gold'}
              glow
              className="w-full"
              onClick={handleWalletClick}
            >
              <ConnectIcon connected={connected} />
              {connected && publicKey ? formatAddress(publicKey.toBase58()) : 'CONNECT'}
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </nav>
  )
}
