import {createLLMClient} from '../llms/client'
import {generateMemeCoin} from './handle'
import {appEnv} from '../shared/env'
import {Hono} from "hono";
import {
  validator as zValidator,
  resolver,
  describeRoute,
} from "hono-openapi";
import {GenMemeReqSchema} from "./schema";
import {LLMRespSchema} from "../llms/schema";

const llmClient = createLLMClient({
  provider: appEnv.LLM_PROVIDER,
  modelId: appEnv.LLM_MODEL_ID,
  baseURL: appEnv.LLM_BASE_URL,
  apiKey: appEnv.LLM_API_KEY,
})

const memeRouter = new Hono()

memeRouter
  .post(
    "/memecoins",
    describeRoute({
      tags: ["Meme Coins"],
      operationId: "generateMemeCoin",
      description: "Generate a memecoins coin based on the provided input.",
      responses: {
        200: {
          description: "Successful response with generated memecoins coin.",
          content: {
            "application/json": {
              schema: resolver(LLMRespSchema)
            }
          }
        }
      }
    }),
    zValidator('json', GenMemeReqSchema),
    async (c) => {
      const body = c.req.valid('json')
      const gen = await generateMemeCoin(body, llmClient)
      return c.json(gen, 200)
    }
  );

export default memeRouter;
