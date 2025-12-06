import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable, index } from 'drizzle-orm/sqlite-core'

export const coins = sqliteTable(
  'coins',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    ticker: text('ticker').notNull(),
    tagline: text('tagline'),
    description: text('description'),
    supply: text('supply'),
    marketing: text('marketing'),
    lpBurnPercentage: text('lp_burned_percentage'),
    devPercentage: text('dev_percentage'),
    marketingFeePercentage: text('marketing_fee_percentage'),
    communityFeePercentage: text('community_fee_percentage'),
    mode: text('mode').notNull(),
    combos: text('combos'), // JSON stringified array
    prompt: text('prompt'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  // prettier-ignore
  (table) => [
    index('idx_coins_name').on(table.name)
  ],
)

export type Memecoin = typeof coins.$inferSelect
export type InsertMemecoin = typeof coins.$inferInsert
