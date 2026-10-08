import { Injectable, Inject } from '@nestjs/common';
import {
  type IPaymentRepository,
  type IAppointmentRepository,
  AppointmentStatus,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { ReviewPaymentDto, PaymentRecordResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  PAYMENT_REPOSITORY,
  APPOINTMENT_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';

export interface ReviewPaymentInput {
  paymentId: string;
  review: ReviewPaymentDto;
}

@Injectable()
export class ReviewPaymentUseCase implements IUseCase<
  ReviewPaymentInput,
  Result<PaymentRecordResponseDto, string>
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(input: ReviewPaymentInput): Promise<Result<PaymentRecordResponseDto, string>> {
    const payment = await this.paymentRepo.findById(input.paymentId);
    if (!payment) {
      return fail(`Payment with id '${input.paymentId}' not found.`);
    }

    if (input.review.decision === 'APPROVE') {
      const completeRes = payment.complete(`AdminReview:Approved`);
      if (completeRes.isFailure) return fail(completeRes.error);
      const updated = completeRes.value;
      await this.paymentRepo.update(updated);

      // Confirmar cita asociada
      const appointment = await this.appointmentRepo.findById(payment.appointmentId);
      if (appointment && appointment.status === AppointmentStatus.PendingPayment) {
        const transRes = appointment.transitionTo(AppointmentStatus.Confirmed);
        if (transRes.isSuccess) {
          await this.appointmentRepo.update(transRes.value);
        }
      }

      return ok({
        id: updated.id,
        appointmentId: updated.appointmentId,
        amount: updated.amount.amount,
        currency: updated.amount.currency,
        type: updated.type as any,
        method: updated.method as any,
        status: updated.status as any,
        externalReference: updated.externalReference,
        idempotencyKey: updated.idempotencyKey,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      });
    } else {
      const rejectRes = payment.reject(input.review.rejectionReason);
      if (rejectRes.isFailure) return fail(rejectRes.error);
      const updated = rejectRes.value;
      await this.paymentRepo.update(updated);

      return ok({
        id: updated.id,
        appointmentId: updated.appointmentId,
        amount: updated.amount.amount,
        currency: updated.amount.currency,
        type: updated.type as any,
        method: updated.method as any,
        status: updated.status as any,
        externalReference: updated.externalReference,
        idempotencyKey: updated.idempotencyKey,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      });
    }
  }
}
