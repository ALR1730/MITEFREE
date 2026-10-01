import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  quotationId: string;
  clientId: string;
  idempotencyKey?: string;
}

export interface PaymentIntentResult {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'succeeded';
  amount: number;
  currency: string;
}

@Injectable()
export class MockPaymentGateway {
  private readonly logger = new Logger(MockPaymentGateway.name);
  private readonly processedIdempotencyKeys = new Set<string>();

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    if (params.idempotencyKey) {
      if (this.processedIdempotencyKeys.has(params.idempotencyKey)) {
        this.logger.warn(`Idempotency key hit: ${params.idempotencyKey}`);
      } else {
        this.processedIdempotencyKeys.add(params.idempotencyKey);
      }
    }

    const intentId = `pi_mock_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
    const clientSecret = `${intentId}_secret_mock`;

    this.logger.log(
      `Created payment intent ${intentId} for quote ${params.quotationId}: ${params.amount} ${params.currency}`,
    );

    return {
      id: intentId,
      clientSecret,
      status: 'requires_payment_method',
      amount: params.amount,
      currency: params.currency,
    };
  }
}
