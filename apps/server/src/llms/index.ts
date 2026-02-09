import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { VibeInfoSchema } from './schemas'
import { getVibes } from './handlers'

const llmRouter = new Hono()

llmRouter
  .get(
    "/llm/vibes",
    describeRoute({
      tags: ["LLM"],
      operationId: "getVibes",
      description: "Get available coin vibes.",
      responses: {
        200: {
          description: "Available coin vibes for generation.",
          content: {
            "application/json": {
              schema: resolver(VibeInfoSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      return c.json(getVibes(), 200)
    }
  )

export default llmRouter