import { Module } from '@nestjs/common';
import { PaymentsController } from '../presentation/controllers/payments.controller.js';
import { CreatePaymentIntentUseCase } from '../application/payments/create-payment-intent.use-case.js';
import { SubmitBankTransferProofUseCase } from '../application/payments/submit-bank-transfer.use-case.js';
import { ProcessStripeWebhookUseCase } from '../application/payments/process-stripe-webhook.use-case.js';
import { ReviewPaymentUseCase } from '../application/payments/review-payment.use-case.js';
import { DrizzlePaymentRepository } from '../infrastructure/repositories/drizzle-payment.repository.js';
import { PAYMENT_REPOSITORY } from '../infrastructure/database/database.tokens.js';
import { AppointmentsModule } from './appointments.module.js';

@Module({
  imports: [AppointmentsModule],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentIntentUseCase,
    SubmitBankTransferProofUseCase,
    ProcessStripeWebhookUseCase,
    ReviewPaymentUseCase,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
  exports: [
    PAYMENT_REPOSITORY,
    CreatePaymentIntentUseCase,
    SubmitBankTransferProofUseCase,
    ProcessStripeWebhookUseCase,
    ReviewPaymentUseCase,
  ],
})
export class PaymentsModule {}
