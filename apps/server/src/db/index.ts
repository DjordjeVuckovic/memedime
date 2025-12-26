import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { appEnv } from '../shared/env'
import { logger } from '../shared/logger'

let _db: LibSQLDatabase | null = null;

/**
 * Get database instance (lazy-initialized on first call)
 * createClient is synchronous - it just creates the client instance
 * Actual DB operations (queries) are async
 */
export const getDb = (): LibSQLDatabase => {
  if (!_db) {
    const client = createClient({
      url: appEnv.DB_URL,
      authToken: appEnv.DB_AUTH_TOKEN,
    });

    _db = drizzle({ client });

    logger.info({
      dbUrl: appEnv.DB_URL.includes('libsql') ? 'Turso (remote)' : 'SQLite (local)',
      isProduction: appEnv.NODE_ENV === 'production'
    }, 'Database connection initialized');
  }
  return _db;
};
