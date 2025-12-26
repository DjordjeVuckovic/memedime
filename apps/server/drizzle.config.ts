import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load .env file for drizzle-kit (bun dev loads it automatically, but drizzle-kit doesn't)
config();

// Use local SQLite for migrations
// Production uses Turso (configured via DB_URL and DB_AUTH_TOKEN at runtime)
export default {
  schema: [
    "./src/coins/db.ts",
  ],
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DB_URL || "file:./memedime.db",
    authToken: process.env.DB_AUTH_TOKEN || "",
  },
} satisfies Config;
