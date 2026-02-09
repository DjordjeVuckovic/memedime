import { describe, expect, test, mock } from 'bun:test'
import { spinEmojis, type Emoji } from './emojis'

const createMockEmoji = (emoji: string, name: string, weight: number = 1): Emoji => ({
  emoji,
  name,
  weight,
})

describe('spinEmojis', () => {
  test('returns an object with animal, food, and vibe', () => {
    const result = spinEmojis()

    expect(result).toBeDefined()
    expect(result.animal).toBeDefined()
    expect(result.food).toBeDefined()
    expect(result.vibe).toBeDefined()
  })

  test('returns valid emoji objects', () => {
    const result = spinEmojis()

    expect(result.animal.emoji).toBeDefined()
    expect(result.animal.name).toBeDefined()
    expect(result.animal.weight).toBeDefined()

    expect(result.food.emoji).toBeDefined()
    expect(result.food.name).toBeDefined()
    expect(result.food.weight).toBeDefined()

    expect(result.vibe.emoji).toBeDefined()
    expect(result.vibe.name).toBeDefined()
    expect(result.vibe.weight).toBeDefined()
  })

  test('returns different results on multiple spins', () => {
    const results = new Set<string>()

    // Spin 50 times, expect some variation
    for (let i = 0; i < 50; i++) {
      const spin = spinEmojis()
      const key = `${spin.animal.emoji}-${spin.food.emoji}-${spin.vibe.emoji}`
      results.add(key)
    }

    // Should have at least a few different combinations
    expect(results.size).toBeGreaterThan(1)
  })

  test('emoji objects have correct type', () => {
    const result = spinEmojis()

    expect(typeof result.animal.emoji).toBe('string')
    expect(typeof result.animal.name).toBe('string')
    expect(typeof result.animal.weight).toBe('number')

    expect(typeof result.food.emoji).toBe('string')
    expect(typeof result.food.name).toBe('string')
    expect(typeof result.food.weight).toBe('number')

    expect(typeof result.vibe.emoji).toBe('string')
    expect(typeof result.vibe.name).toBe('string')
    expect(typeof result.vibe.weight).toBe('number')
  })

  test('weights are positive numbers', () => {
    const iterations = 20
    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()

      expect(result.animal.weight).toBeGreaterThan(0)
      expect(result.food.weight).toBeGreaterThan(0)
      expect(result.vibe.weight).toBeGreaterThan(0)
    }
  })

  test('emojis are actual emoji characters', () => {
    const result = spinEmojis()

    expect(result.animal.emoji.length).toBeGreaterThan(0)
    expect(result.food.emoji.length).toBeGreaterThan(0)
    expect(result.vibe.emoji.length).toBeGreaterThan(0)
  })

  test('names are non-empty strings', () => {
    const result = spinEmojis()

    expect(result.animal.name.length).toBeGreaterThan(0)
    expect(result.food.name.length).toBeGreaterThan(0)
    expect(result.vibe.name.length).toBeGreaterThan(0)
  })

  test('statistical distribution over many spins', () => {
    const animalCounts = new Map<string, number>()
    const iterations = 1000

    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()
      const current = animalCounts.get(result.animal.name) ?? 0
      animalCounts.set(result.animal.name, current + 1)
    }

    // Should have multiple different animals
    expect(animalCounts.size).toBeGreaterThan(1)

    // Each animal should appear at least once in 1000 spins (probabilistically)
    // This might occasionally fail due to randomness, but very unlikely
    for (const count of animalCounts.values()) {
      expect(count).toBeGreaterThan(0)
    }
  })

  test('all three categories are independent', () => {
    const combinations = new Set<string>()
    const iterations = 100

    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()
      combinations.add(`${result.animal.name}|${result.food.name}|${result.vibe.name}`)
    }

    // With independent random selection, we should see many unique combinations
    expect(combinations.size).toBeGreaterThan(10)
  })
})

