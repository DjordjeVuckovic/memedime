import { z } from 'zod'
import { EmojiSchema } from '@memedime/contracts'
import { emojis } from '@memedime/contracts'

export type Emoji = z.infer<typeof EmojiSchema>

const randomEmoji = (emojis: Emoji[]): Emoji => {
  const total = emojis.reduce((sum, i) => sum + i.weight, 0)
  let r = Math.random() * total

  for (const item of emojis) {
    r -= item.weight
    if (r <= 0) return item
  }
  let fallbackIdx = Math.floor(Math.random() * emojis.length)
  return emojis[fallbackIdx]!
}

export const spinEmojis = (): {
  animal: Emoji
  food: Emoji
  vibe: Emoji
} => {
  return {
    animal: randomEmoji(emojis.animals),
    food: randomEmoji(emojis.foods),
    vibe: randomEmoji(emojis.vibes),
  }
}

const toString = (emoji: Emoji): string => {
  return `${emoji.emoji} (${emoji.name})`
}
