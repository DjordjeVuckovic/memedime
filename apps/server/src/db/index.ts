import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { appEnv } from '../shared/env'
import { logger } from '../shared/logger'

const client = createClient({
  url: appEnv.DB_URL,
  authToken: appEnv.DB_AUTH_TOKEN,
});

export const db = drizzle({ client });

logger.info({
  dbUrl: appEnv.DB_URL.includes('libsql') ? 'Turso (remote)' : 'SQLite (local)',
  isProduction: appEnv.NODE_ENV === 'production'
}, 'Database connection initialized')
