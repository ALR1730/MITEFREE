import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IQuotationRepository,
  Quotation,
  QuotationItem,
  Money,
  FabricType,
  StainSeverity,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { CreateQuotationRequestDto, QuotationResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { QUOTATION_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class CreateQuotationUseCase implements IUseCase<
  CreateQuotationRequestDto,
  Result<QuotationResponseDto, string>
> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  async execute(dto: CreateQuotationRequestDto): Promise<Result<QuotationResponseDto, string>> {
    const items: QuotationItem[] = [];

    for (const itemDto of dto.items) {
      const itemResult = QuotationItem.create({
        id: randomUUID(),
        furnitureType: itemDto.furnitureType,
        fabricType: itemDto.fabricType as FabricType,
        stainSeverity: itemDto.stainSeverity as StainSeverity,
        basePriceAmount: itemDto.basePriceAmount,
        photoUrls: itemDto.photoUrls,
      });

      if (itemResult.isFailure) {
        return fail(`Failed to create quotation item: ${itemResult.error}`);
      }

      items.push(itemResult.value);
    }

    const discountAmount =
      dto.discountCode === 'ALRPROMO' ? Money.create(15).unwrap() : Money.zero();

    const quoteResult = Quotation.create({
      id: randomUUID(),
      clientId: dto.clientId,
      items,
      discountAmount,
    });

    if (quoteResult.isFailure) {
      return fail(quoteResult.error);
    }

    const quotation = quoteResult.value;
    await this.quotationRepo.save(quotation);

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
