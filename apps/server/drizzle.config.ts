import type { Config } from "drizzle-kit";

export default {
  schema: [
    "./src/coins/db.ts",
  ],
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./memedime.db",
  },
} satisfies Config;
