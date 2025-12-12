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

export const percentageField = z
  .union([z.number(), z.string(), z.undefined()])
  .transform((val) => {
    if (val === undefined) return undefined
    if (typeof val === 'number') return `${val}%`
    return val
  })
  .optional()
