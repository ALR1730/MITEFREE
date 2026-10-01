import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './identity.js';
import { quotations } from './quotations.js';

export const timeSlots = pgTable('time_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // MORNING, AFTERNOON, EVENING
  startTime: text('start_time').notNull(), // '08:30'
  endTime: text('end_time').notNull(), // '11:30'
  zoneCode: text('zone_code').notNull(),
});

export const appointments = pgTable(
  'appointments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    quotationId: uuid('quotation_id')
      .notNull()
      .references(() => quotations.id),
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id),
    technicianId: uuid('technician_id').references(() => users.id),
    timeSlotId: uuid('time_slot_id')
      .notNull()
      .references(() => timeSlots.id),
    scheduledDate: timestamp('scheduled_date', { withTimezone: true }).notNull(),
    status: text('status').notNull().default('PendingPayment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Previene colisión de técnico y bloque horario en la misma fecha
    uniqueIndex('uq_technician_timeslot_date').on(
      table.technicianId,
      table.timeSlotId,
      table.scheduledDate,
    ),
  ],
);
