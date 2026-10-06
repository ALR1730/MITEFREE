import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  BadRequestException,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreatePaymentIntentRequestSchema,
  SubmitBankTransferProofSchema,
  ReviewPaymentSchema,
  StripeWebhookPayloadSchema,
  type CreatePaymentIntentRequestDto,
  type PaymentIntentResponseDto,
  type SubmitBankTransferProofDto,
  type ReviewPaymentDto,
  type StripeWebhookPayloadDto,
  type PaymentRecordResponseDto,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { CreatePaymentIntentUseCase } from '../../application/payments/create-payment-intent.use-case.js';
import { SubmitBankTransferProofUseCase } from '../../application/payments/submit-bank-transfer.use-case.js';
import { ProcessStripeWebhookUseCase } from '../../application/payments/process-stripe-webhook.use-case.js';
import { ReviewPaymentUseCase } from '../../application/payments/review-payment.use-case.js';
import { PAYMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';
import type { IPaymentRepository } from '@mitefree/domain-core';

@ApiTags('Payments (Pagos, Anticipos & Webhooks Idempotentes)')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createIntentUseCase: CreatePaymentIntentUseCase,
    private readonly submitTransferUseCase: SubmitBankTransferProofUseCase,
    private readonly webhookUseCase: ProcessStripeWebhookUseCase,
    private readonly reviewUseCase: ReviewPaymentUseCase,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
  ) {}

  @Post('intent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a Stripe Payment Intent with strict idempotency' })
  @ApiResponse({ status: 201, description: 'Payment Intent created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid amount or appointment.' })
  @UsePipes(new ZodValidationPipe(CreatePaymentIntentRequestSchema))
  async createIntent(
    @Body() body: CreatePaymentIntentRequestDto,
  ): Promise<PaymentIntentResponseDto> {
    const result = await this.createIntentUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('transfer-proof')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit bank transfer proof (Popular, BHD, Banreservas) for review' })
  @ApiResponse({ status: 201, description: 'Transfer proof submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid proof data.' })
  @UsePipes(new ZodValidationPipe(SubmitBankTransferProofSchema))
  async submitTransfer(
    @Body() body: SubmitBankTransferProofDto,
  ): Promise<PaymentRecordResponseDto> {
    const result = await this.submitTransferUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin review (Approve/Reject) of manual bank transfer' })
  @ApiParam({ name: 'id', description: 'UUID of payment' })
  @ApiResponse({ status: 200, description: 'Payment reviewed.' })
  @ApiResponse({ status: 400, description: 'Review failed.' })
  @UsePipes(new ZodValidationPipe(ReviewPaymentSchema))
  async reviewPayment(
    @Param('id') id: string,
    @Body() body: ReviewPaymentDto,
  ): Promise<PaymentRecordResponseDto> {
    const result = await this.reviewUseCase.execute({
      paymentId: id,
      review: body,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe Webhook with HMAC signature and idempotency protection' })
  @ApiResponse({ status: 200, description: 'Webhook processed or duplicate skipped.' })
  @UsePipes(new ZodValidationPipe(StripeWebhookPayloadSchema))
  async handleStripeWebhook(@Body() body: StripeWebhookPayloadDto) {
    const result = await this.webhookUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Get('appointment/:appointmentId')
  @ApiOperation({ summary: 'List payments associated with an appointment' })
  @ApiParam({ name: 'appointmentId', description: 'UUID of appointment' })
  @ApiResponse({ status: 200, description: 'List of payments.' })
  async getByAppointment(
    @Param('appointmentId') appointmentId: string,
  ): Promise<PaymentRecordResponseDto[]> {
    const payments = await this.paymentRepo.findByAppointmentId(appointmentId);

    return payments.map((p) => ({
      id: p.id,
      appointmentId: p.appointmentId,
      amount: p.amount.amount,
      currency: p.amount.currency,
      type: p.type as any,
      method: p.method as any,
      status: p.status as any,
      externalReference: p.externalReference || null,
      idempotencyKey: p.idempotencyKey,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }
}
