export class AggregateError extends Error {
  errors: unknown[];
  constructor(errors: unknown[], message?: string) {
    super(message);
    this.errors = errors;
    this.name = 'AggregateError';
  }
}

export class GenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GenerationError'
  }
}
