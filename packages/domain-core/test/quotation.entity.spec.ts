import { describe, it, expect } from 'vitest';
import { Quotation, QuotationItem } from '../src/entities/quotation.entity.js';
import { FabricType } from '../src/enums/fabric-type.enum.js';
import { StainSeverity } from '../src/enums/stain-severity.enum.js';

describe('Quotation Aggregate', () => {
  it('GivenVelvetFabricAndCriticalStain_WhenItemCreated_ThenAppliesMultiplierAndSurcharge', () => {
    // base: $100, velvet multiplier: 1.4 -> $140, critical stain surcharge: $35 -> $175
    const itemRes = QuotationItem.create({
      id: 'item-1',
      furnitureType: 'Sofa 3 Puestos',
      fabricType: FabricType.Velvet,
      stainSeverity: StainSeverity.Critical,
      basePriceAmount: 100,
    });

    expect(itemRes.isSuccess).toBe(true);
    if (itemRes.isSuccess) {
      expect(itemRes.value.subtotal.amount).toBe(175);
    }
  });

  it('GivenQuotationWithItems_WhenCreated_ThenCalculatesTotalAndDepositAnd7DayExpiry', () => {
    const item1 = QuotationItem.create({
      id: 'item-1',
      furnitureType: 'Sofa 3 Puestos',
      fabricType: FabricType.Synthetic, // 1.0 multiplier
      stainSeverity: StainSeverity.Light, // $0 surcharge
      basePriceAmount: 100,
    }).unwrap();

    const item2 = QuotationItem.create({
      id: 'item-2',
      furnitureType: 'Colchón King',
      fabricType: FabricType.Microfiber, // 1.1 multiplier
      stainSeverity: StainSeverity.Moderate, // $15 surcharge
      basePriceAmount: 100, // 100 * 1.1 + 15 = 125
    }).unwrap();

    const now = new Date('2026-10-01T12:00:00Z');
    const quoteRes = Quotation.create({
      id: 'quote-1',
      clientId: 'client-1',
      items: [item1, item2],
      now,
    });

    expect(quoteRes.isSuccess).toBe(true);
    if (quoteRes.isSuccess) {
      const q = quoteRes.value;
      expect(q.subtotal.amount).toBe(225); // 100 + 125 = 225
      expect(q.total.amount).toBe(225);
      expect(q.depositRequired.amount).toBe(67.5); // 30% of 225 = 67.5
      expect(q.expiresAt.toISOString()).toBe('2026-10-08T12:00:00.000Z');
      expect(q.isExpired(new Date('2026-10-05T12:00:00Z'))).toBe(false);
      expect(q.isExpired(new Date('2026-10-09T12:00:00Z'))).toBe(true);
    }
  });
});
