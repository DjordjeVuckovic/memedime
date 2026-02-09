import { describe, expect, test, beforeEach } from 'bun:test'
import { withRetry, DEFAULT_RETRIES, DEFAULT_EXPONENT } from './resilience'
import { AggError } from './errors'

describe('withRetry', () => {
  let callCount: number

  beforeEach(() => {
    callCount = 0
  })

  test('succeeds on first attempt', async () => {
    const successFn = async () => {
      callCount++
      return 'success'
    }

    const result = await withRetry(successFn, { retires: 3, delayMs: 10 })

    expect(result).toBe('success')
    expect(callCount).toBe(1)
  })

  test('succeeds after 2 failures', async () => {
    const eventualSuccessFn = async () => {
      callCount++
      if (callCount < 3) {
        throw new Error(`Attempt ${callCount} failed`)
      }
      return 'success'
    }

    const result = await withRetry(eventualSuccessFn, {
      retires: 3,
      delayMs: 10,
      jitter: false,
    })

    expect(result).toBe('success')
    expect(callCount).toBe(3)
  })

  test('throws AggregateError when all retries fail', async () => {
    const alwaysFailFn = async () => {
      callCount++
      throw new Error(`Attempt ${callCount} failed`)
    }

    try {
      await withRetry(alwaysFailFn, {
        retires: 3,
        delayMs: 10,
        jitter: false,
      })
      throw new Error('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(AggError)
      expect((err as AggError).errors).toHaveLength(3)
      expect(callCount).toBe(3)
    }
  })

  test('applies exponential backoff correctly', async () => {
    const delays: number[] = []
    let lastTime = Date.now()
    const testRetries = 3
    const testDelayMs = 100

    const trackingFn = async () => {
      const now = Date.now()
      if (callCount > 0) {
        delays.push(now - lastTime)
      }
      lastTime = now
      callCount++
      throw new Error('fail')
    }

    try {
      await withRetry(trackingFn, {
        retires: testRetries,
        delayMs: testDelayMs,
        exponent: DEFAULT_EXPONENT,
        jitter: false,
      })
    } catch (err) {
      // Expected to fail
    }

    // With retires=3, we get 2 delays (between attempt 1->2 and 2->3)
    // First delay: 100 * 2^0 = 100ms
    // Second delay: 100 * 2^1 = 200ms
    expect(delays).toHaveLength(testRetries - 1)

    expect(delays[0]).toBeGreaterThanOrEqual(90) // Allow some margin
    expect(delays[0]).toBeLessThan(150)

    expect(delays[1]).toBeGreaterThanOrEqual(190)
    expect(delays[1]).toBeLessThan(250)
  })

  test('respects maxDelayMs cap', async () => {
    const delays: number[] = []
    let lastTime = Date.now()
    const testRetries = 4
    const testDelayMs = 100
    const testMaxDelayMs = 150

    const trackingFn = async () => {
      const now = Date.now()
      if (callCount > 0) {
        delays.push(now - lastTime)
      }
      lastTime = now
      callCount++
      throw new Error('fail')
    }

    try {
      await withRetry(trackingFn, {
        retires: testRetries,
        delayMs: testDelayMs,
        exponent: DEFAULT_EXPONENT,
        maxDelayMs: testMaxDelayMs,
        jitter: false,
      })
    } catch (err) {
      // Expected to fail
    }

    // With retires=4, we get 3 delays
    // First delay: 100ms
    // Second delay: 200ms → capped to 150ms
    // Third delay: 400ms → capped to 150ms
    expect(delays).toHaveLength(testRetries - 1)

    expect(delays[0]).toBeGreaterThanOrEqual(testDelayMs - 50)
    expect(delays[0]).toBeLessThan(testDelayMs + 60)

    expect(delays[1]).toBeGreaterThanOrEqual(testMaxDelayMs - 50)
    expect(delays[1]).toBeLessThan(testMaxDelayMs + 60)

    expect(delays[2]).toBeGreaterThanOrEqual(testMaxDelayMs - 50)
    expect(delays[2]).toBeLessThan(testMaxDelayMs + 60)
  })

  test('applies jitter when enabled', async () => {
    const delays: number[] = []
    let lastTime = Date.now()

    const trackingFn = async () => {
      const now = Date.now()
      if (callCount > 0) {
        delays.push(now - lastTime)
      }
      lastTime = now
      callCount++
      throw new Error('fail')
    }

    try {
      await withRetry(trackingFn, {
        retires: 3,
        delayMs: 100,
        exponent: 1,
        jitter: true,
      })
    } catch (err) {
      // Expected to fail
    }

    // With jitter, delays should be randomized (0 to delayMs)
    // All delays should be less than the base delay
    delays.forEach((delay) => {
      expect(delay).toBeGreaterThanOrEqual(0)
      expect(delay).toBeLessThanOrEqual(120) // Some margin for timing
    })
  })

  test('uses default options when not specified', async () => {
    const failOnceFn = async () => {
      callCount++
      if (callCount === 1) {
        throw new Error('fail')
      }
      return 'success'
    }

    const result = await withRetry(failOnceFn)

    expect(result).toBe('success')
    expect(callCount).toBe(DEFAULT_RETRIES)
  })

  test('preserves error information in AggregateError', async () => {
    const failWithDifferentErrors = async () => {
      callCount++
      throw new Error(`Error ${callCount}`)
    }

    try {
      await withRetry(failWithDifferentErrors, {
        retires: 3,
        delayMs: 10,
        jitter: false,
      })
    } catch (err) {
      expect(err).toBeInstanceOf(AggError)
      const aggErr = err as AggError

      expect(aggErr.errors).toHaveLength(3)
      expect((aggErr.errors[0] as Error).message).toBe('Error 1')
      expect((aggErr.errors[1] as Error).message).toBe('Error 2')
      expect((aggErr.errors[2] as Error).message).toBe('Error 3')
    }
  })

  test('handles async function that throws non-Error objects', async () => {
    const throwString = async () => {
      callCount++
      throw 'string error'
    }

    try {
      await withRetry(throwString, { retires: 2, delayMs: 10 })
    } catch (err) {
      expect(err).toBeInstanceOf(AggError)
      const aggErr = err as AggError
      expect(aggErr.errors).toHaveLength(2)
      expect(aggErr.errors[0]).toBe('string error')
    }
  })

  test('with zero retries calls function once', async () => {
    const successFn = async () => {
      callCount++
      return 'success'
    }

    // With retries < 1, it just calls the function once
    const result = await withRetry(successFn, { retires: 0, delayMs: 10 })

    expect(result).toBe('success')
    expect(callCount).toBe(1)
  })
})
