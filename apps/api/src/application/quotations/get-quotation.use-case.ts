import { Injectable, Inject, Optional } from '@nestjs/common';
import { type IQuotationRepository, Result, ok, fail } from '@mitefree/domain-core';
import type { QuotationResponseDto, QuotationItemResponseDto } from '@mitefree/shared-types';
import { type DatabaseClient, users } from '@mitefree/database';
import { eq } from 'drizzle-orm';
import { IUseCase } from '../common/use-case.interface.js';
import { QUOTATION_REPOSITORY, DRIZZLE_DB } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class GetQuotationUseCase implements IUseCase<string, Result<QuotationResponseDto, string>> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
    @Optional()
    @Inject(DRIZZLE_DB)
    private readonly db: DatabaseClient | null = null,
  ) {}

  async execute(id: string): Promise<Result<QuotationResponseDto, string>> {
    const quotation = await this.quotationRepo.findById(id);

    if (!quotation) {
      return fail(`Quotation with id '${id}' was not found.`);
    }

    const items: QuotationItemResponseDto[] = (quotation.items || []).map((item) => ({
      id: item.id,
      furnitureType: item.furnitureType,
      fabricType: item.fabricType,
      stainSeverity: item.stainSeverity,
      basePrice: item.basePrice.amount,
      fabricMultiplier: item.fabricMultiplier,
      stainSurcharge: item.stainSurcharge.amount,
      subtotal: item.subtotal.amount,
    }));

    let clientName = 'Consumidor Final (Sin Registrar)';
    let clientPhone = 'Vía Web';

    if (this.db && quotation.clientId) {
      try {
        const userRows = await this.db
          .select({ fullName: users.fullName, phone: users.phone })
          .from(users)
          .where(eq(users.id, quotation.clientId))
          .limit(1);

        const foundUser = userRows[0];
        if (foundUser && foundUser.fullName) {
          clientName = foundUser.fullName;
          clientPhone = foundUser.phone || 'Vía Web';
        }
      } catch {
        // Fallback silencioso a Consumidor Final (Sin Registrar)
      }
    }

    return ok({
      id: quotation.id,
      clientId: quotation.clientId,
      clientName,
      clientPhone,
      items,
      subtotal: quotation.subtotal.amount,
      discountAmount: quotation.discountAmount.amount,
      total: quotation.total.amount,
      depositRequired: quotation.depositRequired.amount,
      currency: quotation.total.currency,
      status: quotation.status,
      expiresAt: quotation.expiresAt.toISOString(),
      createdAt: quotation.createdAt.toISOString(),
    });
  }
}

