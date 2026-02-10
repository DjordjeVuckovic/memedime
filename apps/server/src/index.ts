import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import memeRouter from './routes/coins.ts'
import statsRouter from './routes/stats.ts'
import { openAPIRouteHandler } from 'hono-openapi'
import { appEnv, getDatabaseConfig, getLLMConfig, getLoggerConfig } from './env.ts'
import { initDb, createLogger, createLLMClient, getStatusCode, getErrorResponse, isDomainError } from '@memedime/core'
import { requestLogger } from './middleware/logging'
import './types/hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'

const logger = createLogger(getLoggerConfig())

initDb(getDatabaseConfig())

export const llmClient = createLLMClient(getLLMConfig())

const app = new Hono({
  strict: false,
})

app.use(requestLogger)

app.use(
  cors({
    origin: appEnv.CORS_ORIGINS,
    allowMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  }),
)

app.route('/api/', memeRouter)
app.route('/api/', statsRouter)

app.get(
  '/openapi.json',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'MemeDime API',
        version: '1.0.0',
        description: 'API for AI powered coins coin generation',
      },
    },
  }),
)

app.get(
  '/docs',
  Scalar({
    url: '/openapi.json',
    theme: 'purple',
    pageTitle: 'Memedime Server API',
    title: 'Memedime Server API',
  }),
)
// await fetch(`${APP_ORIGIN}/openapi.json`).then(async (text) => {
//   const markdown = await createMarkdownFromOpenApi(text)
//   app.get('/llms.txt', (c) => c.text(markdown))
// })

app
  .get('/health', (c) => {
    return c.text('Healthy', 200)
  })
  .onError((err, c) => {
    const reqLogger = c.get('logger') || logger

    if (err instanceof HTTPException) {
      reqLogger.warn(
        {
          err,
          path: c.req.path,
          method: c.req.method,
          requestId: c.get('requestId'),
        },
        'HTTP error in request handler',
      )
      return c.json({ error: err.message }, err.status)
    }

    if (err instanceof ZodError) {
      reqLogger.warn(
        {
          err,
          path: c.req.path,
          method: c.req.method,
          requestId: c.get('requestId'),
        },
        'Validation error in request handler',
      )
      return c.json({ error: err.message }, 422)
    }

    if (isDomainError(err)) {
      const statusCode = err.statusCode as 400 | 401 | 402 | 403 | 404 | 409 | 422 | 500 | 502
      const errorResponse = getErrorResponse(err)

      const logLevel = statusCode >= 500 ? 'error' : 'warn'

      reqLogger[logLevel](
        {
          err,
          path: c.req.path,
          method: c.req.method,
          requestId: c.get('requestId'),
          code: err.code,
          details: err.details,
        },
        `Domain error: ${err.name}`,
      )

      return c.json(errorResponse, statusCode)
    }

    reqLogger.error(
      {
        err,
        path: c.req.path,
        method: c.req.method,
        requestId: c.get('requestId'),
      },
      'Unhandled error in request handler',
    )

    return c.json({ error: 'Internal Server Error' }, 500)
  })

export default {
  port: appEnv.PORT,
  fetch: app.fetch,
  onStart() {
    logger.info(
      {
        port: appEnv.PORT,
        cors: appEnv.CORS_ORIGINS,
        llmProvider: appEnv.LLM_PROVIDER,
        nodeEnv: appEnv.NODE_ENV,
      },
      `MemeDime server listening on port ${appEnv.PORT}`,
    )
  },
}
