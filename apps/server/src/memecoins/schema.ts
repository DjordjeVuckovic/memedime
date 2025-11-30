import {z} from 'zod'

export const MemeComboSchema = z.object({
  name: z.string(),
  emoji: z.string(),
})

export const GenMemeReqSchema = z.object({
  prompt: z.string().optional(),
  combos: z.array(MemeComboSchema),
})

export type GenFunMemeReq = z.infer<typeof GenMemeReqSchema>
export type MemeCombo = z.infer<typeof MemeComboSchema>
