import { pgTable, uuid, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // SOFA, MATTRESS, CHAIR, RUG
  name: text('name').notNull(),
  description: text('description'),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const fabricTypesTable = pgTable('fabric_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  multiplier: numeric('multiplier', { precision: 4, scale: 2 }).notNull(), // 1.0, 1.4, etc.
  requiresSpecialCare: boolean('requires_special_care').notNull().default(false),
});

export const stainSeveritiesTable = pgTable('stain_severities', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  surchargeAmount: numeric('surcharge_amount', { precision: 10, scale: 2 }).notNull(), // 0.0, 15.0, 35.0
});
