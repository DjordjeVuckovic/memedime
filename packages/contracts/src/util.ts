import {z} from "zod";

export const percentageField = z.preprocess(
  (val) => {
    if (typeof val === 'number') return `${val}%`
    if (typeof val === 'string') return val
    return val
  },
  z.string().optional()
)
