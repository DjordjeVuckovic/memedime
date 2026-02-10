import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useWalletContext } from '@/features/wallet/components/WalletContext'
import { WalletModal } from '@/features/wallet/components/WalletModal'
import { CoinTicker } from '@/components/CoinTicker'
import { HeroSection } from '@/features/home/components/HeroSection'
import { FeaturesSection } from '@/features/home/components/FeaturesSection'
import { HowItWorksSection } from '@/features/home/components/HowItWorksSection'
import { StatsSection } from '@/features/home/components/StatsSection'
import { TechStackSection } from '@/features/home/components/TechStackSection'
import { RecentHitsSection } from '@/features/home/components/RecentHitsSection'
import { FinalCTASection } from '@/features/home/components/FinalCTASection'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { connected } = useWalletContext()
  const navigate = useNavigate()
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  const handleCTAClick = () => {
    if (connected) {
      navigate({ to: '/generate/random' })
    } else {
      setWalletModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection onCTAClick={handleCTAClick} connected={connected} />
      <CoinTicker />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TechStackSection />
      <RecentHitsSection onCTAClick={handleCTAClick} />
      <FinalCTASection onCTAClick={handleCTAClick} connected={connected} />
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  )
}
