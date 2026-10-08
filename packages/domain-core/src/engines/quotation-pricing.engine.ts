import { Money } from '../value-objects/money.vo.js';
import { FabricType, FABRIC_MULTIPLIERS } from '../enums/fabric-type.enum.js';
import { StainSeverity, STAIN_SURCHARGES } from '../enums/stain-severity.enum.js';
import { Result, ok, fail } from '../common/result.js';

export interface AdditionalServiceInput {
  name: string;
  price: Money;
}

export interface CalculateItemPriceInput {
  furnitureBasePrice: Money;
  fabricType: FabricType;
  stainSeverity: StainSeverity;
  additionalServices?: AdditionalServiceInput[];
  customFabricMultiplier?: number;
  customStainSurcharge?: Money;
}

export interface ItemPriceBreakdown {
  furnitureBasePrice: Money;
  fabricType: FabricType;
  fabricMultiplier: number;
  priceAfterFabric: Money;
  stainSeverity: StainSeverity;
  stainSurcharge: Money;
  additionalServicesTotal: Money;
  additionalServices: readonly AdditionalServiceInput[];
  lineTotal: Money;
}

export interface QuotationCalculationInput {
  items: CalculateItemPriceInput[];
  routeDiscount?: Money;
  couponDiscount?: Money;
  walletBalanceAvailable?: Money;
  depositRate?: number; // Canónico: 0.30 (30%)
}

export interface QuotationPriceBreakdown {
  itemsBreakdown: readonly ItemPriceBreakdown[];
  subtotal: Money;
  routeDiscount: Money;
  couponDiscount: Money;
  discountApplied: Money;
  subtotalAfterDiscount: Money;
  walletCreditApplied: Money;
  total: Money;
  depositRequired: Money;
  remainingBalance: Money;
  depositRate: number;
}

/**
 * QuotationPricingEngine — Motor Algorítmico Puro de Cotización (DDD)
 *
 * Reglas de Negocio Inmutables:
 * 1. line_total = (basePrice * fabricMultiplier) + stainSurcharge + additionalServices
 * 2. subtotal = Σ(line_total)
 * 3. discount_applied = max(routeDiscount, couponDiscount) [NO acumulables - Política antifraude]
 * 4. wallet_credit_applied = min(walletBalanceAvailable, subtotalAfterDiscount)
 * 5. total = subtotal - discount_applied - wallet_credit_applied
 * 6. deposit_required = total * depositRate (30%)
 * 7. remaining_balance = total - deposit_required (70%)
 */
export class QuotationPricingEngine {
  public static readonly CANONICAL_DEPOSIT_RATE = 0.3; // 30%

  /**
   * Factores canónicos oficiales según el Master Plan
   */
  public static readonly CANONICAL_FABRIC_MULTIPLIERS: Record<FabricType, number> = {
    [FabricType.Synthetic]: 1.0,
    [FabricType.Microfiber]: 1.15,
    [FabricType.Linen]: 1.2,
    [FabricType.Velvet]: 1.4,
    [FabricType.Leather]: 1.5,
    [FabricType.Silk]: 1.8,
  };

  /**
   * Recargos canónicos por severidad de manchas
   */
  public static readonly CANONICAL_STAIN_SURCHARGES: Record<StainSeverity, number> = {
    [StainSeverity.Light]: 0.0,
    [StainSeverity.Moderate]: 15.0,
    [StainSeverity.Critical]: 35.0,
  };

  /**
   * Calcula el precio detallado de un ítem individual
   */
  public static calculateItemPrice(
    input: CalculateItemPriceInput,
  ): Result<ItemPriceBreakdown, string> {
    const multiplier =
      input.customFabricMultiplier ??
      this.CANONICAL_FABRIC_MULTIPLIERS[input.fabricType] ??
      FABRIC_MULTIPLIERS[input.fabricType];

    if (multiplier < 1.0) {
      return fail('Fabric multiplier must be greater than or equal to 1.0');
    }

    const priceAfterFabricResult = input.furnitureBasePrice.multiply(multiplier);
    if (priceAfterFabricResult.isFailure) {
      return fail(`Error calculating fabric multiplier: ${priceAfterFabricResult.error}`);
    }
    const priceAfterFabric = priceAfterFabricResult.value;

    let stainSurcharge: Money;
    if (input.customStainSurcharge) {
      stainSurcharge = input.customStainSurcharge;
    } else {
      const defaultAmount =
        this.CANONICAL_STAIN_SURCHARGES[input.stainSeverity] ??
        STAIN_SURCHARGES[input.stainSeverity];
      const stainResult = Money.create(defaultAmount, input.furnitureBasePrice.currency);
      if (stainResult.isFailure) {
        return fail(`Error creating stain surcharge: ${stainResult.error}`);
      }
      stainSurcharge = stainResult.value;
    }

    let additionalServicesTotal = Money.zero(input.furnitureBasePrice.currency);
    const safeAddServices = input.additionalServices ?? [];

    for (const service of safeAddServices) {
      const addRes = additionalServicesTotal.add(service.price);
      if (addRes.isFailure) {
        return fail(`Error adding additional service '${service.name}': ${addRes.error}`);
      }
      additionalServicesTotal = addRes.value;
    }

    // lineTotal = priceAfterFabric + stainSurcharge + additionalServicesTotal
    const step1 = priceAfterFabric.add(stainSurcharge);
    if (step1.isFailure) return fail(step1.error);

    const step2 = step1.value.add(additionalServicesTotal);
    if (step2.isFailure) return fail(step2.error);

    return ok({
      furnitureBasePrice: input.furnitureBasePrice,
      fabricType: input.fabricType,
      fabricMultiplier: multiplier,
      priceAfterFabric,
      stainSeverity: input.stainSeverity,
      stainSurcharge,
      additionalServicesTotal,
      additionalServices: Object.freeze([...safeAddServices]),
      lineTotal: step2.value,
    });
  }

