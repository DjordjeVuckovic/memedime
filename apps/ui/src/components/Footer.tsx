import { Zap } from 'lucide-react'
import XIcon from '@/assets/icons/x.svg'
import GithubIcon from '@/assets/icons/github.svg'
import RedditIcon from '@/assets/icons/reddit.svg'
import { appEnv } from '@/lib/env'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t-8 border-black bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: `repeating-linear-gradient(
                 45deg,
                 transparent,
                 transparent 20px,
                 rgba(0,0,0,0.3) 20px,
                 rgba(0,0,0,0.3) 22px
               )`
             }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="inline-block">
              <h3 className="text-3xl font-black text-white bg-black px-4 py-2 border-4 border-white brutal-shadow-sm transform -rotate-1">
                MEMEDIME
              </h3>
            </div>
            <p className="text-white/90 font-bold text-sm max-w-xs">
              AI-powered meme coin generator. Spend a dime, get a meme.
            </p>
            <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs font-bold">
              <Zap className="w-4 h-4" />
              <span>POWERED BY x402</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase text-yellow-300 tracking-wide mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#how-it-works"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-cyan-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#stats"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-cyan-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  Stats
                </a>
              </li>
              <li>
                <a
                  href="/generate/random"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-cyan-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  Generate
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase text-yellow-300 tracking-wide mb-4">
              RESOURCES
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-green-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-green-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-white hover:text-yellow-300 font-bold transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-green-400 border-2 border-black group-hover:bg-yellow-300 transition-colors" />
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Social & CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase text-yellow-300 tracking-wide mb-4">
              COMMUNITY
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href={appEnv.X_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-400 hover:bg-cyan-300 text-black p-3 border-4 border-black brutal-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                aria-label="X (Twitter)"
              >
                <img src={XIcon} alt="X" className="w-5 h-5" />
              </a>
              <a
                href={appEnv.GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-200 text-black p-3 border-4 border-black brutal-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                aria-label="GitHub"
              >
                <img src={GithubIcon} alt="GitHub" className="w-5 h-5" />
              </a>
              <a
                href={appEnv.REDDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-400 text-white p-3 border-4 border-black brutal-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                aria-label="Reddit"
              >
                <img src={RedditIcon} alt="Reddit" className="w-5 h-5" />
              </a>
            </div>

            {/* Call-out box */}
            <div className="bg-black border-4 border-white p-4 brutal-shadow-sm mt-6">
              <p className="text-yellow-300 font-black text-sm uppercase mb-2">
                NOT FINANCIAL ADVICE
              </p>
              <p className="text-white/80 text-xs font-bold">
                Meme coins are volatile. DYOR. NFA. WAGMI.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-4 border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-white/70 font-mono text-sm font-bold">
              © {currentYear} MEMEDIME. ALL RIGHTS RESERVED.
            </div>

            {/* Fun tagline */}
            <div className="flex items-center gap-2 bg-white/10 border-2 border-white/30 px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-mono text-xs font-bold">
                POWERED BY DEGENERACY & AI
              </span>
            </div>

            {/* Made with */}
            <div className="text-white/70 text-sm font-bold flex items-center gap-2">
              MADE WITH
              <span className="text-red-500 animate-pulse text-lg">♥</span>
              BY DEGENS
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 border-l-8 border-t-8 border-yellow-300 opacity-30" />
      <div className="absolute top-0 left-0 w-24 h-24 border-r-8 border-b-8 border-cyan-400 opacity-30" />
    </footer>
  )
}
