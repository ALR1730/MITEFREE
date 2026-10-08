import { Result, ok, fail } from '../common/result.js';
import { Money } from '../value-objects/money.vo.js';
import { Payment } from '../entities/payment.entity.js';
import { PaymentStatus } from '../enums/payment-type.enum.js';

export interface WebhookIdempotencyEvaluation {
  isDuplicate: boolean;
  canProcess: boolean;
  message: string;
}

/**
 * DepositPolicy — Motor de Dominio Puro para Políticas de Anticipos y Liquidación (DDD)
 *
 * Reglas de Negocio Inmutables:
 * 1. Anticipo Obligatorio: Mínimo 30% del total de la cotización para congelar la cuadrilla.
 * 2. Idempotencia Financiera: Llave única obligatoria por transacción. Eventos repetidos se ignoran.
 * 3. Saldo de Liquidación (70%): No puede ser mayor al total ni generar montos negativos.
 */
export class DepositPolicy {
  public static readonly CANONICAL_DEPOSIT_RATE = 0.3; // 30%

  /**
   * Valida si el monto ofrecido como anticipo cubre el porcentaje mínimo requerido
   */
  public static validateDepositAmount(
    orderTotal: Money,
    depositAmount: Money,
    depositRate: number = this.CANONICAL_DEPOSIT_RATE,
  ): Result<boolean, string> {
    if (orderTotal.currency !== depositAmount.currency) {
      return fail('Currency mismatch between order total and deposit amount');
    }

    const minRequiredRes = orderTotal.percentage(depositRate);
    if (minRequiredRes.isFailure) {
      return fail(minRequiredRes.error);
    }

    const minRequired = minRequiredRes.value;

    // Permitir tolerancia de hasta 1 centavo por redondeo
    if (depositAmount.cents < minRequired.cents - 1) {
      return fail(
        `Deposit amount of ${depositAmount.amount} ${depositAmount.currency} is below the required 30% deposit of ${minRequired.amount} ${minRequired.currency}`,
      );
    }

    return ok(true);
  }

  /**
   * Calcula el saldo de liquidación restante tras pagar el anticipo
   */
  public static calculateRemainingBalance(
    orderTotal: Money,
    depositPaid: Money,
  ): Result<Money, string> {
    if (orderTotal.currency !== depositPaid.currency) {
      return fail('Currency mismatch between order total and deposit paid');
    }

    if (depositPaid.isGreaterThan(orderTotal)) {
      return fail('Deposit paid cannot exceed order total');
    }

    return orderTotal.subtract(depositPaid);
  }

  /**
   * Evalúa la idempotencia de un evento de webhook de pasarela de pagos
   */
  public static evaluateWebhookIdempotency(
    existingPayment: Payment | null,
    idempotencyKey: string,
  ): WebhookIdempotencyEvaluation {
    if (!existingPayment) {
      return {
        isDuplicate: false,
        canProcess: true,
        message: `New transaction with idempotency key ${idempotencyKey}. Ready to process.`,
      };
    }

    if (existingPayment.status === PaymentStatus.Completed) {
      return {
        isDuplicate: true,
        canProcess: false,
        message: `Transaction ${existingPayment.id} already processed and completed. Skipping duplicate event.`,
      };
    }

    return {
      isDuplicate: true,
      canProcess: true,
      message: `Transaction ${existingPayment.id} exists in status ${existingPayment.status}. Updating to completed.`,
    };
  }
}
