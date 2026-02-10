/**
 * Base domain error class
 * All domain errors should extend this class
 */
export class DomainError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.details = details

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details }),
    }
  }
}

/**
 * Resource not found (404)
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`

    super(message, 'NOT_FOUND', 404, { resource, identifier })
  }
}

/**
 * Invalid input data (400)
 */
export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

/**
 * AI generation failed (422 - Unprocessable Entity)
 * Used when LLM fails to generate valid output
 */
export class GenerationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'GENERATION_ERROR', 422, details)
  }
}

/**
 * Database operation failed (500)
 */
export class DatabaseError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DATABASE_ERROR', 500, details)
  }
}

/**
 * Database constraint violation (409 - Conflict)
 */
export class ConflictError extends DomainError {
  constructor(resource: string, identifier: string, details?: Record<string, unknown>) {
    super(
      `${resource} with identifier '${identifier}' already exists`,
      'CONFLICT',
      409,
      { resource, identifier, ...details }
    )
  }
}

/**
 * Invalid cursor for pagination (400)
 */
export class InvalidCursorError extends DomainError {
  constructor(cursor?: string) {
    super('Invalid pagination cursor', 'INVALID_CURSOR', 400, { cursor })
  }
}

/**
 * Configuration error (500)
 */
export class ConfigurationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', 500, details)
  }
}

/**
 * LLM provider error (502 - Bad Gateway)
 * Used when external LLM service fails
 */
export class LLMProviderError extends DomainError {
  constructor(provider: string, message: string, details?: Record<string, unknown>) {
    super(
      `LLM provider '${provider}' failed: ${message}`,
      'LLM_PROVIDER_ERROR',
      502,
      { provider, ...details }
    )
  }
}

/**
 * Aggregate error - wraps multiple errors
 * Used when retry operations fail
 */
export class AggError extends DomainError {
  public readonly errors: unknown[]

  constructor(errors: unknown[], message?: string) {
    const errorMsg = message || `Multiple errors occurred (${errors.length} errors)`
    super(errorMsg, 'AGGREGATE_ERROR', 500, { errorCount: errors.length })
    this.name = 'AggregateError'
    this.errors = errors
  }
}

/**
 * Type guard to check if an error is a DomainError
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError
}

/**
 * Get HTTP status code from any error
 * Returns 500 for unknown errors
 */
export function getStatusCode(error: unknown): number {
  if (isDomainError(error)) {
    return error.statusCode
  }
  return 500
}

/**
 * Get error response body for API
 */
export function getErrorResponse(error: unknown): { error: string; code?: string; details?: Record<string, unknown> } {
  if (isDomainError(error)) {
    const { code, message, details } = error
    return { error: message, code, ...(details && { details }) }
  }

  if (error instanceof Error) {
    return { error: error.message }
  }

  return { error: 'An unknown error occurred' }
}
