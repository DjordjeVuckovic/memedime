import { z } from 'zod'

export const getSchemaDescription = <T extends  z.ZodSchema>(schema: T): {
  description: string | undefined,
  jsonSchema: Record<string, unknown>,
} => {
  const jsonSpec = z.toJSONSchema(schema)
  return {
    description: schema.meta()?.description,
    jsonSchema: jsonSpec,
  }
}

export const percentageField = z.preprocess(
  (val) => {
    if (typeof val === 'number') return `${val}%`
    if (typeof val === 'string') return val
    return val
  },
  z.string().optional()
)
