import { Injectable, Inject } from '@nestjs/common';
import { type IPaymentRepository, Result, ok } from '@mitefree/domain-core';
import type { PaymentRecordResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { PAYMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ListPaymentsUseCase
  implements IUseCase<void, Result<PaymentRecordResponseDto[], string>>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
  ) {}

  async execute(): Promise<Result<PaymentRecordResponseDto[], string>> {
    const records = await this.paymentRepo.findAll();

    const dtos: PaymentRecordResponseDto[] = records.map((p) => ({
      id: p.id,
      appointmentId: p.appointmentId,
      amount: p.amount.amount,
      currency: p.amount.currency,
      type: p.type as any,
      method: p.method as any,
      status: p.status as any,
      idempotencyKey: p.idempotencyKey,
      externalReference: p.externalReference || null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return ok(dtos);
  }

  async getByAppointmentId(appointmentId: string): Promise<Result<PaymentRecordResponseDto[], string>> {
    const payments = await this.paymentRepo.findByAppointmentId(appointmentId);

    const dtos: PaymentRecordResponseDto[] = payments.map((p) => ({
      id: p.id,
      appointmentId: p.appointmentId,
      amount: p.amount.amount,
      currency: p.amount.currency,
      type: p.type as any,
      method: p.method as any,
      status: p.status as any,
      idempotencyKey: p.idempotencyKey,
      externalReference: p.externalReference || null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return ok(dtos);
  }
}