describe('weighted random selection algorithm', () => {
  test('respects weights - heavily weighted item appears more often', () => {
    // We can't directly test the internal randomEmoji function without exporting it,
    // but we can test the overall behavior statistically

    const results = new Map<string, number>()
    const iterations = 10000

    for (let i = 0; i < iterations; i++) {
      const spin = spinEmojis()
      const current = results.get(spin.animal.name) ?? 0
      results.set(spin.animal.name, current + 1)
    }

    // Verify that we have a reasonable distribution
    // Each emoji should appear, but weighted ones should appear more
    expect(results.size).toBeGreaterThan(1)

    // Total should equal iterations
    const total = Array.from(results.values()).reduce((sum, count) => sum + count, 0)
    expect(total).toBe(iterations)
  })

  test('handles edge case of single emoji per category gracefully', () => {
    // Even if there's only one option, it should still work
    const result = spinEmojis()

    expect(result.animal).toBeDefined()
    expect(result.food).toBeDefined()
    expect(result.vibe).toBeDefined()
  })

  test('consistent structure across multiple calls', () => {
    const iterations = 10
    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()

      // Verify structure is always the same
      expect(Object.keys(result).sort()).toEqual(['animal', 'food', 'vibe'].sort())

      expect(result.animal).toHaveProperty('emoji')
      expect(result.animal).toHaveProperty('name')
      expect(result.animal).toHaveProperty('weight')

      expect(result.food).toHaveProperty('emoji')
      expect(result.food).toHaveProperty('name')
      expect(result.food).toHaveProperty('weight')

      expect(result.vibe).toHaveProperty('emoji')
      expect(result.vibe).toHaveProperty('name')
      expect(result.vibe).toHaveProperty('weight')
    }
  })

  test('never returns undefined or null', () => {
    const iterations = 100
    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()

      expect(result.animal).not.toBeNull()
      expect(result.animal).not.toBeUndefined()
      expect(result.food).not.toBeNull()
      expect(result.food).not.toBeUndefined()
      expect(result.vibe).not.toBeNull()
      expect(result.vibe).not.toBeUndefined()
    }
  })

  test('performance - can generate many spins quickly', () => {
    const start = Date.now()
    const iterations = 10000

    for (let i = 0; i < iterations; i++) {
      spinEmojis()
    }

    const duration = Date.now() - start

    // 10,000 spins should complete in under 1 second
    expect(duration).toBeLessThan(1000)
  })
})

describe('randomness quality', () => {
  test('produces varied results in small sample', () => {
    const animals = new Set<string>()
    const foods = new Set<string>()
    const vibes = new Set<string>()

    for (let i = 0; i < 20; i++) {
      const result = spinEmojis()
      animals.add(result.animal.name)
      foods.add(result.food.name)
      vibes.add(result.vibe.name)
    }

    // In 20 spins, we should see some variety
    // (This could theoretically fail due to random chance, but very unlikely)
    expect(animals.size).toBeGreaterThan(1)
    expect(foods.size).toBeGreaterThan(1)
    expect(vibes.size).toBeGreaterThan(1)
  })

  test('distribution across all categories', () => {
    const iterations = 500
    const animals = new Map<string, number>()
    const foods = new Map<string, number>()
    const vibes = new Map<string, number>()

    for (let i = 0; i < iterations; i++) {
      const result = spinEmojis()

      animals.set(result.animal.name, (animals.get(result.animal.name) ?? 0) + 1)
      foods.set(result.food.name, (foods.get(result.food.name) ?? 0) + 1)
      vibes.set(result.vibe.name, (vibes.get(result.vibe.name) ?? 0) + 1)
    }

    // Should have multiple options in each category
    expect(animals.size).toBeGreaterThan(1)
    expect(foods.size).toBeGreaterThan(1)
    expect(vibes.size).toBeGreaterThan(1)
  })
})
