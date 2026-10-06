import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePaymentIntentUseCase } from '../src/application/payments/create-payment-intent.use-case.js';
import { SubmitBankTransferProofUseCase } from '../src/application/payments/submit-bank-transfer.use-case.js';
import { ProcessStripeWebhookUseCase } from '../src/application/payments/process-stripe-webhook.use-case.js';
import { ReviewPaymentUseCase } from '../src/application/payments/review-payment.use-case.js';
import { DrizzlePaymentRepository } from '../src/infrastructure/repositories/drizzle-payment.repository.js';
import { DrizzleAppointmentRepository } from '../src/infrastructure/repositories/drizzle-appointment.repository.js';
import { Appointment, AppointmentStatus, PaymentStatus } from '@mitefree/domain-core';

describe('Payments Use Cases & Webhooks (Unit Tests)', () => {
  let paymentRepo: DrizzlePaymentRepository;
  let appointmentRepo: DrizzleAppointmentRepository;
  let createIntentUseCase: CreatePaymentIntentUseCase;
  let submitTransferUseCase: SubmitBankTransferProofUseCase;
  let webhookUseCase: ProcessStripeWebhookUseCase;
  let reviewUseCase: ReviewPaymentUseCase;

  const sampleAppointmentId = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    paymentRepo = new DrizzlePaymentRepository(null);
    appointmentRepo = new DrizzleAppointmentRepository(null);

    // Guardar una cita en estado PendingPayment
    const appointment = Appointment.create({
      id: sampleAppointmentId,
      quotationId: '22222222-2222-2222-2222-222222222222',
      clientId: '33333333-3333-3333-3333-333333333333',
      timeSlotId: 'MORNING',
      scheduledDate: new Date('2026-10-25T10:00:00Z'),
    });
    await appointmentRepo.save(appointment);

    createIntentUseCase = new CreatePaymentIntentUseCase(paymentRepo, appointmentRepo);
    submitTransferUseCase = new SubmitBankTransferProofUseCase(paymentRepo, appointmentRepo);
    webhookUseCase = new ProcessStripeWebhookUseCase(paymentRepo, appointmentRepo);
    reviewUseCase = new ReviewPaymentUseCase(paymentRepo, appointmentRepo);
  });

  it('GivenValidAppointment_WhenCreatingPaymentIntent_ThenSucceedsAndGeneratesClientSecret', async () => {
    const result = await createIntentUseCase.execute({
      appointmentId: sampleAppointmentId,
      amount: 45.0,
      currency: 'USD',
      idempotencyKey: 'idemp_test_stripe_001',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.amount).toBe(45.0);
    expect(result.value.clientSecret).toContain('pi_stripe_');
    expect(result.value.status).toBe('PENDING');
  });

  it('GivenSameIdempotencyKey_WhenCreatingPaymentIntentTwice_ThenReturnsExistingPayment', async () => {
    const first = await createIntentUseCase.execute({
      appointmentId: sampleAppointmentId,
      amount: 45.0,
      currency: 'USD',
      idempotencyKey: 'idemp_test_stripe_dup',
    });

    const second = await createIntentUseCase.execute({
      appointmentId: sampleAppointmentId,
      amount: 45.0,
      currency: 'USD',
      idempotencyKey: 'idemp_test_stripe_dup',
    });

    expect(first.isSuccess).toBe(true);
    expect(second.isSuccess).toBe(true);
    expect(first.value.paymentId).toBe(second.value.paymentId);
  });

  it('GivenBankTransferProof_WhenSubmitted_ThenStatusIsUnderReview', async () => {
    const result = await submitTransferUseCase.execute({
      appointmentId: sampleAppointmentId,
      amount: 45.0,
      bankName: 'POPULAR',
      referenceNumber: 'BPD-998234',
      idempotencyKey: 'idemp_bank_001',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.status).toBe('UNDER_REVIEW');
    expect(result.value.externalReference).toBe('POPULAR:BPD-998234');
  });

  it('GivenStripePaymentIntentSucceededWebhook_WhenProcessed_ThenCompletesAndAutoConfirmsAppointment', async () => {
    const webhookEvent = {
      id: 'evt_stripe_charge_success_99',
      type: 'payment_intent.succeeded',
      data: {
        amount: 4500, // $45.00
        currency: 'usd',
        metadata: {
          appointmentId: sampleAppointmentId,
        },
      },
    };

    const result = await webhookUseCase.execute(webhookEvent);
    expect(result.isSuccess).toBe(true);
    expect(result.value.processed).toBe(true);
    expect(result.value.isDuplicate).toBe(false);

    // Verificar que la cita pasó a Confirmed
    const updatedApt = await appointmentRepo.findById(sampleAppointmentId);
    expect(updatedApt?.status).toBe(AppointmentStatus.Confirmed);
  });

  it('GivenDuplicateStripeWebhook_WhenReceivedSecondTime_ThenDetectsDuplicateAndSkips', async () => {
    const webhookEvent = {
      id: 'evt_stripe_duplicate_test',
      type: 'payment_intent.succeeded',
      data: {
        amount: 4500,
        currency: 'usd',
        metadata: {
          appointmentId: sampleAppointmentId,
        },
      },
    };

    const first = await webhookUseCase.execute(webhookEvent);
    const second = await webhookUseCase.execute(webhookEvent);

    expect(first.value.processed).toBe(true);
    expect(second.value.isDuplicate).toBe(true);
    expect(second.value.processed).toBe(false);
  });

  it('GivenUnderReviewBankTransfer_WhenAdminApproves_ThenCompletesPaymentAndConfirmsAppointment', async () => {
    const transfer = (
      await submitTransferUseCase.execute({
        appointmentId: sampleAppointmentId,
        amount: 45.0,
        bankName: 'BHD',
        referenceNumber: 'BHD-112233',
        idempotencyKey: 'idemp_bank_approval',
      })
    ).value;

    const reviewResult = await reviewUseCase.execute({
      paymentId: transfer.id,
      review: {
        decision: 'APPROVE',
      },
    });

    expect(reviewResult.isSuccess).toBe(true);
    expect(reviewResult.value.status).toBe('COMPLETED');

    const appointment = await appointmentRepo.findById(sampleAppointmentId);
    expect(appointment?.status).toBe(AppointmentStatus.Confirmed);
  });

  it('GivenUnderReviewBankTransfer_WhenAdminRejects_ThenMarksFailed', async () => {
    const transfer = (
      await submitTransferUseCase.execute({
        appointmentId: sampleAppointmentId,
        amount: 45.0,
        bankName: 'BANRESERVAS',
        referenceNumber: 'BR-445566',
        idempotencyKey: 'idemp_bank_rejection',
      })
    ).value;

    const reviewResult = await reviewUseCase.execute({
      paymentId: transfer.id,
      review: {
        decision: 'REJECT',
        rejectionReason: 'Número de referencia no encontrado en banca digital',
      },
    });

    expect(reviewResult.isSuccess).toBe(true);
    expect(reviewResult.value.status).toBe('FAILED');
  });
});
