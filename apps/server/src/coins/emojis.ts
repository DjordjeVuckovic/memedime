import { z } from 'zod'
import { EmojiSchema } from '@memedime/contracts'

export type Emoji = z.infer<typeof EmojiSchema>

// Reel 1 - Animals
export const ANIMALS: Emoji[] = [
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
  { emoji: '🐵', name: 'Monkey' },
  { emoji: '🐴', name: 'Horse' },
  { emoji: '🐰', name: 'Rabbit' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐢', name: 'Turtle' },
  { emoji: '🐙', name: 'Octopus' },
  { emoji: '🦥', name: 'Sloth' },
  { emoji: '🦘', name: 'Kangaroo' },
  { emoji: '🦩', name: 'Flamingo' },
  { emoji: '🐬', name: 'Dolphin' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🐺', name: 'Wolf' },
  { emoji: '🦓', name: 'Zebra' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🐳', name: 'Whale' },
  { emoji: '🦔', name: 'Hedgehog' },
  { emoji: '🐝', name: 'Bee' },
]

// Reel 2 - Foods
export const FOODS: Emoji[] = [
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
  { emoji: '🍗', name: 'Chicken Leg' },
  { emoji: '🍟', name: 'Fries' },
  { emoji: '🍦', name: 'Ice Cream' },
  { emoji: '🍿', name: 'Popcorn' },
  { emoji: '🥨', name: 'Pretzel' },
  { emoji: '🍫', name: 'Chocolate' },
  { emoji: '🍓', name: 'Strawberry' },
  { emoji: '🥥', name: 'Coconut' },
  { emoji: '🍔', name: 'Cheeseburger' },
  { emoji: '🌯', name: 'Burrito' },
  { emoji: '🍚', name: 'Rice' },
  { emoji: '🥗', name: 'Salad' },
  { emoji: '🍪', name: 'Cookie' },
  { emoji: '🍒', name: 'Cherries' },
  { emoji: '🥕', name: 'Carrot' },
  { emoji: '🍆', name: 'Eggplant' },
  { emoji: '🌽', name: 'Corn' },
  { emoji: '🍞', name: 'Bread' },
  { emoji: '🧀', name: 'Cheese' },
]

// Reel 3 - Vibes
export const VIBES: Emoji[] = [
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
  { emoji: '🌟', name: 'Glowing Star' },
  { emoji: '🎉', name: 'Party Popper' },
  { emoji: '🛸', name: 'UFO' },
  { emoji: '🎵', name: 'Musical Note' },
  { emoji: '💫', name: 'Dizzy' },
  { emoji: '🪐', name: 'Planet' },
  { emoji: '🌈', name: 'Rainbow' },
  { emoji: '🕶️', name: 'Sunglasses' },
  { emoji: '🎆', name: 'Fireworks' },
  { emoji: '🪄', name: 'Magic Wand' },
  { emoji: '⚓', name: 'Anchor' },
  { emoji: '🛡️', name: 'Shield' },
  { emoji: '🏆', name: 'Trophy' },
  { emoji: '🥇', name: 'Gold Medal' },
  { emoji: '💎', name: 'Gem Stone' },
  { emoji: '🚨', name: 'Siren' },
  { emoji: '🧿', name: 'Nazar Amulet' },
  { emoji: '🌌', name: 'Milky Way' },
  { emoji: '🪁', name: 'Kite' },
]

const randomEmoji = (emojis: Emoji[]): Emoji => {
  const index = Math.floor(Math.random() * emojis.length)
  return emojis[index]!
}

export const spinEmojis = (): {
  animal: Emoji
  food: Emoji
  vibe: Emoji
} => {
  return {
    animal: randomEmoji(ANIMALS),
    food: randomEmoji(FOODS),
    vibe: randomEmoji(VIBES),
  }
}

const toString = (emoji: Emoji): string => {
  return `${emoji.emoji} (${emoji.name})`
}
