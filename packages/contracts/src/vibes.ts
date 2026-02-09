import { z } from 'zod'

export const ALL_VIBES = [
  'degen',
  'animal',
  'gross-out',
  'absurd',
  'political',
  'hypebeast',
  'gambler',
  'meta',
  'ai-agent',
  'normie',
] as const

export const CoinVibeSchema = z.enum(['', ...ALL_VIBES] as [string, ...string[]])

export type CoinVibe = z.infer<typeof CoinVibeSchema>

/** Use this when parsing untrusted input — falls back to '' on invalid values */
export const CoinVibeSafeSchema = CoinVibeSchema.catch('')

export const VibeInfoSchema = z
  .object({
    id: CoinVibeSchema,
    label: z.string(),
    description: z.string(),
    shipped: z.boolean(),
  })
  .meta({ description: 'Coin vibe metadata' })

export type VibeInfo = z.infer<typeof VibeInfoSchema>

export const COIN_VIBES: Record<CoinVibe, VibeInfo> = {
  '': {
    id: '',
    label: 'surprise me',
    description: 'reads the room. could be anything.',
    shipped: true,
  },
  'degen': {
    id: 'degen',
    label: '3am trenches',
    description: 'burned LP, CT raids, completely cooked',
    shipped: true,
  },
  'animal': {
    id: 'animal',
    label: 'cute creature',
    description: 'things with faces. your mom could ape',
    shipped: true,
  },
  'gross-out': {
    id: 'gross-out',
    label: 'fartcoin energy',
    description: 'bathroom humor = liquidity',
    shipped: true,
  },
  'absurd': {
    id: 'absurd',
    label: 'crow with knife',
    description: '17 layers of irony. makes no sense. works anyway',
    shipped: true,
  },
  'political': {
    id: 'political',
    label: 'ride the news',
    description: 'controversy = engagement. identity bags',
    shipped: true,
  },
  'hypebeast': {
    id: 'hypebeast',
    label: 'wen binance',
    description: 'roadmaps to nowhere. hype IS the product',
    shipped: true,
  },
  'gambler': {
    id: 'gambler',
    label: 'pure casino',
    description: 'no pretense. just vibes and variance',
    shipped: true,
  },
  'meta': {
    id: 'meta',
    label: 'honest rug',
    description: "can't scam if you say you're a scam",
    shipped: true,
  },
  'ai-agent': {
    id: 'ai-agent',
    label: 'AI agent cope',
    description: 'python script = autonomous agent apparently',
    shipped: true,
  },
  'normie': {
    id: 'normie',
    label: 'explain to dad',
    description: "zero jargon. your friend told you at dinner",
    shipped: true,
  },
}

export const getShippedVibes = (): VibeInfo[] => {
  return Object.values(COIN_VIBES).filter((v) => v.shipped)
}

export const getVibeInfo = (id: CoinVibe): VibeInfo => {
  return COIN_VIBES[id] ?? COIN_VIBES['']!
}
