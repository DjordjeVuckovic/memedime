import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { logger } from '../shared/logger'
import { ConfigurationError } from '../shared/errors'

export type DatabaseConfig = {
  url: string
  authToken?: string
}

let _db: LibSQLDatabase | null = null;

/**
 * Initialize the database with configuration
 * Call this once at application startup
 */
export const initDb = (config: DatabaseConfig): LibSQLDatabase => {
  if (_db) {
    return _db
  }

  const client = createClient({
    url: config.url,
    authToken: config.authToken,
  });

  _db = drizzle({ client });

  logger.info({
    dbUrl: config.url.includes('libsql') ? 'Turso (remote)' : 'SQLite (local)',
  }, 'Database connection initialized');

  return _db;
}

/**
 * Get database instance (must call initDb first)
 */
export const getDb = (): LibSQLDatabase => {
  if (!_db) {
    throw new ConfigurationError('Database not initialized. Call initDb() first.')
  }
  return _db;
};