  /**
   * Calcula la cotización completa con reglas de descuento no acumulables y canje de billetera
   */
  public static calculateQuotation(
    input: QuotationCalculationInput,
  ): Result<QuotationPriceBreakdown, string> {
    if (!input.items || input.items.length === 0) {
      return fail('Quotation must contain at least one item to calculate');
    }

    const currency = input.items[0]!.furnitureBasePrice.currency;
    const itemsBreakdown: ItemPriceBreakdown[] = [];
    let subtotalAcc = Money.zero(currency);

    for (const itemInput of input.items) {
      if (itemInput.furnitureBasePrice.currency !== currency) {
        return fail('All items in a quotation must share the same currency');
      }

      const itemResult = this.calculateItemPrice(itemInput);
      if (itemResult.isFailure) {
        return fail(itemResult.error);
      }

      itemsBreakdown.push(itemResult.value);
      const subtotalAdd = subtotalAcc.add(itemResult.value.lineTotal);
      if (subtotalAdd.isFailure) return fail(subtotalAdd.error);
      subtotalAcc = subtotalAdd.value;
    }

    const routeDisc = input.routeDiscount ?? Money.zero(currency);
    const couponDisc = input.couponDiscount ?? Money.zero(currency);

    if (routeDisc.currency !== currency || couponDisc.currency !== currency) {
      return fail('Discount currencies must match quotation currency');
    }

    // Regla de Oro: max(routeDiscount, couponDiscount) — No acumulables
    const discountApplied = routeDisc.isGreaterThan(couponDisc) ? routeDisc : couponDisc;

    // Subtotal después de descuento
    let subtotalAfterDiscount: Money;
    if (subtotalAcc.isLessThan(discountApplied)) {
      subtotalAfterDiscount = Money.zero(currency);
    } else {
      const subRes = subtotalAcc.subtract(discountApplied);
      if (subRes.isFailure) return fail(subRes.error);
      subtotalAfterDiscount = subRes.value;
    }

    // Crédito de Billetera: min(walletBalanceAvailable, subtotalAfterDiscount)
    const walletBalance = input.walletBalanceAvailable ?? Money.zero(currency);
    if (walletBalance.currency !== currency) {
      return fail('Wallet balance currency must match quotation currency');
    }

    let walletCreditApplied: Money;
    if (walletBalance.isGreaterThan(subtotalAfterDiscount)) {
      walletCreditApplied = subtotalAfterDiscount;
    } else {
      walletCreditApplied = walletBalance;
    }

    // Total = subtotalAfterDiscount - walletCreditApplied
    const totalRes = subtotalAfterDiscount.subtract(walletCreditApplied);
    if (totalRes.isFailure) return fail(totalRes.error);
    const total = totalRes.value;

    // Anticipo de reserva canónico (30%)
    const depositRate = input.depositRate ?? this.CANONICAL_DEPOSIT_RATE;
    if (depositRate < 0 || depositRate > 1) {
      return fail('Deposit rate must be between 0.0 and 1.0');
    }

    const depositRes = total.percentage(depositRate);
    if (depositRes.isFailure) return fail(depositRes.error);
    const depositRequired = depositRes.value;

    // Saldo restante (70%)
    const remainingRes = total.subtract(depositRequired);
    if (remainingRes.isFailure) return fail(remainingRes.error);
    const remainingBalance = remainingRes.value;

    return ok({
      itemsBreakdown: Object.freeze(itemsBreakdown),
      subtotal: subtotalAcc,
      routeDiscount: routeDisc,
      couponDiscount: couponDisc,
      discountApplied,
      subtotalAfterDiscount,
      walletCreditApplied,
      total,
      depositRequired,
      remainingBalance,
      depositRate,
    });
  }
}
