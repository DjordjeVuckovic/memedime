import { z } from 'zod'

export const getSchemaDescription = <T extends z.ZodSchema>(
  schema: T,
): {
  description: string | undefined
  jsonSchema: Record<string, unknown>
} => {
  const jsonSpec = z.toJSONSchema(schema)
  return {
    description: schema.meta()?.description,
    jsonSchema: jsonSpec,
  }
}
