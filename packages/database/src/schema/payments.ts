import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { appointments } from './appointments.js';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id')
    .notNull()
    .references(() => appointments.id),
  type: text('type').notNull(), // DEPOSIT, SETTLEMENT, FULL
  method: text('method').notNull(), // STRIPE, BANK_TRANSFER, CASH, WALLET
  status: text('status').notNull().default('PENDING'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  externalReference: text('external_reference'), // Stripe charge_id / transfer slip
  idempotencyKey: text('idempotency_key').unique(), // Previene doble cobro
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
