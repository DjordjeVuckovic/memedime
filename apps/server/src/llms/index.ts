import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { PersonaSchema } from './schemas'
import { getPersonas } from './handlers'

const llmRouter = new Hono()

llmRouter
  .post(
    "/llm/personas",
    describeRoute({
      tags: ["LLM"],
      operationId: "getPersonas",
      description: "Get available LLM personas.",
      responses: {
        200: {
          description: "Successful response with available LLM personas.",
          content: {
            "application/json": {
              schema: resolver(PersonaSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      return c.json(getPersonas(), 200)
    }
  );

export default llmRouter;
