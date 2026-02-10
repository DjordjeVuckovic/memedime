import type { MiddlewareHandler } from 'hono'
import { createChildLogger } from '@memedime/core'

const ignoredPaths = new Set([
  '/health',
  '/openapi.json',
  '/docs',
])

export const requestLogger: MiddlewareHandler = async (c, next) => {

  if(ignoredPaths.has(c.req.path)) {
    await next()
    return
  }

  const requestId = crypto.randomUUID()
  const start = Date.now()

  const reqLogger = createChildLogger({
    requestId,
    method: c.req.method,
    path: c.req.path,
  })

  c.set('logger', reqLogger)
  c.set('requestId', requestId)

  reqLogger.info(
    {
      event: 'request.start',
      headers: {
        userAgent: c.req.header('user-agent'),
        contentType: c.req.header('content-type'),
      },
    },
    'Request received',
  )

  await next()

  const duration = Date.now() - start
  const status = c.res.status

  const logMethod = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

  reqLogger[logMethod](
    {
      event: 'request.complete',
      statusCode: status,
      duration,
      durationMs: duration,
    },
    `Request completed in ${duration}ms`,
  )
}
