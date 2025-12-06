export class AggregateError extends Error {
  errors: unknown[];
  constructor(errors: unknown[], message?: string) {
    super(message);
    this.errors = errors;
    this.name = 'AggregateError';
  }
}
