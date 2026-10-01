import { describe, it, expect, beforeEach } from 'vitest';
import { CreateQuotationUseCase } from '../src/application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../src/application/quotations/get-quotation.use-case.js';
import { DrizzleQuotationRepository } from '../src/infrastructure/repositories/drizzle-quotation.repository.js';
import type { CreateQuotationRequestDto } from '@mitefree/shared-types';

describe('Quotations Use Cases (Unit Tests)', () => {
  let repository: DrizzleQuotationRepository;
  let createUseCase: CreateQuotationUseCase;
  let getUseCase: GetQuotationUseCase;

  beforeEach(() => {
    // null DB injects in-memory storage fallback
    repository = new DrizzleQuotationRepository(null);
    createUseCase = new CreateQuotationUseCase(repository);
    getUseCase = new GetQuotationUseCase(repository);
  });

  it('GivenVelvetFabricAndCriticalStain_WhenCreatingQuotation_ThenCalculatesSubtotalAndDepositCorrectly', async () => {
    const input: CreateQuotationRequestDto = {
      clientId: '11111111-1111-1111-1111-111111111111',
      items: [
        {
          furnitureType: 'Sofá 3 Puestos',
          fabricType: 'VELVET', // Multiplier 1.40
          stainSeverity: 'CRITICAL', // Surcharge 35.00
          basePriceAmount: 100, // (100 * 1.4) + 35 = 175.00
          photoUrls: [],
        },
      ],
    };

    const result = await createUseCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const quotation = result.value;
    expect(quotation.subtotal).toBe(175.0);
    expect(quotation.discountAmount).toBe(0.0);
    expect(quotation.total).toBe(175.0);
    // 30% deposit rule of 175.00 = 52.50
    expect(quotation.depositRequired).toBe(52.5);
    expect(quotation.status).toBe('Sent');
  });

  it('GivenPromoCode_WhenCreatingQuotation_ThenAppliesDiscountCorrectly', async () => {
    const input: CreateQuotationRequestDto = {
      clientId: '11111111-1111-1111-1111-111111111111',
      discountCode: 'ALRPROMO', // $15 discount
      items: [
        {
          furnitureType: 'Sillón Individual',
          fabricType: 'SYNTHETIC', // Multiplier 1.0
          stainSeverity: 'LIGHT', // Surcharge 0.00
          basePriceAmount: 50,
          photoUrls: [],
        },
      ],
    };

    const result = await createUseCase.execute(input);

    expect(result.isSuccess).toBe(true);
    const quotation = result.value;
    expect(quotation.subtotal).toBe(50.0);
    expect(quotation.discountAmount).toBe(15.0);
    expect(quotation.total).toBe(35.0);
    // 30% of 35.00 = 10.50
    expect(quotation.depositRequired).toBe(10.5);
  });

  it('GivenSavedQuotation_WhenRetrievingById_ThenReturnsCorrectQuotation', async () => {
    const input: CreateQuotationRequestDto = {
      clientId: '22222222-2222-2222-2222-222222222222',
      items: [
        {
          furnitureType: 'Comedor 6 Sillas',
          fabricType: 'LINEN',
          stainSeverity: 'MODERATE',
          basePriceAmount: 120,
          photoUrls: [],
        },
      ],
    };

    const created = (await createUseCase.execute(input)).value;
    const retrieved = await getUseCase.execute(created.id);

    expect(retrieved.isSuccess).toBe(true);
    expect(retrieved.value.id).toBe(created.id);
    expect(retrieved.value.total).toBe(created.total);
  });

  it('GivenNonExistentId_WhenRetrievingQuotation_ThenReturnsFailure', async () => {
    const result = await getUseCase.execute('non-existent-uuid');
    expect(result.isFailure).toBe(true);
  });
});
