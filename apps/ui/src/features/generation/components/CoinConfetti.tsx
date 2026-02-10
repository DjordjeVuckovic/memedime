import { type CSSProperties, useEffect, useState } from 'react'
import bonkImg from '@/assets/imgs/bonk.png'
import goatImg from '@/assets/imgs/goat.png'
import mewImg from '@/assets/imgs/mew.webp'
import penguImg from '@/assets/imgs/pengu.webp'
import pepeImg from '@/assets/imgs/pepe.png'
import popcatImg from '@/assets/imgs/popcat.png'
import wifImg from '@/assets/imgs/wif.jpg'

const COIN_IMAGES = [bonkImg, goatImg, mewImg, penguImg, pepeImg, popcatImg, wifImg]

interface Coin {
  id: number
  left: number
  delay: number
  duration: number
  rotation: number
  image: string
  size: number
}

interface CoinConfettiProps {
  active?: boolean
  duration?: number
  coinCount?: number
}

export function CoinConfetti({ active = true, duration = 4000, coinCount = 50 }: CoinConfettiProps) {
  const [coins, setCoins] = useState<Coin[]>([])

  useEffect(() => {
    if (!active) return

    // Generate random coins
    const generatedCoins: Coin[] = []
    for (let i = 0; i < coinCount; i++) {
      generatedCoins.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 2000,
        rotation: Math.random() * 720 - 360,
        image: COIN_IMAGES[Math.floor(Math.random() * COIN_IMAGES.length)],
        size: 30 + Math.random() * 40,
      })
    }
    setCoins(generatedCoins)

    // Clear coins after duration
    const timeout = setTimeout(() => {
      setCoins([])
    }, duration)

    return () => clearTimeout(timeout)
  }, [active, duration, coinCount])

  if (!active || coins.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute -top-20 animate-fall"
          style={{
            left: `${coin.left}%`,
            animationDelay: `${coin.delay}ms`,
            animationDuration: `${coin.duration}ms`,
          }}
        >
          <img
            src={coin.image}
            alt="coin"
            className="coin-spin"
            style={{
              width: `${coin.size}px`,
              height: `${coin.size}px`,
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              animationDelay: `${coin.delay}ms`,
              animationDuration: `${coin.duration}ms`,
              '--rotation': `${coin.rotation}deg`,
            } as CSSProperties & { '--rotation': string }}
          />
        </div>
      ))}
    </div>
  )
}
