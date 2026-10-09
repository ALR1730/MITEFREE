import { Injectable, Inject } from '@nestjs/common';
import { type IQuotationRepository, Result, ok } from '@mitefree/domain-core';
import type { QuotationResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { QUOTATION_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ListClientQuotationsUseCase
  implements IUseCase<string, Result<QuotationResponseDto[], string>>
{
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  async execute(clientId: string): Promise<Result<QuotationResponseDto[], string>> {
    const quotations = await this.quotationRepo.findByClientId(clientId);

    const dtos: QuotationResponseDto[] = quotations.map((q) => ({
      id: q.id,
      clientId: q.clientId,
      subtotal: q.subtotal.amount,
      discountAmount: q.discountAmount.amount,
      total: q.total.amount,
      depositRequired: q.depositRequired.amount,
      currency: q.total.currency,
      status: q.status,
      expiresAt: q.expiresAt.toISOString(),
      createdAt: q.createdAt.toISOString(),
    }));

    return ok(dtos);
  }
}
