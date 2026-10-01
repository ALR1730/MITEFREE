import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { users } from './identity.js';

export const quotations = pgTable('quotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('Sent'), // Draft, Sent, Confirmed, Expired
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  depositRequired: numeric('deposit_required', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  quotationId: uuid('quotation_id')
    .notNull()
    .references(() => quotations.id, { onDelete: 'cascade' }),
  furnitureType: text('furniture_type').notNull(),
  fabricType: text('fabric_type').notNull(),
  stainSeverity: text('stain_severity').notNull(),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  fabricMultiplier: numeric('fabric_multiplier', { precision: 4, scale: 2 }).notNull(),
  stainSurcharge: numeric('stain_surcharge', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
});

export const quotationPhotos = pgTable('quotation_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  quotationItemId: uuid('quotation_item_id')
    .notNull()
    .references(() => quotationItems.id, { onDelete: 'cascade' }),
  storageKey: text('storage_key').notNull(),
  publicUrl: text('public_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
