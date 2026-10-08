import { Injectable, Inject, Optional } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  type IPaymentRepository,
  Payment,
  Money,
  PaymentType,
  PaymentMethod,
  PaymentStatus,
} from '@mitefree/domain-core';
import { payments as paymentsTable, type DatabaseClient, SEED_DATA } from '@mitefree/database';
import { DRIZZLE_DB } from '../database/database.tokens.js';

@Injectable()
export class DrizzlePaymentRepository implements IPaymentRepository {
  private readonly inMemoryStorage = new Map<string, Payment>();

  constructor(
    @Optional()
    @Inject(DRIZZLE_DB)
    private readonly db: DatabaseClient | null,
  ) {
    if (!this.db) {
      const now = new Date();
      for (const p of SEED_DATA.payments) {
        this.inMemoryStorage.set(
          p.id,
          new Payment({
            id: p.id,
            appointmentId: p.appointmentId,
            type: p.type as PaymentType,
            method: p.method as PaymentMethod,
            status: p.status as PaymentStatus,
            amount: Money.from(Number(p.amount), p.currency),
            idempotencyKey: p.idempotencyKey,
            externalReference: p.externalReference,
            createdAt: now,
            updatedAt: now,
          }),
        );
      }
    }
  }

  async findById(id: string): Promise<Payment | null> {
    if (!this.db) {
      return this.inMemoryStorage.get(id) ?? null;
    }

    try {
      const records = await this.db
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.id, id))
        .limit(1);

      const record = records[0];
      if (!record) return null;
      return this.mapToDomain(record);
    } catch {
      return this.inMemoryStorage.get(id) ?? null;
    }
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null> {
    if (!this.db) {
      for (const p of this.inMemoryStorage.values()) {
        if (p.idempotencyKey === idempotencyKey) return p;
      }
      return null;
    }

    try {
      const records = await this.db
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.idempotencyKey, idempotencyKey))
        .limit(1);

      const record = records[0];
      if (!record) return null;
      return this.mapToDomain(record);
    } catch {
      for (const p of this.inMemoryStorage.values()) {
        if (p.idempotencyKey === idempotencyKey) return p;
      }
      return null;
    }
  }

  async findByAppointmentId(appointmentId: string): Promise<Payment[]> {
    if (!this.db) {
      return Array.from(this.inMemoryStorage.values()).filter(
        (p) => p.appointmentId === appointmentId,
      );
    }

    try {
      const records = await this.db
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.appointmentId, appointmentId));

      return records.map((r) => this.mapToDomain(r));
    } catch {
      return Array.from(this.inMemoryStorage.values()).filter(
        (p) => p.appointmentId === appointmentId,
      );
    }
  }

  async findAll(): Promise<Payment[]> {
    if (!this.db) {
      return Array.from(this.inMemoryStorage.values());
    }

    try {
      const records = await this.db.select().from(paymentsTable);
      return records.map((r) => this.mapToDomain(r));
    } catch {
      return Array.from(this.inMemoryStorage.values());
    }
  }

  async save(payment: Payment): Promise<void> {
    this.inMemoryStorage.set(payment.id, payment);

    if (!this.db) return;

    try {
      await this.db.insert(paymentsTable).values({
        id: payment.id,
        appointmentId: payment.appointmentId,
        type: payment.type,
        method: payment.method,
        status: payment.status,
        amount: payment.amount.amount.toFixed(2),
        currency: payment.amount.currency,
        externalReference: payment.externalReference ?? null,
        idempotencyKey: payment.idempotencyKey,
        createdAt: payment.createdAt,
      });
    } catch {
      // Fallback a almacenamiento en memoria
    }
  }

  async update(payment: Payment): Promise<void> {
    this.inMemoryStorage.set(payment.id, payment);

    if (!this.db) return;

    try {
      await this.db
        .update(paymentsTable)
        .set({
          status: payment.status,
          externalReference: payment.externalReference ?? null,
        })
        .where(eq(paymentsTable.id, payment.id));
    } catch {
      // Fallback
    }
  }

  private mapToDomain(record: typeof paymentsTable.$inferSelect): Payment {
    const amount = Money.create(parseFloat(record.amount), record.currency || 'USD').unwrap();

    return new Payment({
      id: record.id,
      appointmentId: record.appointmentId,
      amount,
      type: record.type as PaymentType,
      method: record.method as PaymentMethod,
      status: record.status as PaymentStatus,
      idempotencyKey: record.idempotencyKey ?? record.id,
      externalReference: record.externalReference || undefined,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.createdAt),
    });
  }
}
