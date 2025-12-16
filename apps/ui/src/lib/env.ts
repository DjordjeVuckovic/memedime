import { z } from 'zod'

const metaEnv = import.meta.env

export const appEnvSchema = z.object({
  API_URL: z.string().optional().default('http://localhost:1312'),
  GITHUB_REPO_URL: z.string().optional().default('https://github.com/memedime/memedime'),
  X_PROFILE_URL: z.string().optional().default('https://x.com/memedime'),
  REDDIT_URL: z.string().optional().default('https://reddit.com/r/memedime'),
})

export const appEnv = appEnvSchema.parse({
  API_URL: metaEnv.VITE_API_URL,
  GITHUB_REPO_URL: metaEnv.VITE_GITHUB_REPO_URL,
  X_PROFILE_URL: metaEnv.VITE_X_PROFILE_URL,
  REDDIT_URL: metaEnv.VITE_REDDIT_URL,
})
