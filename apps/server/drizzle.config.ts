import type { Config } from "drizzle-kit";

// Use local SQLite for migrations
// Production uses Turso (configured via DB_URL and DB_AUTH_TOKEN at runtime)
export default {
  schema: [
    "./src/coins/db.ts",
  ],
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL || "file:./memedime.db",
  },
} satisfies Config;
