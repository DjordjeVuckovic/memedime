import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { appEnv } from '../shared/env'

export const sqlite = new Database(appEnv.DB_URL);

if (appEnv.USE_WAL) {
  sqlite.run('PRAGMA journal_mode = WAL;')
}

export const db = drizzle({ client: sqlite});
