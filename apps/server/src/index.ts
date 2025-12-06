import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Scalar } from '@scalar/hono-api-reference'
import memeRouter from './coins'
import { openAPIRouteHandler } from 'hono-openapi'
import { appEnv } from './shared/env'

const app = new Hono({
  strict: false
})

app.use(logger())

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
)

app
  .get('/health', (c) => {
    return c.text('Healthy', 200)
  })
  .onError((err, c) => {
    console.error(err)
    return c.text('Internal Server Error', 500)
  })

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
    description: 'API documentation for the Memedime server',
  }),
)

// const markdown = await createMarkdownFromOpenApi(content)
// app.get('/llms.txt', (c) => c.text(markdown))

export default {
  port: appEnv.PORT,
  fetch: app.fetch,
}
