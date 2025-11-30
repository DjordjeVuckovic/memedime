export interface EmojiData {
  emoji: string
  name: string
}

// Reel 1 - Animals
export const ANIMALS: EmojiData[] = [
  { emoji: '🦫', name: 'Beaver' },
  { emoji: '🐕', name: 'Dog' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🦍', name: 'Gorilla' },
  { emoji: '🐧', name: 'Penguin' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🐮', name: 'Cow' },
]

// Reel 2 - Foods
export const FOODS: EmojiData[] = [
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🍔', name: 'Burger' },
  { emoji: '🌮', name: 'Taco' },
  { emoji: '🍜', name: 'Ramen' },
  { emoji: '🍰', name: 'Cake' },
  { emoji: '🌭', name: 'Hot Dog' },
  { emoji: '🍣', name: 'Sushi' },
  { emoji: '🥑', name: 'Avocado' },
  { emoji: '🍩', name: 'Donut' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '🥓', name: 'Bacon' },
  { emoji: '🍉', name: 'Watermelon' },
]

// Reel 3 - Vibes
export const VIBES: EmojiData[] = [
  { emoji: '💎', name: 'Diamond' },
  { emoji: '🌙', name: 'Moon' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '💀', name: 'Skull' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '👑', name: 'Crown' },
  { emoji: '💰', name: 'Money Bag' },
  { emoji: '🎯', name: 'Target' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🎪', name: 'Circus' },
  { emoji: '🌊', name: 'Wave' },
]

export const REEL_DATA = [ANIMALS, FOODS, VIBES]
