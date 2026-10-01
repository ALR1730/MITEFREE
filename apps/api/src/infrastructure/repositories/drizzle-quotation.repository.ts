import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  type IQuotationRepository,
  Quotation,
  QuotationItem,
  Money,
  FabricType,
  StainSeverity,
  QuotationStatus,
} from '@mitefree/domain-core';
import { type DatabaseClient, quotations, quotationItems } from '@mitefree/database';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../database/database.tokens.js';

@Injectable()
export class DrizzleQuotationRepository implements IQuotationRepository {
  private readonly logger = new Logger(DrizzleQuotationRepository.name);
  // Fallback memory cache for standalone testing / dev without live DB
  private readonly memoryStore = new Map<string, Quotation>();

  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DatabaseClient | null,
  ) {}

  async findById(id: string): Promise<Quotation | null> {
    if (!this.db) {
      return this.memoryStore.get(id) ?? null;
    }

    try {
      const quoteRows = await this.db
        .select()
        .from(quotations)
        .where(eq(quotations.id, id))
        .limit(1);

      const quoteRow = quoteRows[0];
      if (!quoteRow) return null;

      const itemRows = await this.db
        .select()
        .from(quotationItems)
        .where(eq(quotationItems.quotationId, id));

      const items = itemRows.map((ir) =>
        QuotationItem.reconstitute({
          id: ir.id,
          furnitureType: ir.furnitureType,
          fabricType: ir.fabricType as FabricType,
          stainSeverity: ir.stainSeverity as StainSeverity,
          basePrice: Money.create(Number(ir.basePrice)).unwrap(),
          fabricMultiplier: Number(ir.fabricMultiplier),
          stainSurcharge: Money.create(Number(ir.stainSurcharge)).unwrap(),
          subtotal: Money.create(Number(ir.subtotal)).unwrap(),
          photoUrls: [],
        }),
      );

      return Quotation.reconstitute({
        id: quoteRow.id,
        clientId: quoteRow.clientId,
        items,
        discountAmount: Money.create(Number(quoteRow.discountAmount)).unwrap(),
        subtotal: Money.create(Number(quoteRow.subtotal)).unwrap(),
        total: Money.create(Number(quoteRow.total)).unwrap(),
        depositRequired: Money.create(Number(quoteRow.depositRequired)).unwrap(),
        status: quoteRow.status as QuotationStatus,
        createdAt: quoteRow.createdAt,
        expiresAt: quoteRow.expiresAt,
      });
    } catch (error) {
      this.logger.error(`Error finding quotation by id ${id}, falling back to memory store`, error);
      return this.memoryStore.get(id) ?? null;
    }
  }

  async findByClientId(clientId: string): Promise<Quotation[]> {
    if (!this.db) {
      return Array.from(this.memoryStore.values()).filter((q) => q.clientId === clientId);
    }

    try {
      const quoteRows = await this.db
        .select()
        .from(quotations)
        .where(eq(quotations.clientId, clientId));

      const results: Quotation[] = [];
      for (const row of quoteRows) {
        const fullQuote = await this.findById(row.id);
        if (fullQuote) results.push(fullQuote);
      }
      return results;
    } catch (error) {
      this.logger.error(
        `Error finding quotations for client ${clientId}, falling back to memory store`,
        error,
      );
      return Array.from(this.memoryStore.values()).filter((q) => q.clientId === clientId);
    }
  }

  async save(quotation: Quotation): Promise<void> {
    this.memoryStore.set(quotation.id, quotation);

    if (!this.db) {
      return;
    }

    try {
      await this.db.insert(quotations).values({
        id: quotation.id,
        clientId: quotation.clientId,
        status: quotation.status,
        subtotal: quotation.subtotal.amount.toString(),
        discountAmount: quotation.discountAmount.amount.toString(),
        total: quotation.total.amount.toString(),
        depositRequired: quotation.depositRequired.amount.toString(),
        currency: quotation.total.currency,
        createdAt: quotation.createdAt,
        expiresAt: quotation.expiresAt,
      });

      for (const item of quotation.items) {
        await this.db.insert(quotationItems).values({
          id: item.id,
          quotationId: quotation.id,
          furnitureType: item.furnitureType,
          fabricType: item.fabricType,
          stainSeverity: item.stainSeverity,
          basePrice: item.basePrice.amount.toString(),
          fabricMultiplier: item.fabricMultiplier.toString(),
          stainSurcharge: item.stainSurcharge.amount.toString(),
          subtotal: item.subtotal.amount.toString(),
        });
      }
    } catch (error) {
      this.logger.error(`Error saving quotation ${quotation.id} to Drizzle DB`, error);
    }
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const existing = this.memoryStore.get(id);
    if (existing) {
      this.memoryStore.set(
        id,
        Quotation.reconstitute({
          ...existing,
          status: status as QuotationStatus,
        }),
      );
    }

    if (!this.db) return;

    try {
      await this.db.update(quotations).set({ status }).where(eq(quotations.id, id));
    } catch (error) {
      this.logger.error(`Error updating status for quotation ${id}`, error);
    }
  }
}
