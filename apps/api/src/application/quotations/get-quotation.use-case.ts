import { Injectable, Inject } from '@nestjs/common';
import { type IQuotationRepository, Result, ok, fail } from '@mitefree/domain-core';
import type { QuotationResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { QUOTATION_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class GetQuotationUseCase implements IUseCase<string, Result<QuotationResponseDto, string>> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  async execute(id: string): Promise<Result<QuotationResponseDto, string>> {
    const quotation = await this.quotationRepo.findById(id);

    if (!quotation) {
      return fail(`Quotation with id '${id}' was not found.`);
    }

    return ok({
      id: quotation.id,
      clientId: quotation.clientId,
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
