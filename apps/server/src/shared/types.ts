export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export const extend = <T extends Record<string, unknown>, U extends Record<string, unknown>>(
  obj: T,
  extension: U
): T & U => {
  return { ...obj, ...extension };
}

export function pipe<A, B>(value: A, fn1: (v: A) => B): B
export function pipe<A, B, C>(value: A, fn1: (v: A) => B, fn2: (v: B) => C): C
export function pipe<A, B, C, D>(value: A, fn1: (v: A) => B, fn2: (v: B) => C, fn3: (v: C) => D): D
export function pipe<A, B, C, D, E>(value: A, fn1: (v: A) => B, fn2: (v: B) => C, fn3: (v: C) => D, fn4: (v: D) => E): E
export function pipe(value: unknown, ...fns: ((v: any) => unknown)[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value)
}
