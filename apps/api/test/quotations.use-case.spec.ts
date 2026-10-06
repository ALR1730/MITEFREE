import { describe, it, expect, beforeEach } from 'vitest';
import { CreateQuotationUseCase } from '../src/application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../src/application/quotations/get-quotation.use-case.js';
import { CalculatePricePreviewUseCase } from '../src/application/quotations/calculate-price-preview.use-case.js';
import { UploadPhotoIntentUseCase } from '../src/application/quotations/upload-photo-intent.use-case.js';
import { ConfirmPhotoUseCase } from '../src/application/quotations/confirm-photo.use-case.js';
import { QuotationPdfService } from '../src/infrastructure/pdf/quotation-pdf.service.js';
import { CloudflareR2StorageAdapter } from '../src/infrastructure/storage/r2-storage.adapter.js';
import { DrizzleQuotationRepository } from '../src/infrastructure/repositories/drizzle-quotation.repository.js';
import type {
  CreateQuotationRequestDto,
  PricePreviewRequestDto,
  PhotoUploadIntentDto,
  PhotoConfirmDto,
} from '@mitefree/shared-types';

describe('Quotations Use Cases (Unit Tests & Phase 2 Services)', () => {
  let repository: DrizzleQuotationRepository;
  let createUseCase: CreateQuotationUseCase;
  let getUseCase: GetQuotationUseCase;
  let calculatePreviewUseCase: CalculatePricePreviewUseCase;
  let storageAdapter: CloudflareR2StorageAdapter;
  let uploadIntentUseCase: UploadPhotoIntentUseCase;
  let confirmPhotoUseCase: ConfirmPhotoUseCase;
  let pdfService: QuotationPdfService;

  beforeEach(() => {
    // null DB injects in-memory storage fallback
    repository = new DrizzleQuotationRepository(null);
    createUseCase = new CreateQuotationUseCase(repository);
    getUseCase = new GetQuotationUseCase(repository);
    calculatePreviewUseCase = new CalculatePricePreviewUseCase();
    storageAdapter = new CloudflareR2StorageAdapter();
    uploadIntentUseCase = new UploadPhotoIntentUseCase(storageAdapter);
    confirmPhotoUseCase = new ConfirmPhotoUseCase(storageAdapter);
    pdfService = new QuotationPdfService();
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

  // Phase 2: Price Preview Use Case
  it('GivenPricePreviewRequest_WhenExecutingUseCase_ThenReturnsDetailedBreakdown', async () => {
    const previewDto: PricePreviewRequestDto = {
      items: [
        {
          furnitureType: 'Sofá Modular en L',
          fabricType: 'VELVET',
          stainSeverity: 'MODERATE',
          basePriceAmount: 160, // 160 * 1.4 = 224 + 15 = 239
        },
      ],
      couponCode: 'ALRPROMO',
      walletBalanceAvailable: 20,
    };

    const result = await calculatePreviewUseCase.execute(previewDto);
    expect(result.isSuccess).toBe(true);
    const val = result.value;
    expect(val.subtotal).toBe(239.0);
    expect(val.discountApplied).toBe(15.0);
    expect(val.walletCreditApplied).toBe(20.0);
    expect(val.total).toBe(204.0);
    expect(val.depositRequired).toBe(61.2);
    expect(val.remainingBalance).toBe(142.8);
  });

  // Phase 2: Cloudflare R2 Upload Intent & Confirm
  it('GivenValidPhotoUploadIntent_WhenRequestingUpload_ThenReturnsPresignedUrlWith15MinTTL', async () => {
    const uploadDto: PhotoUploadIntentDto = {
      quotationId: '33333333-3333-3333-3333-333333333333',
      filename: 'mancha_sofa.webp',
      mimeType: 'image/webp',
      sizeBytes: 1024 * 500, // 500 KB
    };

    const result = await uploadIntentUseCase.execute(uploadDto);
    expect(result.isSuccess).toBe(true);
    expect(result.value.uploadUrl).toContain('r2.cloudflarestorage.com');
    expect(result.value.expiresInSeconds).toBe(900);
    expect(result.value.storageKey).toContain('evidence/33333333-3333-3333-3333-333333333333');
  });

  it('GivenOversizedPhotoUploadIntent_WhenRequestingUpload_ThenFailsValidation', async () => {
    const uploadDto: PhotoUploadIntentDto = {
      quotationId: '33333333-3333-3333-3333-333333333333',
      filename: 'video_gigante.mp4',
      mimeType: 'image/webp',
      sizeBytes: 10 * 1024 * 1024, // 10 MB > 5MB limit
    };

    const result = await uploadIntentUseCase.execute(uploadDto);
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('limit');
  });

  it('GivenUploadedPhoto_WhenConfirmed_ThenReturnsSuccessConfirmation', async () => {
    const confirmDto: PhotoConfirmDto = {
      quotationItemId: '44444444-4444-4444-4444-444444444444',
      storageKey: 'evidence/quote/item-uuid.webp',
      publicUrl: 'https://evidence.mitefree.com/evidence/quote/item-uuid.webp',
    };

    const result = await confirmPhotoUseCase.execute(confirmDto);
    expect(result.isSuccess).toBe(true);
    expect(result.value.quotationItemId).toBe(confirmDto.quotationItemId);
    expect(result.value.photoId).toBeDefined();
  });

  // Phase 2: PDF Generator Service
  it('GivenQuotationDto_WhenGeneratingPdf_ThenReturnsValidPdfBuffer', async () => {
    const quote = {
      id: '55555555-5555-5555-5555-555555555555',
      clientId: '66666666-6666-6666-6666-666666666666',
      subtotal: 100,
      discountAmount: 15,
      total: 85,
      depositRequired: 25.5,
      currency: 'USD',
      status: 'Sent',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    const pdfBuffer = await pdfService.generateQuotationPdf(quote);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.toString('utf8')).toContain('%PDF-1.4');
    expect(pdfBuffer.toString('utf8')).toContain('MITEFREE');
  });
});
