import { z } from 'zod'

export const appEnvSchema = z.object({
  API_URL: z.string().optional().default('http://localhost:1312')
});

export const appEnv = appEnvSchema.parse(Bun.env);
