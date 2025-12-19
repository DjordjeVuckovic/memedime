import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { appEnv } from '../shared/env'
import { logger } from '../shared/logger'

export const sqlite = new Database(appEnv.DB_URL);

if (appEnv.USE_WAL) {
  logger.info('Enabling WAL mode for SQLite database')
  sqlite.run('PRAGMA journal_mode = WAL;')
}

export const db = drizzle({ client: sqlite});

logger.info({ dbUrl: appEnv.DB_URL }, 'Database connection initialized')
