import { AggError } from "./errors.ts"
import { logger } from "./logger.ts"

type RetryOptions = {
  retires: number
  delayMs: number
  exponent?: number
  maxDelayMs?: number
  jitter?: boolean
}

export const DEFAULT_RETRIES = 2
export const DEFAULT_DELAY_MS = 1000
export const DEFAULT_EXPONENT = 2
export const DEFAULT_MAX_DELAY_MS = 30_000
export const DEFAULT_JITTER = true

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> => {
  const { retires, delayMs, maxDelayMs, jitter, exponent } = {
    retires: DEFAULT_RETRIES,
    exponent: DEFAULT_EXPONENT,
    jitter: DEFAULT_JITTER,
    delayMs: DEFAULT_DELAY_MS,
    maxDelayMs: DEFAULT_MAX_DELAY_MS,
    ...options,
  }

  if(retires < 1) {
    return fn()
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

  throw new AggError(errors, `All ${retires} attempts failed`);
}
