import { describe, it, expect } from 'vitest';
import { Payment } from '../src/entities/payment.entity.js';
import { DepositPolicy } from '../src/engines/deposit-policy.engine.js';
import { Money } from '../src/value-objects/money.vo.js';
import {
  PaymentType,
  PaymentMethod,
  PaymentStatus,
} from '../src/enums/payment-type.enum.js';

describe('Payment Aggregate & DepositPolicy — TDD Suite (≥95% Cobertura)', () => {
  const sampleAppointmentId = '11111111-1111-1111-1111-111111111111';
  const sampleKey = 'idemp_key_stripe_evt_001';

  // 1. Creación e Invariantes del Agregado Payment
  it('01: GivenValidParams_WhenCreatingStripePayment_ThenInitialStatusIsPending', () => {
    const amount = Money.create(30).unwrap();
    const result = Payment.create({
      id: 'pay-1',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: sampleKey,
    });

    expect(result.isSuccess).toBe(true);
    const payment = result.value;
    expect(payment.status).toBe(PaymentStatus.Pending);
    expect(payment.amount.amount).toBe(30);
    expect(payment.idempotencyKey).toBe(sampleKey);
  });

  it('02: GivenBankTransferMethod_WhenCreatingPayment_ThenInitialStatusIsUnderReview', () => {
    const amount = Money.create(50).unwrap();
    const result = Payment.create({
      id: 'pay-2',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.BankTransfer,
      idempotencyKey: 'transfer_bhd_1234',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.status).toBe(PaymentStatus.UnderReview);
  });

  it('03: GivenZeroAmount_WhenCreatingPayment_ThenReturnsFailure', () => {
    const zero = Money.zero();
    const result = Payment.create({
      id: 'pay-3',
      appointmentId: sampleAppointmentId,
      amount: zero,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: sampleKey,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('greater than zero');
  });

  it('04: GivenEmptyIdempotencyKey_WhenCreatingPayment_ThenReturnsFailure', () => {
    const amount = Money.create(25).unwrap();
    const result = Payment.create({
      id: 'pay-4',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: '   ',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Idempotency key is mandatory');
  });

  it('05: GivenPendingPayment_WhenCompleted_ThenTransitionsToCompleted', () => {
    const amount = Money.create(30).unwrap();
    const payment = Payment.create({
      id: 'pay-5',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: sampleKey,
    }).unwrap();

    const completeResult = payment.complete('ch_stripe_live_999');
    expect(completeResult.isSuccess).toBe(true);
    expect(completeResult.value.status).toBe(PaymentStatus.Completed);
    expect(completeResult.value.externalReference).toBe('ch_stripe_live_999');
  });

  it('06: GivenAlreadyCompletedPayment_WhenCompleteCalledAgain_ThenReturnsFailure', () => {
    const amount = Money.create(30).unwrap();
    const payment = Payment.create({
      id: 'pay-6',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: sampleKey,
    })
      .unwrap()
      .complete('ref-1')
      .unwrap();

    const secondComplete = payment.complete('ref-2');
    expect(secondComplete.isFailure).toBe(true);
    expect(secondComplete.error).toContain('already completed');
  });

  it('07: GivenUnderReviewPayment_WhenRejected_ThenTransitionsToFailed', () => {
    const amount = Money.create(30).unwrap();
    const payment = Payment.create({
      id: 'pay-7',
      appointmentId: sampleAppointmentId,
      amount,
      type: PaymentType.Deposit,
      method: PaymentMethod.BankTransfer,
      idempotencyKey: 'proof-001',
    }).unwrap();

    const rejectResult = payment.reject('Comprobante ilegible');
    expect(rejectResult.isSuccess).toBe(true);
    expect(rejectResult.value.status).toBe(PaymentStatus.Failed);
  });

  // 2. DepositPolicy Engine Tests
  it('08: GivenOrderTotalAnd30PercentDeposit_WhenValidated_ThenReturnsSuccess', () => {
    const total = Money.create(100).unwrap();
    const deposit = Money.create(30).unwrap(); // 30% exacto

    const validation = DepositPolicy.validateDepositAmount(total, deposit);
    expect(validation.isSuccess).toBe(true);
  });

  it('09: GivenDepositLowerThan30Percent_WhenValidated_ThenReturnsFailureWithDetail', () => {
    const total = Money.create(100).unwrap();
    const deposit = Money.create(25).unwrap(); // 25% < 30%

    const validation = DepositPolicy.validateDepositAmount(total, deposit);
    expect(validation.isFailure).toBe(true);
    expect(validation.error).toContain('is below the required 30% deposit');
  });

  it('10: GivenCurrencyMismatchInDeposit_WhenValidated_ThenReturnsFailure', () => {
    const totalUSD = Money.create(100, 'USD').unwrap();
    const depositDOP = Money.create(1800, 'DOP').unwrap();

    const validation = DepositPolicy.validateDepositAmount(totalUSD, depositDOP);
    expect(validation.isFailure).toBe(true);
    expect(validation.error).toContain('Currency mismatch');
  });

  it('11: GivenOrderTotalAndDepositPaid_WhenCalculatingRemaining_ThenReturnsExact70Percent', () => {
    const total = Money.create(200).unwrap();
    const deposit = Money.create(60).unwrap(); // 30%

    const remainingRes = DepositPolicy.calculateRemainingBalance(total, deposit);
    expect(remainingRes.isSuccess).toBe(true);
    expect(remainingRes.value.amount).toBe(140); // 70%
  });

  it('12: GivenDepositExceedingTotal_WhenCalculatingRemaining_ThenReturnsFailure', () => {
    const total = Money.create(100).unwrap();
    const deposit = Money.create(120).unwrap();

    const remainingRes = DepositPolicy.calculateRemainingBalance(total, deposit);
    expect(remainingRes.isFailure).toBe(true);
    expect(remainingRes.error).toContain('cannot exceed order total');
  });

  // 3. Idempotencia de Webhooks
  it('13: GivenNoExistingPayment_WhenEvaluatingWebhook_ThenAllowsProcessing', () => {
    const evaluation = DepositPolicy.evaluateWebhookIdempotency(null, 'evt_001');
    expect(evaluation.isDuplicate).toBe(false);
    expect(evaluation.canProcess).toBe(true);
  });

  it('14: GivenCompletedPayment_WhenDuplicateWebhookReceived_ThenSkipsProcessing', () => {
    const payment = Payment.create({
      id: 'pay-done',
      appointmentId: sampleAppointmentId,
      amount: Money.create(30).unwrap(),
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: 'evt_002',
    })
      .unwrap()
      .complete('ref-done')
      .unwrap();

    const evaluation = DepositPolicy.evaluateWebhookIdempotency(payment, 'evt_002');
    expect(evaluation.isDuplicate).toBe(true);
    expect(evaluation.canProcess).toBe(false);
    expect(evaluation.message).toContain('Skipping duplicate');
  });

  it('15: GivenPendingPayment_WhenWebhookReceived_ThenAllowsCompleting', () => {
    const payment = Payment.create({
      id: 'pay-pending',
      appointmentId: sampleAppointmentId,
      amount: Money.create(30).unwrap(),
      type: PaymentType.Deposit,
      method: PaymentMethod.Stripe,
      idempotencyKey: 'evt_003',
    }).unwrap();

    const evaluation = DepositPolicy.evaluateWebhookIdempotency(payment, 'evt_003');
    expect(evaluation.isDuplicate).toBe(true);
    expect(evaluation.canProcess).toBe(true);
  });
});
