import { createLLMClient } from '../llms/client'
import { generateCoin, getCoinById, searchCoins } from './handlers'
import { appEnv } from '../shared/env'
import { AggError, GenerationError } from '../shared/errors'
import { Hono } from 'hono'
import { describeRoute, resolver, validator as zValidator } from 'hono-openapi'
import { z, ZodError } from 'zod'
import {
  CoinRespSchema,
  CoinsRespSchema,
  GenCoinReqUnionSchema,
  ModeSchema,
  SearchReqSchema,
  SortBySchema,
} from '@memedime/contracts'

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
    description: 'generate a coin based on the provided input.',
    responses: {
      201: {
        description: 'successful response with generated coins coin.',
        content: {
          'application/json': {
            schema: resolver(CoinRespSchema),
          },
        },
      },
    },
  }),
  zValidator('json', GenCoinReqUnionSchema),
  async (c) => {
    const body = c.req.valid('json')

    try {
      const coin = await generateCoin({
        req: body,
        llmClient,
      })

      c.header('Location', `${BASE_PATH}/${coin.id}`)
      return c.json(coin, 201)
    } catch (err) {
      if (err instanceof GenerationError || err instanceof ZodError || err instanceof AggError) {
        return c.json({ error: 'ai generated slop. try again!' }, 422)
      }
      throw err
    }
  },
)

memeRouter.get(
  `${BASE_PATH}/:id`,
  describeRoute({
    tags: ['Coins'],
    operationId: 'getCoin',
    responses: {
      201: {
        description: 'successful response with coin by id',
        content: {
          'application/json': {
            schema: resolver(CoinRespSchema),
          },
        },
      },
      404: {
        description: 'coin not found',
      },
    },
  }),
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param')

    const coin = await getCoinById(id)
    if (!coin) {
      return c.json({ message: 'coin not found' }, 404)
    }

    return c.json(coin, 200)
  },
)

memeRouter.get(
  `${BASE_PATH}`,
  describeRoute({
    tags: ['Coins'],
    operationId: 'searchCoins',
    description: 'search for coins based on a query string and optional mode.',
    parameters: [
      {
        name: 'q',
        in: 'query',
        required: false,
        description: 'The search query string.',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'mode',
        in: 'query',
        required: false,
        description: 'optional mode to filter the search results.',
        schema: {
          type: 'string',
          enum: ModeSchema.options,
        },
      },
      {
        name: 'sortBy',
        in: 'query',
        required: false,
        description: 'optional sort order for the search results.',
        schema: {
          type: 'string',
          enum: SortBySchema.options,
        },
      },
    ],
    responses: {
      200: {
        description: 'successful response with a list of matching coins.',
        content: {
          'application/json': {
            schema: resolver(CoinsRespSchema),
          },
        },
      },
      400: {
        description: 'bad request due to missing or invalid parameters.',
      },
    },
  }),
  zValidator('query', SearchReqSchema),
  async (c) => {
    const { q, mode, sortBy, limit, cursor } = c.req.valid('query')

    const searchResult = await searchCoins({
      q,
      mode,
      sortBy,
      limit,
      cursor,
    })

    return c.json(
      CoinsRespSchema.parse({
        ...searchResult,
      }),
      200,
    )
  },
)

export default memeRouter
