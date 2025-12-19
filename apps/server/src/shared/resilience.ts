import { AggregateError } from './errors'
import { logger } from './logger'

type RetryOptions = {
  retires: number
  delayMs: number
  exponent?: number
  maxDelayMs?: number
  jitter?: boolean
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> => {
  const { retires, delayMs, maxDelayMs, jitter, exponent } = {
    retires: 2,
    exponent: 2,
    jitter: true,
    delayMs: 1000,
    maxDelayMs: 30_000,
    ...options,
  }
  let errors: unknown[] = [];

  for (let attempt = 1; attempt <= retires; attempt++) {
    try {
      if(attempt > 1) {
        logger.debug(`Retrying ${attempt}/${retires}`)
      }
      return await fn()
    } catch (err) {
      let delay = Math.min(maxDelayMs, delayMs * Math.pow(exponent, attempt - 1))
      if(jitter) {
        delay = delay * Math.random()
      }
      errors.push(err)
      await wait(delay)
    }
  }

  throw new AggregateError(errors, `All ${retires + 1} attempts failed`);
}
