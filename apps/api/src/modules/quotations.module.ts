import { Module } from '@nestjs/common';
import { QuotationsController } from '../presentation/controllers/quotations.controller.js';
import { CreateQuotationUseCase } from '../application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../application/quotations/get-quotation.use-case.js';
import { CalculatePricePreviewUseCase } from '../application/quotations/calculate-price-preview.use-case.js';
import { UploadPhotoIntentUseCase } from '../application/quotations/upload-photo-intent.use-case.js';
import { ConfirmPhotoUseCase } from '../application/quotations/confirm-photo.use-case.js';
import { QuotationPdfService } from '../infrastructure/pdf/quotation-pdf.service.js';
import { CloudflareR2StorageAdapter } from '../infrastructure/storage/r2-storage.adapter.js';
import { STORAGE_SERVICE } from '../infrastructure/storage/storage.interface.js';
import { DrizzleQuotationRepository } from '../infrastructure/repositories/drizzle-quotation.repository.js';
import { QUOTATION_REPOSITORY } from '../infrastructure/database/database.tokens.js';

@Module({
  controllers: [QuotationsController],
  providers: [
    CreateQuotationUseCase,
    GetQuotationUseCase,
    CalculatePricePreviewUseCase,
    UploadPhotoIntentUseCase,
    ConfirmPhotoUseCase,
    QuotationPdfService,
    {
      provide: STORAGE_SERVICE,
      useClass: CloudflareR2StorageAdapter,
    },
    {
      provide: QUOTATION_REPOSITORY,
      useClass: DrizzleQuotationRepository,
    },
  ],
  exports: [
    QUOTATION_REPOSITORY,
    STORAGE_SERVICE,
    CreateQuotationUseCase,
    GetQuotationUseCase,
    CalculatePricePreviewUseCase,
    UploadPhotoIntentUseCase,
    ConfirmPhotoUseCase,
    QuotationPdfService,
  ],
})
export class QuotationsModule {}
