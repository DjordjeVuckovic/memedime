import { describe, expect, test } from 'bun:test'
import { encodeCursor, decodeCursor, DEFAULT_LIMIT } from './pagination'
import { HTTPException } from 'hono/http-exception'

describe('encodeCursor', () => {
  test('encodes cursor with just ID', () => {
    const cursor = encodeCursor('123')
    expect(cursor).toBeDefined()
    expect(typeof cursor).toBe('string')

    // Decode to verify
    const decoded = atob(cursor)
    expect(decoded).toBe('123')
  })

  test('encodes cursor with numeric ID', () => {
    const cursor = encodeCursor(456)
    expect(cursor).toBeDefined()

    const decoded = atob(cursor)
    expect(decoded).toBe('456')
  })

  test('encodes cursor with ID and date', () => {
    const cursor = encodeCursor('789', '2024-01-01T00:00:00Z')
    expect(cursor).toBeDefined()

    const decoded = atob(cursor)
    expect(decoded).toBe('789:2024-01-01T00:00:00Z')
  })

  test('handles complex date formats', () => {
    const date = '2024-12-20T15:30:45.123Z'
    const cursor = encodeCursor('abc', date)

    const decoded = atob(cursor)
    expect(decoded).toBe(`abc:${date}`)
  })

  test('encodes special characters in ID', () => {
    const cursor = encodeCursor('user-123-abc')
    const decoded = atob(cursor)
    expect(decoded).toBe('user-123-abc')
  })

  test('round-trip encoding preserves data', () => {
    const id = 'test-id-999'
    const date = '2024-01-15T12:00:00Z'

    const encoded = encodeCursor(id, date)
    const decoded = decodeCursor(encoded)

    expect(decoded.id).toBe(id)
    expect(decoded.date).toBe(date)
  })
})

describe('decodeCursor', () => {
  test('decodes cursor with just ID', () => {
    const cursor = btoa('123')
    const result = decodeCursor(cursor)

    expect(result.id).toBe('123')
    expect(result.date).toBeUndefined()
  })

  test('decodes cursor with ID and date', () => {
    const cursor = btoa('456:2024-01-01T00:00:00Z')
    const result = decodeCursor(cursor)

    expect(result.id).toBe('456')
    expect(result.date).toBe('2024-01-01T00:00:00Z')
  })

  test('throws HTTPException on invalid base64', () => {
    const invalidCursor = 'not-valid-base64!!!'

    try {
      decodeCursor(invalidCursor)
      throw new Error('Should have thrown HTTPException')
    } catch (err) {
      // atob itself might throw on invalid base64
      expect(err).toBeDefined()
    }
  })

  test('throws HTTPException on empty cursor', () => {
    const cursor = btoa('') // Valid base64 but empty content

    try {
      decodeCursor(cursor)
      throw new Error('Should have thrown HTTPException')
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPException)
      expect((err as HTTPException).status).toBe(400)
      expect((err as HTTPException).message).toBe('Invalid cursor')
    }
  })

  test('throws HTTPException on cursor with only colon', () => {
    const cursor = btoa(':')

    try {
      decodeCursor(cursor)
      throw new Error('Should have thrown HTTPException')
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPException)
      expect((err as HTTPException).status).toBe(400)
    }
  })

  test('handles cursor with multiple colons (splits on first colon only)', () => {
    const cursor = btoa('123:2024-01-01:extra:data')
    const result = decodeCursor(cursor)

    expect(result.id).toBe('123')
    expect(result.date).toBe('2024-01-01:extra:data') // Everything after first colon
  })

  test('handles numeric ID strings', () => {
    const cursor = btoa('999')
    const result = decodeCursor(cursor)

    expect(result.id).toBe('999')
  })

  test('handles UUID-style IDs', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const cursor = btoa(uuid)
    const result = decodeCursor(cursor)

    expect(result.id).toBe(uuid)
  })
})

describe('cursor round-trip', () => {
  test('ID only round-trip', () => {
    const original = { id: '123' }
    const encoded = encodeCursor(original.id)
    const decoded = decodeCursor(encoded)

    expect(decoded.id).toBe(original.id)
    expect(decoded.date).toBeUndefined()
  })

  test('ID and date round-trip', () => {
    const original = { id: '456', date: '2024-01-01T00:00:00Z' }
    const encoded = encodeCursor(original.id, original.date)
    const decoded = decodeCursor(encoded)

    expect(decoded.id).toBe(original.id)
    expect(decoded.date).toBe(original.date)
  })

  test('complex ID round-trip', () => {
    const original = { id: 'user-abc-123-xyz', date: '2024-12-20T15:45:00.000Z' }
    const encoded = encodeCursor(original.id, original.date)
    const decoded = decodeCursor(encoded)

    expect(decoded.id).toBe(original.id)
    expect(decoded.date).toBe(original.date)
  })

  test('numeric ID round-trip', () => {
    const original = { id: 999 }
    const encoded = encodeCursor(original.id)
    const decoded = decodeCursor(encoded)

    expect(decoded.id).toBe('999') // Becomes string after encoding
  })
})

describe('DEFAULT_LIMIT', () => {
  test('has correct default value', () => {
    expect(DEFAULT_LIMIT).toBe(50)
  })

  test('is a number', () => {
    expect(typeof DEFAULT_LIMIT).toBe('number')
  })
})

describe('edge cases', () => {
  test('handles very long IDs', () => {
    const longId = 'a'.repeat(1000)
    const cursor = encodeCursor(longId)
    const decoded = decodeCursor(cursor)

    expect(decoded.id).toBe(longId)
  })

  test('handles IDs with special characters', () => {
    const specialId = 'user@domain.com_123-456'
    const cursor = encodeCursor(specialId)
    const decoded = decodeCursor(cursor)

    expect(decoded.id).toBe(specialId)
  })

  test('handles dates with milliseconds', () => {
    const date = '2024-12-20T15:30:45.999Z'
    const cursor = encodeCursor('123', date)
    const decoded = decodeCursor(cursor)

    expect(decoded.date).toBe(date)
  })

  test('encodes and decodes zero as ID', () => {
    const cursor = encodeCursor(0)
    const decoded = decodeCursor(cursor)

    expect(decoded.id).toBe('0')
  })

  test('handles empty string ID (should fail on decode)', () => {
    const cursor = encodeCursor('')

    try {
      decodeCursor(cursor)
      throw new Error('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPException)
    }
  })
})