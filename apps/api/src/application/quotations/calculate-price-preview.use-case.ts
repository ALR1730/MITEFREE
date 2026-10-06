import { Injectable } from '@nestjs/common';
import {
  QuotationPricingEngine,
  Money,
  FabricType,
  StainSeverity,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type {
  PricePreviewRequestDto,
  PricePreviewResponseDto,
  ItemPriceBreakdownDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';

@Injectable()
export class CalculatePricePreviewUseCase
  implements IUseCase<PricePreviewRequestDto, Result<PricePreviewResponseDto, string>>
{
  async execute(dto: PricePreviewRequestDto): Promise<Result<PricePreviewResponseDto, string>> {
    const currency = dto.currency ?? 'USD';

    const itemsInput = dto.items.map((item) => {
      const baseMoney = Money.create(item.basePriceAmount, currency).unwrap();
      const additionalServices = (item.additionalServices ?? []).map((s) => ({
        name: s.name,
        price: Money.create(s.price, currency).unwrap(),
      }));

      return {
        furnitureBasePrice: baseMoney,
        fabricType: item.fabricType as FabricType,
        stainSeverity: item.stainSeverity as StainSeverity,
        additionalServices,
      };
    });

    const routeDisc =
      dto.routeDiscountAmount && dto.routeDiscountAmount > 0
        ? Money.create(dto.routeDiscountAmount, currency).unwrap()
        : Money.zero(currency);

    // Si envía código de cupón ALRPROMO y no mandó monto explícito, aplicamos $15 canónicos
    let couponDiscountAmount = dto.couponDiscountAmount ?? 0;
    if (dto.couponCode?.trim().toUpperCase() === 'ALRPROMO' && couponDiscountAmount === 0) {
      couponDiscountAmount = 15;
    }

    const couponDisc =
      couponDiscountAmount > 0
        ? Money.create(couponDiscountAmount, currency).unwrap()
        : Money.zero(currency);

    const walletBalance =
      dto.walletBalanceAvailable && dto.walletBalanceAvailable > 0
        ? Money.create(dto.walletBalanceAvailable, currency).unwrap()
        : Money.zero(currency);

    const calcResult = QuotationPricingEngine.calculateQuotation({
      items: itemsInput,
      routeDiscount: routeDisc,
      couponDiscount: couponDisc,
      walletBalanceAvailable: walletBalance,
    });

    if (calcResult.isFailure) {
      return fail(calcResult.error);
    }

    const breakdown = calcResult.value;

    const itemsBreakdownDto: ItemPriceBreakdownDto[] = breakdown.itemsBreakdown.map((b) => ({
      furnitureType: b.fabricType, // o nombre original mapeado
      fabricType: b.fabricType,
      fabricMultiplier: b.fabricMultiplier,
      priceAfterFabric: b.priceAfterFabric.amount,
      stainSeverity: b.stainSeverity,
      stainSurcharge: b.stainSurcharge.amount,
      additionalServicesTotal: b.additionalServicesTotal.amount,
      lineTotal: b.lineTotal.amount,
    }));

    return ok({
      itemsBreakdown: itemsBreakdownDto,
      subtotal: breakdown.subtotal.amount,
      routeDiscount: breakdown.routeDiscount.amount,
      couponDiscount: breakdown.couponDiscount.amount,
      discountApplied: breakdown.discountApplied.amount,
      subtotalAfterDiscount: breakdown.subtotalAfterDiscount.amount,
      walletCreditApplied: breakdown.walletCreditApplied.amount,
      total: breakdown.total.amount,
      depositRequired: breakdown.depositRequired.amount,
      remainingBalance: breakdown.remainingBalance.amount,
      currency,
      depositRate: breakdown.depositRate,
    });
  }
}
