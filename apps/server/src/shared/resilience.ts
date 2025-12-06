import { AggregateError } from './errors'

type RetryOptions = {
  max: number
  delayMs: number
  exponentialBackoff?: boolean
  jitter?: boolean
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {
    max: 2,
    exponentialBackoff: true,
    delayMs: 1000
  }
): Promise<T> => {
  const { max, exponentialBackoff, jitter, delayMs } = options;
  let errors: unknown[] = [];
  let delay = delayMs;

  for (let attempt = 0; attempt <= max; attempt++) {
    try {
      return await fn();
    } catch (error) {
      errors.push(error);

      if (attempt === max) break;

      if (exponentialBackoff) {
        delay *= 2;
        if (jitter) delay += Math.random() * delay;
      }

      await wait(delay);
    }
  }

  throw new AggregateError(errors, `All ${max + 1} attempts failed`);
}
