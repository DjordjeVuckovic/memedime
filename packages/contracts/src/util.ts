import {z} from "zod";

export const percentageField = z.preprocess(
  (val) => {
    if (typeof val === 'string') {
      return val.endsWith('%') ? val.slice(0, -1) : val
    }
    return val
  },
  z.string().nullish()
)
