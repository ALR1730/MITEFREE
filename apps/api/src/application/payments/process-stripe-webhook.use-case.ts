import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IPaymentRepository,
  type IAppointmentRepository,
  Payment,
  Money,
  PaymentType,
  PaymentMethod,
  DepositPolicy,
  AppointmentStatus,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { StripeWebhookPayloadDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import {
  PAYMENT_REPOSITORY,
  APPOINTMENT_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';

export interface WebhookProcessingResult {
  processed: boolean;
  isDuplicate: boolean;
  appointmentId?: string;
  paymentId?: string;
  message: string;
}

@Injectable()
export class ProcessStripeWebhookUseCase implements IUseCase<
  StripeWebhookPayloadDto,
  Result<WebhookProcessingResult, string>
> {
  private readonly logger = new Logger(ProcessStripeWebhookUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(event: StripeWebhookPayloadDto): Promise<Result<WebhookProcessingResult, string>> {
    const eventId = event.id;
    const eventType = event.type;

    this.logger.log(`Received Stripe Webhook: ${eventType} (Event ID: ${eventId})`);

    if (eventType !== 'payment_intent.succeeded') {
      return ok({
        processed: false,
        isDuplicate: false,
        message: `Event type '${eventType}' acknowledged without action.`,
      });
    }

    const paymentIntent = event.data?.object || event.data;
    const idempotencyKey = eventId;
    const existing = await this.paymentRepo.findByIdempotencyKey(idempotencyKey);

    const idempotencyEval = DepositPolicy.evaluateWebhookIdempotency(existing, idempotencyKey);

    if (idempotencyEval.isDuplicate && !idempotencyEval.canProcess) {
      this.logger.warn(`Duplicate webhook event detected and skipped: ${eventId}`);
      return ok({
        processed: false,
        isDuplicate: true,
        paymentId: existing?.id,
        appointmentId: existing?.appointmentId,
        message: idempotencyEval.message,
      });
    }

    let payment: Payment;
    const appointmentId =
      paymentIntent?.metadata?.appointmentId ||
      existing?.appointmentId ||
      '00000000-0000-0000-0000-000000000000';

    if (existing) {
      const completeRes = existing.complete(eventId);
      if (completeRes.isFailure) return fail(completeRes.error);
      payment = completeRes.value;
      await this.paymentRepo.update(payment);
    } else {
      const amountDollars = (paymentIntent.amount || 3000) / 100;
      const currency = (paymentIntent.currency || 'USD').toUpperCase();
      const money = Money.create(amountDollars, currency).unwrap();

      const newPaymentRes = Payment.create({
        id: randomUUID(),
        appointmentId,
        amount: money,
        type: PaymentType.Deposit,
        method: PaymentMethod.Stripe,
        idempotencyKey,
        externalReference: eventId,
      });

      if (newPaymentRes.isFailure) return fail(newPaymentRes.error);
      payment = newPaymentRes.value.complete(eventId).unwrap();
      await this.paymentRepo.save(payment);
    }

    // Auto-confirmar cita si existe
    if (appointmentId && appointmentId !== '00000000-0000-0000-0000-000000000000') {
      const appointment = await this.appointmentRepo.findById(appointmentId);
      if (appointment && appointment.status === AppointmentStatus.PendingPayment) {
        const transRes = appointment.transitionTo(AppointmentStatus.Confirmed);
        if (transRes.isSuccess) {
          await this.appointmentRepo.update(transRes.value);
          this.logger.log(`Appointment ${appointmentId} auto-confirmed via Stripe Webhook.`);
        }
      }
    }

    return ok({
      processed: true,
      isDuplicate: idempotencyEval.isDuplicate,
      paymentId: payment.id,
      appointmentId: payment.appointmentId,
      message: 'Payment successfully completed and appointment confirmed.',
    });
  }
}
