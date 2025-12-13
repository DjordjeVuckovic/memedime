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
    combos: text('combos', { mode: 'json' }),
    prompt: text('prompt'),
    walletAddress: text('wallet_address').default('0x0000000000000000000000000000000000000000'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$onUpdateFn(() => new Date())
      .notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  // prettier-ignore
  (table) => [
    index('idx_mode').on(table.mode)
  ],
)

export type Coin = typeof coins.$inferSelect
export type NewCoin = typeof coins.$inferInsert
