import bonkImg from '@/assets/imgs/bonk.png'
import pepeImg from '@/assets/imgs/pepe.png'
import popcatImg from '@/assets/imgs/popcat.png'
import wifImg from '@/assets/imgs/wif.jpg'
import penguImg from '@/assets/imgs/pengu.webp'

const coins = [
  { name: 'BONK', img: bonkImg, color: 'text-yellow-400' },
  { name: 'PEPE', img: pepeImg, color: 'text-green-400' },
  { name: 'WIF', img: wifImg, color: 'text-purple-400' },
  { name: 'POPCAT', img: popcatImg, color: 'text-cyan-400' },
  { name: 'PENGU', img: penguImg, color: 'text-blue-400' },
]

export const CoinTicker = () => {
  return (
    <div className="relative overflow-hidden py-12 bg-black/20">
      {/* Header Message */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-black text-white/90 uppercase tracking-tight">
          <span className="text-yellow-400">VIRAL LEGENDS</span>
        </h3>
        <p className="text-sm sm:text-base text-white/60 font-bold font-mono mt-2">
          THEY ALL PUMPED. YOURS NEXT.
        </p>
      </div>

      <div className="flex animate-marquee">
        {/* Duplicate coins twice for seamless infinite scroll */}
        {[...coins, ...coins].map((coin, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 mx-8 group"
          >
            <img
              src={coin.img}
              alt={coin.name}
              className="w-12 h-12 rounded-full border-2 border-white/20 transition-transform group-hover:scale-110"
            />
            <span className={`font-bold text-xl font-mono ${coin.color}`}>
              ${coin.name}
            </span>
          </div>
        ))}
      </div>

      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}
