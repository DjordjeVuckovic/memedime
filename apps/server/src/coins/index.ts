import { createLLMClient } from '../llms/client'
import { generateCoin, getCoinById, searchCoins } from './handlers'
import { appEnv } from '../shared/env'
import { Hono } from 'hono'
import { validator as zValidator, resolver, describeRoute } from 'hono-openapi'
import { GenCoinReqSchema, ModeSchema } from './schemas'
import { CoinRespSchema } from '../llms/schemas'
import { z } from 'zod'

const llmClient = createLLMClient({
  provider: appEnv.LLM_PROVIDER,
  modelId: appEnv.LLM_MODEL_ID,
  baseURL: appEnv.LLM_BASE_URL,
  apiKey: appEnv.LLM_API_KEY,
})

const BASE_PATH = '/v1/coins'
const memeRouter = new Hono()

memeRouter.post(
  `${BASE_PATH}`,
  describeRoute({
    tags: ['Coins'],
    operationId: 'generateCoin',
    description: 'Generate a coin based on the provided input.',
    responses: {
      201: {
        description: 'Successful response with generated coins coin.',
        content: {
          'application/json': {
            schema: resolver(CoinRespSchema),
          },
        },
      },
    },
  }),
  zValidator('json', GenCoinReqSchema),
  async (c) => {
    const body = c.req.valid('json')

    const modeQuery = c.req.query('mode') || 'random'
    const mode = ModeSchema.parse(modeQuery)

    const coin = await generateCoin({
      req: body,
      mode,
      llmClient,
    })

    c.header('Location', `${BASE_PATH}/${coin.id}`)
    return c.json(coin, 201)
  },
)

memeRouter.get(
  `${BASE_PATH}/:id`,
  describeRoute({
    tags: ['Coins'],
    operationId: 'getCoin',
    responses: {
      201: {
        description: 'Successful response with coin by id',
        content: {
          'application/json': {
            schema: resolver(CoinRespSchema),
          },
        },
      },
      404: {
        description: 'Coin not found',
      },
    },
  }),
  zValidator('param', z.object({ id: z.number() })),
  async (c) => {
    const { id } = c.req.valid('param')

    const coin = await getCoinById(id)
    if (!coin) {
      return c.json({ message: 'Coin not found' }, 404)
    }

    return c.json(coin, 200)
  },
)

memeRouter.get(
  `${BASE_PATH}`,
  describeRoute({
    tags: ['Coins'],
    operationId: 'searchCoins',
    description: 'Search for coins based on a query string and optional mode.',
    parameters: [
      {
        name: 'q',
        in: 'query',
        required: true,
        description: 'The search query string.',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'mode',
        in: 'query',
        required: false,
        description: 'Optional mode to filter the search results.',
        schema: {
          type: 'string',
          enum: ModeSchema.options,
        },
      },
    ],
    responses: {
      200: {
        description: 'Successful response with a list of matching coins.',
        content: {
          'application/json': {
            schema: resolver(CoinRespSchema.array()),
          },
        },
      },
      400: {
        description: 'Bad request due to missing or invalid parameters.',
      },
    },
  }),
  zValidator(
    'query',
    z.object({
      q: z.string(),
      mode: ModeSchema.optional(),
    }),
  ),
  async (c) => {
    const { q, mode } = c.req.valid('query')

    const coins = await searchCoins(q, mode)

    return c.json(coins, 200)
  },
)

export default memeRouter
