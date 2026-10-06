import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IPaymentRepository,
  type IAppointmentRepository,
  Payment,
  Money,
  PaymentType,
  PaymentMethod,
  PaymentStatus,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type {
  SubmitBankTransferProofDto,
  PaymentRecordResponseDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  PAYMENT_REPOSITORY,
  APPOINTMENT_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class SubmitBankTransferProofUseCase
  implements
    IUseCase<
      SubmitBankTransferProofDto,
      Result<PaymentRecordResponseDto, string>
    >
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(
    dto: SubmitBankTransferProofDto,
  ): Promise<Result<PaymentRecordResponseDto, string>> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);
    if (!appointment) {
      return fail(`Appointment with id '${dto.appointmentId}' not found.`);
    }

    const existing = await this.paymentRepo.findByIdempotencyKey(dto.idempotencyKey);
    if (existing) {
      return ok({
        id: existing.id,
        appointmentId: existing.appointmentId,
        amount: existing.amount.amount,
        currency: existing.amount.currency,
        type: existing.type as any,
        method: existing.method as any,
        status: existing.status as any,
        externalReference: existing.externalReference,
        idempotencyKey: existing.idempotencyKey,
        createdAt: existing.createdAt.toISOString(),
        updatedAt: existing.updatedAt.toISOString(),
      });
    }

    const amountResult = Money.create(dto.amount, 'USD');
    if (amountResult.isFailure) {
      return fail(amountResult.error);
    }

    const paymentId = randomUUID();
    const externalRef = `${dto.bankName}:${dto.referenceNumber}`;

    const createResult = Payment.create({
      id: paymentId,
      appointmentId: dto.appointmentId,
      amount: amountResult.value,
      type: PaymentType.Deposit,
      method: PaymentMethod.BankTransfer,
      idempotencyKey: dto.idempotencyKey,
      externalReference: externalRef,
      status: PaymentStatus.UnderReview,
    });

    if (createResult.isFailure) {
      return fail(createResult.error);
    }

    const payment = createResult.value;
    await this.paymentRepo.save(payment);

    return ok({
      id: payment.id,
      appointmentId: payment.appointmentId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      type: payment.type as any,
      method: payment.method as any,
      status: payment.status as any,
      externalReference: payment.externalReference,
      idempotencyKey: payment.idempotencyKey,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    });
  }
}
