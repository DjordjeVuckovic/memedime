import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import memeRouter from './coins'
import statsRouter from './stats'
import { openAPIRouteHandler } from 'hono-openapi'
import { appEnv } from './shared/env'
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown'
import { logger } from './shared/logger'
import { requestLogger } from './middleware/logging'
import './types/hono'
import { HTTPException } from 'hono/http-exception'

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
    reqLogger.error(
      {
        err,
        path: c.req.path,
        method: c.req.method,
        requestId: c.get('requestId'),
      },
      'Unhandled error in request handler',
    )
    if(err instanceof HTTPException) {
      return c.json(
        { error: err.message },
        err.status,
      )
    }
    return c.text('Internal Server Error', 500)
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
