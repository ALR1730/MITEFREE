import { Result, ok, fail } from '../common/result.js';
import { Money } from '../value-objects/money.vo.js';
import {
  PaymentType,
  PaymentMethod,
  PaymentStatus,
} from '../enums/payment-type.enum.js';

export interface PaymentProps {
  id: string;
  appointmentId: string;
  amount: Money;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  idempotencyKey: string;
  externalReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  readonly id: string;
  readonly appointmentId: string;
  readonly amount: Money;
  readonly type: PaymentType;
  readonly method: PaymentMethod;
  readonly status: PaymentStatus;
  readonly idempotencyKey: string;
  readonly externalReference?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PaymentProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.amount = props.amount;
    this.type = props.type;
    this.method = props.method;
    this.status = props.status;
    this.idempotencyKey = props.idempotencyKey;
    this.externalReference = props.externalReference;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    Object.freeze(this);
  }

  static create(params: {
    id: string;
    appointmentId: string;
    amount: Money;
    type: PaymentType;
    method: PaymentMethod;
    idempotencyKey: string;
    externalReference?: string;
    status?: PaymentStatus;
    now?: Date;
  }): Result<Payment, string> {
    if (params.amount.isZero() || params.amount.amount < 0) {
      return fail('Payment amount must be greater than zero');
    }

    if (!params.idempotencyKey || params.idempotencyKey.trim().length === 0) {
      return fail('Idempotency key is mandatory for financial integrity');
    }

    const now = params.now ?? new Date();
    const initialStatus =
      params.status ??
      (params.method === PaymentMethod.BankTransfer
        ? PaymentStatus.UnderReview
        : PaymentStatus.Pending);

    return ok(
      new Payment({
        id: params.id,
        appointmentId: params.appointmentId,
        amount: params.amount,
        type: params.type,
        method: params.method,
        status: initialStatus,
        idempotencyKey: params.idempotencyKey,
        externalReference: params.externalReference,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  complete(externalReference?: string, now: Date = new Date()): Result<Payment, string> {
    if (this.status === PaymentStatus.Completed) {
      return fail('Payment is already completed');
    }
    if (this.status === PaymentStatus.Failed || this.status === PaymentStatus.Refunded) {
      return fail(`Cannot complete payment in status ${this.status}`);
    }

    return ok(
      new Payment({
        ...this,
        status: PaymentStatus.Completed,
        externalReference: externalReference ?? this.externalReference,
        updatedAt: now,
      }),
    );
  }

  reject(reason?: string, now: Date = new Date()): Result<Payment, string> {
    if (this.status === PaymentStatus.Completed) {
      return fail('Cannot reject an already completed payment');
    }

    return ok(
      new Payment({
        ...this,
        status: PaymentStatus.Failed,
        externalReference: reason ? `Rejected: ${reason}` : this.externalReference,
        updatedAt: now,
      }),
    );
  }
}
