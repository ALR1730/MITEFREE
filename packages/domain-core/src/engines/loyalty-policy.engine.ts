import { Money } from '../value-objects/money.vo.js';
import { Result, ok, fail } from '../common/result.js';

export const DEFAULT_CASHBACK_RATE = 0.05; // 5% Cashback
export const DEFAULT_MAX_REDEMPTION_RATE = 0.5; // Máximo 50% de la orden pagable con billetera
export const DEFAULT_REFERRAL_BONUS_AMOUNT = 20.0; // $20 USD para el patrocinador
export const DEFAULT_WELCOME_DISCOUNT_PERCENT = 0.1; // 10% OFF para el nuevo cliente

export interface ReferralEligibilityInput {
  referrerUserId: string;
  refereeUserId: string;
  referrerPhone?: string;
  refereePhone?: string;
  referrerEmail?: string;
  refereeEmail?: string;
  refereeCompletedAppointmentsCount: number;
}

export interface ReferralEligibilityResult {
  isValid: boolean;
  bonusAmount: Money;
  welcomeDiscountPercent: number;
}

export class LoyaltyPolicyEngine {
  /**
   * Calcula el cashback inmutable ganado por un cliente tras pagar un servicio.
   */
  static calculateCashback(paidAmount: Money, rate: number = DEFAULT_CASHBACK_RATE): Money {
    if (paidAmount.amount <= 0 || rate <= 0) {
      return Money.zero(paidAmount.currency);
    }
    const cashback = Math.round(paidAmount.amount * rate * 100) / 100;
    return Money.from(cashback, paidAmount.currency);
  }

  /**
   * Calcula el monto máximo de saldo de billetera que puede aplicarse a una orden
   * para proteger la liquidez operativa (máximo 50% del total de la orden).
   */
  static calculateMaxRedeemable(
    orderTotal: Money,
    maxRate: number = DEFAULT_MAX_REDEMPTION_RATE,
  ): Money {
    if (orderTotal.amount <= 0 || maxRate <= 0) {
      return Money.zero(orderTotal.currency);
    }
    const maxRedeemable = Math.round(orderTotal.amount * maxRate * 100) / 100;
    return Money.from(maxRedeemable, orderTotal.currency);
  }

  /**
   * Valida la elegibilidad y barreras anti-fraude para la aplicación de bonos de referido.
   */
  static validateReferralEligibility(
    input: ReferralEligibilityInput,
  ): Result<ReferralEligibilityResult, string> {
    // 1. Barrera Anti-Auto-Referido (Mismo ID de usuario)
    if (input.referrerUserId.trim() === input.refereeUserId.trim()) {
      return fail('Anti-fraud violation: A user cannot refer themselves.');
    }

    // 2. Barrera Anti-Fraude de Teléfono (Normalización de los últimos 10 dígitos)
    if (input.referrerPhone && input.refereePhone) {
      const rawA = input.referrerPhone.replace(/\D/g, '');
      const rawB = input.refereePhone.replace(/\D/g, '');
      const normA = rawA.length >= 10 ? rawA.slice(-10) : rawA;
      const normB = rawB.length >= 10 ? rawB.slice(-10) : rawB;
      if (normA.length >= 7 && normA === normB) {
        return fail(
          'Anti-fraud violation: Referrer and referee cannot share the same phone number.',
        );
      }
    }

    // 3. Barrera Anti-Fraude de Email
    if (
      input.referrerEmail &&
      input.refereeEmail &&
      input.referrerEmail.trim().toLowerCase() === input.refereeEmail.trim().toLowerCase()
    ) {
      return fail(
        'Anti-fraud violation: Referrer and referee cannot share the same email address.',
      );
    }

    // 4. Barrera de Primera Orden (Solo para clientes nuevos sin citas completadas previas)
    if (input.refereeCompletedAppointmentsCount > 0) {
      return fail(
        'Referral welcome discount only applies to first-time customers with no previous completed appointments.',
      );
    }

    return ok({
      isValid: true,
      bonusAmount: Money.from(DEFAULT_REFERRAL_BONUS_AMOUNT, 'USD'),
      welcomeDiscountPercent: DEFAULT_WELCOME_DISCOUNT_PERCENT,
    });
  }
}
