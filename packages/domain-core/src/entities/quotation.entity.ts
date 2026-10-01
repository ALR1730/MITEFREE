import { Money } from '../value-objects/money.vo.js';
import { FabricType, FABRIC_MULTIPLIERS } from '../enums/fabric-type.enum.js';
import { StainSeverity, STAIN_SURCHARGES } from '../enums/stain-severity.enum.js';
import { Result, ok, fail } from '../common/result.js';

export interface QuotationItemProps {
  id: string;
  furnitureType: string;
  fabricType: FabricType;
  stainSeverity: StainSeverity;
  basePrice: Money;
  fabricMultiplier: number;
  stainSurcharge: Money;
  subtotal: Money;
  photoUrls: string[];
}

export class QuotationItem {
  readonly id: string;
  readonly furnitureType: string;
  readonly fabricType: FabricType;
  readonly stainSeverity: StainSeverity;
  readonly basePrice: Money;
  readonly fabricMultiplier: number;
  readonly stainSurcharge: Money;
  readonly subtotal: Money;
  readonly photoUrls: readonly string[];

  private constructor(props: QuotationItemProps) {
    this.id = props.id;
    this.furnitureType = props.furnitureType;
    this.fabricType = props.fabricType;
    this.stainSeverity = props.stainSeverity;
    this.basePrice = props.basePrice;
    this.fabricMultiplier = props.fabricMultiplier;
    this.stainSurcharge = props.stainSurcharge;
    this.subtotal = props.subtotal;
    this.photoUrls = Object.freeze([...props.photoUrls]);
    Object.freeze(this);
  }

  static create(params: {
    id: string;
    furnitureType: string;
    fabricType: FabricType;
    stainSeverity: StainSeverity;
    basePriceAmount: number;
    photoUrls?: string[];
  }): Result<QuotationItem, string> {
    const baseMoneyResult = Money.create(params.basePriceAmount);
    if (baseMoneyResult.isFailure) {
      return fail(baseMoneyResult.error);
    }
    const basePrice = baseMoneyResult.value;
    const fabricMultiplier = FABRIC_MULTIPLIERS[params.fabricType];

    const stainAmount = STAIN_SURCHARGES[params.stainSeverity];
    const stainMoneyResult = Money.create(stainAmount);
    if (stainMoneyResult.isFailure) {
      return fail(stainMoneyResult.error);
    }
    const stainSurcharge = stainMoneyResult.value;

    // Fórmula canónica: (basePrice * fabricMultiplier) + stainSurcharge
    const multipliedResult = basePrice.multiply(fabricMultiplier);
    if (multipliedResult.isFailure) {
      return fail(multipliedResult.error);
    }
    const subtotalResult = multipliedResult.value.add(stainSurcharge);
    if (subtotalResult.isFailure) {
      return fail(subtotalResult.error);
    }

    return ok(
      new QuotationItem({
        id: params.id,
        furnitureType: params.furnitureType,
        fabricType: params.fabricType,
        stainSeverity: params.stainSeverity,
        basePrice,
        fabricMultiplier,
        stainSurcharge,
        subtotal: subtotalResult.value,
        photoUrls: params.photoUrls ?? [],
      }),
    );
  }

  static reconstitute(props: QuotationItemProps): QuotationItem {
    return new QuotationItem(props);
  }
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Confirmed' | 'Expired';

export class Quotation {
  readonly id: string;
  readonly clientId: string;
  readonly items: readonly QuotationItem[];
  readonly discountAmount: Money;
  readonly subtotal: Money;
  readonly total: Money;
  readonly depositRequired: Money;
  readonly status: QuotationStatus;
  readonly createdAt: Date;
  readonly expiresAt: Date;

  private constructor(params: {
    id: string;
    clientId: string;
    items: readonly QuotationItem[];
    discountAmount: Money;
    subtotal: Money;
    total: Money;
    depositRequired: Money;
    status: QuotationStatus;
    createdAt: Date;
    expiresAt: Date;
  }) {
    this.id = params.id;
    this.clientId = params.clientId;
    this.items = Object.freeze([...params.items]);
    this.discountAmount = params.discountAmount;
    this.subtotal = params.subtotal;
    this.total = params.total;
    this.depositRequired = params.depositRequired;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.expiresAt = params.expiresAt;
    Object.freeze(this);
  }

  static create(params: {
    id: string;
    clientId: string;
    items: QuotationItem[];
    discountAmount?: Money;
    depositRate?: number; // Default 30% (0.30)
    now?: Date;
  }): Result<Quotation, string> {
    if (params.items.length === 0) {
      return fail('A quotation must contain at least one item');
    }

    const discount = params.discountAmount ?? Money.zero();
    const depositRate = params.depositRate ?? 0.3; // Constante: 30% anticipo

    let subtotalAcc = Money.zero();
    for (const item of params.items) {
      const addRes = subtotalAcc.add(item.subtotal);
      if (addRes.isFailure) return fail(addRes.error);
      subtotalAcc = addRes.value;
    }

    const totalRes =
      subtotalAcc.amount >= discount.amount ? subtotalAcc.subtract(discount) : ok(Money.zero());

    if (totalRes.isFailure) return fail(totalRes.error);
    const total = totalRes.value;

    const depositRes = total.percentage(depositRate);
    if (depositRes.isFailure) return fail(depositRes.error);

    const createdAt = params.now ?? new Date();
    // Expiración inmutable: exactamente 7 días después
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    return ok(
      new Quotation({
        id: params.id,
        clientId: params.clientId,
        items: params.items,
        discountAmount: discount,
        subtotal: subtotalAcc,
        total,
        depositRequired: depositRes.value,
        status: 'Sent',
        createdAt,
        expiresAt,
      }),
    );
  }

  static reconstitute(params: {
    id: string;
    clientId: string;
    items: readonly QuotationItem[];
    discountAmount: Money;
    subtotal: Money;
    total: Money;
    depositRequired: Money;
    status: QuotationStatus;
    createdAt: Date;
    expiresAt: Date;
  }): Quotation {
    return new Quotation(params);
  }

  isExpired(now: Date = new Date()): boolean {
    return now.getTime() > this.expiresAt.getTime();
  }
}
