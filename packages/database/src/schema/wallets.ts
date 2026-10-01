import { pgTable, uuid, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './identity.js';

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  balance: numeric('balance', { precision: 10, scale: 2 }).notNull().default('0.00'),
  version: integer('version').notNull().default(1), // Bloqueo optimista
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id')
    .notNull()
    .references(() => wallets.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // EARNED, REDEEMED, REFERRAL_BONUS, EXPIRED, ADJUSTMENT
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  balanceBefore: numeric('balance_before', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: numeric('balance_after', { precision: 10, scale: 2 }).notNull(),
  sourceReference: text('source_reference').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
