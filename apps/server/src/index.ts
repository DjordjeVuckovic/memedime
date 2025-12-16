import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Scalar } from '@scalar/hono-api-reference'
import memeRouter from './coins'
import { openAPIRouteHandler } from 'hono-openapi'
import { appEnv } from './shared/env'
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown'
const APP_ORIGIN = appEnv.APP_ORIGIN

const app = new Hono({
  strict: false,
})

app.use(logger())

app.use(
  cors({
    origin: appEnv.CORS_ORIGINS,
    allowMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  }),
)

app.route('/api/', memeRouter)

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
    console.error(err)
    return c.text('Internal Server Error', 500)
  })

export default {
  port: appEnv.PORT,
  fetch: app.fetch,
}
