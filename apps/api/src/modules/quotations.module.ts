import { Module } from '@nestjs/common';
import { QuotationsController } from '../presentation/controllers/quotations.controller.js';
import { CreateQuotationUseCase } from '../application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../application/quotations/get-quotation.use-case.js';
import { DrizzleQuotationRepository } from '../infrastructure/repositories/drizzle-quotation.repository.js';
import { QUOTATION_REPOSITORY } from '../infrastructure/database/database.tokens.js';

@Module({
  controllers: [QuotationsController],
  providers: [
    CreateQuotationUseCase,
    GetQuotationUseCase,
    {
      provide: QUOTATION_REPOSITORY,
      useClass: DrizzleQuotationRepository,
    },
  ],
  exports: [QUOTATION_REPOSITORY, CreateQuotationUseCase, GetQuotationUseCase],
})
export class QuotationsModule {}
