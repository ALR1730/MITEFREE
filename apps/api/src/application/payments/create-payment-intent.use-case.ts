import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IPaymentRepository,
  type IAppointmentRepository,
  Payment,
  Money,
  PaymentType,
  PaymentMethod,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type {
  CreatePaymentIntentRequestDto,
  PaymentIntentResponseDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  PAYMENT_REPOSITORY,
  APPOINTMENT_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class CreatePaymentIntentUseCase
  implements
    IUseCase<
      CreatePaymentIntentRequestDto,
      Result<PaymentIntentResponseDto, string>
    >
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(
    dto: CreatePaymentIntentRequestDto,
  ): Promise<Result<PaymentIntentResponseDto, string>> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);
    if (!appointment) {
      return fail(`Appointment with id '${dto.appointmentId}' not found.`);
    }

    // 1. Verificación de Idempotencia estricta
    const existing = await this.paymentRepo.findByIdempotencyKey(dto.idempotencyKey);
    if (existing) {
      return ok({
        paymentId: existing.id,
        clientSecret: `pi_stripe_${existing.id}_secret`,
        amount: existing.amount.amount,
        currency: existing.amount.currency,
        idempotencyKey: existing.idempotencyKey,
        status: existing.status as any,
      });
    }

    const amountResult = Money.create(dto.amount, dto.currency ?? 'USD');
    if (amountResult.isFailure) {
      return fail(amountResult.error);
    }
    const paymentAmount = amountResult.value;

    const paymentId = randomUUID();
    const createResult = Payment.create({
      id: paymentId,
      appointmentId: dto.appointmentId,
      amount: paymentAmount,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: dto.idempotencyKey,
    });

    if (createResult.isFailure) {
      return fail(createResult.error);
    }

    const payment = createResult.value;
    await this.paymentRepo.save(payment);

    return ok({
      paymentId: payment.id,
      clientSecret: `pi_stripe_${payment.id}_secret`,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      idempotencyKey: payment.idempotencyKey,
      status: payment.status as any,
    });
  }
}
