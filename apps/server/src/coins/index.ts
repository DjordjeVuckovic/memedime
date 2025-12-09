import {createLLMClient} from '../llms/client'
import { generateCoin, getCoinById } from './handlers'
import {appEnv} from '../shared/env'
import {Hono} from "hono";
import {
  validator as zValidator,
  resolver,
  describeRoute,
} from "hono-openapi";
import {GenCoinReqSchema, ModeSchema } from "./schemas";
import {CoinRespSchema} from "../llms/schemas";

const llmClient = createLLMClient({
  provider: appEnv.LLM_PROVIDER,
  modelId: appEnv.LLM_MODEL_ID,
  baseURL: appEnv.LLM_BASE_URL,
  apiKey: appEnv.LLM_API_KEY,
})

const BASE_PATH = '/v1/coins'
const memeRouter = new Hono()

memeRouter
  .post(
    `${BASE_PATH}`,
    describeRoute({
      tags: ["Coins"],
      operationId: "generateCoin",
      description: "Generate a coin based on the provided input.",
      responses: {
        201: {
          description: "Successful response with generated coins coin.",
          content: {
            "application/json": {
              schema: resolver(CoinRespSchema)
            }
          }
        }
      }
    }),
    zValidator('json', GenCoinReqSchema),
    async (c) => {
      const body = c.req.valid('json')

      const modeQuery = c.req.query('mode') || 'random'
      const mode = ModeSchema.parse(modeQuery)

      const coin = await generateCoin({
        req: body,
        mode,
        llmClient
      })

      c.header('Location', `${BASE_PATH}/${coin.id}`)
      return c.json(coin, 201)
    }
  );

memeRouter
  .get(
    `${BASE_PATH}/:id`,
    describeRoute({
      tags: ["Coins"],
      operationId: "getCoin",
      responses: {
        201: {
          description: "Successful response with coin by id",
          content: {
            "application/json": {
              schema: resolver(CoinRespSchema)
            }
          }
        },
        404: {
          description: "Coin not found"
        }
      }
    }),
    async (c) => {
      const idParam = c.req.param('id')
      const id = Number(idParam)
      if(Number.isNaN(id)) {
        return c.json({ message: 'Invalid ID type' }, 400)
      }

      const coin = await getCoinById(id)
      if (!coin) {
        return c.json({ message: 'Coin not found' }, 404)
      }

      return c.json(coin, 200)
    }
  );

memeRouter.get(
  `${BASE_PATH}/:id`,
  async (c) => {
    c.status(200)
    return c.json({ message: 'pong' })
  });

export default memeRouter;
