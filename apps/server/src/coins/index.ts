import {createLLMClient} from '../llms/client'
import {generateCoin} from './handlers'
import {appEnv} from '../shared/env'
import {Hono} from "hono";
import {
  validator as zValidator,
  resolver,
  describeRoute,
} from "hono-openapi";
import {GenCoinReqSchema} from "./schemas";
import {CoinRespSchema} from "../llms/schemas";

const llmClient = createLLMClient({
  provider: appEnv.LLM_PROVIDER,
  modelId: appEnv.LLM_MODEL_ID,
  baseURL: appEnv.LLM_BASE_URL,
  apiKey: appEnv.LLM_API_KEY,
})

const memeRouter = new Hono()

memeRouter
  .post(
    "/v1/coins",
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
      const coin = await generateCoin(body, llmClient)
      c.header('Location', `/api/v1/coins/${coin.id}`)
      return c.json(coin, 201)
    }
  );

export default memeRouter;
