import { describe, it, expect } from 'vitest';
import {
  QuotationPricingEngine,
  type CalculateItemPriceInput,
} from '../src/engines/quotation-pricing.engine.js';
import { Money } from '../src/value-objects/money.vo.js';
import { FabricType } from '../src/enums/fabric-type.enum.js';
import { StainSeverity } from '../src/enums/stain-severity.enum.js';

describe('QuotationPricingEngine — TDD Suite (≥98% Cobertura)', () => {
  // 1. Telas y Factores Canónicos
  it('01: GivenSyntheticFabric_WhenCalculated_ThenMultiplierIs1_00', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.0);
    expect(res.value.lineTotal.amount).toBe(100.0);
  });

  it('02: GivenMicrofiberFabric_WhenCalculated_ThenCanonicalMultiplierIs1_15', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Microfiber,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.15);
    expect(res.value.lineTotal.amount).toBe(115.0);
  });

  it('03: GivenLinenFabric_WhenCalculated_ThenCanonicalMultiplierIs1_20', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Linen,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.2);
    expect(res.value.lineTotal.amount).toBe(120.0);
  });

  it('04: GivenVelvetFabric_WhenCalculated_ThenCanonicalMultiplierIs1_40', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Velvet,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.4);
    expect(res.value.lineTotal.amount).toBe(140.0);
  });

  it('05: GivenLeatherFabric_WhenCalculated_ThenCanonicalMultiplierIs1_50', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Leather,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.5);
    expect(res.value.lineTotal.amount).toBe(150.0);
  });

  it('06: GivenSilkFabric_WhenCalculated_ThenCanonicalMultiplierIs1_80', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Silk,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(1.8);
    expect(res.value.lineTotal.amount).toBe(180.0);
  });

  // 2. Severidad de Manchas
  it('07: GivenModerateStainSeverity_WhenCalculated_ThenApplies15DollarSurcharge', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Moderate,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.stainSurcharge.amount).toBe(15.0);
    expect(res.value.lineTotal.amount).toBe(115.0);
  });

  it('08: GivenCriticalStainSeverity_WhenCalculated_ThenApplies35DollarSurcharge', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Critical,
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.stainSurcharge.amount).toBe(35.0);
    expect(res.value.lineTotal.amount).toBe(135.0);
  });

  // 3. Combinación Completa y Servicios Adicionales
  it('09: GivenVelvetFabricAndCriticalStainAndAdditionalServices_WhenCalculated_ThenComputesExactSum', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(), // base 100
      fabricType: FabricType.Velvet, // * 1.4 = 140
      stainSeverity: StainSeverity.Critical, // + 35 = 175
      additionalServices: [
        { name: 'Desinfección UV', price: Money.create(20).unwrap() },
        { name: 'Impermeabilizado', price: Money.create(30).unwrap() },
      ], // + 50 = 225
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.priceAfterFabric.amount).toBe(140.0);
    expect(res.value.stainSurcharge.amount).toBe(35.0);
    expect(res.value.additionalServicesTotal.amount).toBe(50.0);
    expect(res.value.lineTotal.amount).toBe(225.0);
  });

  // 4. Parámetros Personalizados (Matriz de Configuración Admin)
  it('10: GivenCustomFabricMultiplierAndCustomStainSurcharge_WhenCalculated_ThenUsesCustomValues', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
      customFabricMultiplier: 2.2,
      customStainSurcharge: Money.create(50).unwrap(),
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isSuccess).toBe(true);
    expect(res.value.fabricMultiplier).toBe(2.2);
    expect(res.value.stainSurcharge.amount).toBe(50.0);
    expect(res.value.lineTotal.amount).toBe(270.0);
  });

  it('11: GivenInvalidMultiplierLessThanOne_WhenCalculated_ThenReturnsFailure', () => {
    const input: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
      customFabricMultiplier: 0.8, // Menor que 1.0 no permitido
    };
    const res = QuotationPricingEngine.calculateItemPrice(input);
    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('greater than or equal to 1.0');
  });

  // 5. Cotización Global: Descuentos No Acumulables (Antifraude)
  it('12: GivenRouteDiscountGreaterThanCouponDiscount_WhenQuotationCalculated_ThenAppliesRouteDiscount', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light, // 100
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      routeDiscount: Money.create(20).unwrap(), // $20
      couponDiscount: Money.create(10).unwrap(), // $10
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.discountApplied.amount).toBe(20.0);
    expect(res.value.subtotal.amount).toBe(100.0);
    expect(res.value.total.amount).toBe(80.0);
  });

  it('13: GivenCouponDiscountGreaterThanRouteDiscount_WhenQuotationCalculated_ThenAppliesCouponDiscount', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light, // 100
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      routeDiscount: Money.create(10).unwrap(),
      couponDiscount: Money.create(25).unwrap(),
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.discountApplied.amount).toBe(25.0);
    expect(res.value.total.amount).toBe(75.0);
  });

  it('14: GivenDiscountExceedingSubtotal_WhenQuotationCalculated_ThenTotalDoesNotDropBelowZero', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(50).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light, // 50
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      couponDiscount: Money.create(80).unwrap(),
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.subtotalAfterDiscount.amount).toBe(0.0);
    expect(res.value.total.amount).toBe(0.0);
    expect(res.value.depositRequired.amount).toBe(0.0);
  });

  // 6. Integración de Billetera (Cashback)
  it('15: GivenWalletBalanceLowerThanSubtotal_WhenQuotationCalculated_ThenAppliesFullWalletBalance', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      walletBalanceAvailable: Money.create(15).unwrap(),
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.walletCreditApplied.amount).toBe(15.0);
    expect(res.value.total.amount).toBe(85.0);
  });

  it('16: GivenWalletBalanceHigherThanSubtotal_WhenQuotationCalculated_ThenCapsWalletCreditAtSubtotal', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      walletBalanceAvailable: Money.create(200).unwrap(),
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.walletCreditApplied.amount).toBe(100.0);
    expect(res.value.total.amount).toBe(0.0);
  });

  // 7. Anticipo Canónico (30%) y Saldo Restante (70%)
  it('17: GivenQuotationWithTotal_WhenCalculated_ThenDepositIs30PercentAndRemainingIs70Percent', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(200).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light, // 200
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.total.amount).toBe(200.0);
    expect(res.value.depositRequired.amount).toBe(60.0); // 30% de 200
    expect(res.value.remainingBalance.amount).toBe(140.0); // 70% de 200
  });

  it('18: GivenCustomDepositRate_WhenCalculated_ThenAppliesCustomPercentage', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(200).unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1],
      depositRate: 0.5, // 50%
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.depositRequired.amount).toBe(100.0);
    expect(res.value.remainingBalance.amount).toBe(100.0);
  });

  // 8. Validaciones de Invariantes y Monedas Múltiples
  it('19: GivenEmptyItemList_WhenQuotationCalculated_ThenReturnsFailure', () => {
    const res = QuotationPricingEngine.calculateQuotation({
      items: [],
    });
    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('at least one item');
  });

  it('20: GivenCurrencyMismatchAcrossItems_WhenCalculated_ThenReturnsFailure', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100, 'USD').unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const item2: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(5000, 'DOP').unwrap(),
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1, item2],
    });
    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('share the same currency');
  });

  it('21: GivenMultipleItemsWithDifferentFabricsAndSeverities_WhenCalculated_ThenSumsAccurately', () => {
    const item1: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(80).unwrap(), // Colchón Queen: 80 * 1.0 (Synth) + 0 = 80
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
    };
    const item2: CalculateItemPriceInput = {
      furnitureBasePrice: Money.create(100).unwrap(), // Sofá 3 puestos: 100 * 1.4 (Velvet) + 15 (Mod) = 155
      fabricType: FabricType.Velvet,
      stainSeverity: StainSeverity.Moderate,
    };
    const res = QuotationPricingEngine.calculateQuotation({
      items: [item1, item2],
      couponDiscount: Money.create(35).unwrap(), // Subtotal: 235 - 35 = 200
      walletBalanceAvailable: Money.create(50).unwrap(), // Total: 200 - 50 = 150
    });
    expect(res.isSuccess).toBe(true);
    expect(res.value.subtotal.amount).toBe(235.0);
    expect(res.value.discountApplied.amount).toBe(35.0);
    expect(res.value.walletCreditApplied.amount).toBe(50.0);
    expect(res.value.total.amount).toBe(150.0);
    expect(res.value.depositRequired.amount).toBe(45.0); // 30% de 150
    expect(res.value.remainingBalance.amount).toBe(105.0); // 70% de 150
  });
});
