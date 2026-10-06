import { describe, it, expect } from 'vitest';
import {
  LoyaltyPolicyEngine,
  Money,
  Wallet,
  WalletTransactionType,
} from '../src/index.js';

describe('LoyaltyPolicyEngine & Wallet Domain Specs', () => {
  describe('Cashback Calculation', () => {
    it('should calculate exactly 5% cashback by default', () => {
      const paid = Money.from(100.0, 'USD');
      const cashback = LoyaltyPolicyEngine.calculateCashback(paid);
      expect(cashback.amount).toBe(5.0);
      expect(cashback.currency).toBe('USD');
    });

    it('should round fractional cents correctly on irregular amounts', () => {
      const paid = Money.from(123.45, 'USD');
      // 123.45 * 0.05 = 6.1725 -> 6.17
      const cashback = LoyaltyPolicyEngine.calculateCashback(paid);
      expect(cashback.amount).toBe(6.17);
    });

    it('should allow custom VIP cashback rates', () => {
      const paid = Money.from(200.0, 'USD');
      const cashback = LoyaltyPolicyEngine.calculateCashback(paid, 0.08); // 8% VIP
      expect(cashback.amount).toBe(16.0);
    });

    it('should return zero cashback for zero or negative payments', () => {
      const zero = Money.zero('USD');
      expect(LoyaltyPolicyEngine.calculateCashback(zero).amount).toBe(0);
    });
  });

  describe('Max Redeemable Limit (50% Order Cap)', () => {
    it('should cap redemption at 50% of total order value', () => {
      const orderTotal = Money.from(150.0, 'USD');
      const maxRedeemable = LoyaltyPolicyEngine.calculateMaxRedeemable(orderTotal);
      expect(maxRedeemable.amount).toBe(75.0);
    });

    it('should handle odd amounts with exact rounding', () => {
      const orderTotal = Money.from(77.77, 'USD');
      const maxRedeemable = LoyaltyPolicyEngine.calculateMaxRedeemable(orderTotal);
      // 77.77 * 0.5 = 38.885 -> 38.89
      expect(maxRedeemable.amount).toBe(38.89);
    });

    it('should return zero when order total is zero', () => {
      const zero = Money.zero('USD');
      expect(LoyaltyPolicyEngine.calculateMaxRedeemable(zero).amount).toBe(0);
    });
  });

  describe('Referral Anti-Fraud Validation', () => {
    it('should reject self-referrals (same user ID)', () => {
      const result = LoyaltyPolicyEngine.validateReferralEligibility({
        referrerUserId: 'usr_123',
        refereeUserId: 'usr_123',
        refereeCompletedAppointmentsCount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('A user cannot refer themselves');
    });

    it('should reject referrals with identical phone numbers', () => {
      const result = LoyaltyPolicyEngine.validateReferralEligibility({
        referrerUserId: 'usr_111',
        refereeUserId: 'usr_222',
        referrerPhone: '+1-809-555-1234',
        refereePhone: '(809) 555-1234',
        refereeCompletedAppointmentsCount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('cannot share the same phone number');
    });

    it('should reject referrals with identical emails regardless of casing', () => {
      const result = LoyaltyPolicyEngine.validateReferralEligibility({
        referrerUserId: 'usr_111',
        refereeUserId: 'usr_222',
        referrerEmail: 'Angel@AlrCompany.com',
        refereeEmail: 'angel@alrcompany.com',
        refereeCompletedAppointmentsCount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('cannot share the same email address');
    });

    it('should reject referral discounts for existing repeat customers', () => {
      const result = LoyaltyPolicyEngine.validateReferralEligibility({
        referrerUserId: 'usr_111',
        refereeUserId: 'usr_222',
        referrerPhone: '8095551111',
        refereePhone: '8095552222',
        referrerEmail: 'referrer@domain.com',
        refereeEmail: 'referee@domain.com',
        refereeCompletedAppointmentsCount: 2, // Ya tiene 2 citas completadas
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('first-time customers');
    });

    it('should approve valid first-time referees with bonus and discount', () => {
      const result = LoyaltyPolicyEngine.validateReferralEligibility({
        referrerUserId: 'usr_111',
        refereeUserId: 'usr_222',
        referrerPhone: '8095551111',
        refereePhone: '8095552222',
        referrerEmail: 'referrer@domain.com',
        refereeEmail: 'referee@domain.com',
        refereeCompletedAppointmentsCount: 0,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.isValid).toBe(true);
      expect(result.value.bonusAmount.amount).toBe(20.0);
      expect(result.value.welcomeDiscountPercent).toBe(0.1);
    });
  });

  describe('Wallet Aggregate - Referral Bonus & Adjustments', () => {
    it('should credit referral bonus and generate immutable transaction', () => {
      const wallet = Wallet.create('wal_test_1', 'usr_test_1');
      const creditResult = wallet.creditReferralBonus(
        'tx_ref_01',
        Money.from(20.0, 'USD'),
        'REF:usr_referee_99',
      );

      expect(creditResult.isSuccess).toBe(true);
      const updatedWallet = creditResult.value;
      expect(updatedWallet.balance.amount).toBe(20.0);
      expect(updatedWallet.version).toBe(2);
      expect(updatedWallet.transactions).toHaveLength(1);
      expect(updatedWallet.transactions[0].type).toBe(WalletTransactionType.ReferralBonus);
      expect(updatedWallet.transactions[0].balanceBefore.amount).toBe(0);
      expect(updatedWallet.transactions[0].balanceAfter.amount).toBe(20.0);
    });

    it('should apply positive and negative balance adjustments', () => {
      const wallet = Wallet.create('wal_test_2', 'usr_test_2');
      // 1. Acreditar saldo inicial
      const funded = wallet.creditCashback('tx_init', Money.from(50.0, 'USD'), 'APT-1').value;

      // 2. Ajuste positivo de auditoría
      const adjPos = funded.adjustBalance(
        'tx_adj_1',
        Money.from(10.0, 'USD'),
        true,
        'Compensación soporte técnico',
      );
      expect(adjPos.isSuccess).toBe(true);
      expect(adjPos.value.balance.amount).toBe(60.0);
      expect(adjPos.value.transactions[1].type).toBe(WalletTransactionType.Adjustment);

      // 3. Ajuste negativo
      const adjNeg = adjPos.value.adjustBalance(
        'tx_adj_2',
        Money.from(15.0, 'USD'),
        false,
        'Corrección cobro duplicado',
      );
      expect(adjNeg.isSuccess).toBe(true);
      expect(adjNeg.value.balance.amount).toBe(45.0);
    });

    it('should fail adjustment with zero or invalid amount', () => {
      const wallet = Wallet.create('wal_test_3', 'usr_test_3');
      const result = wallet.adjustBalance('tx_invalid', Money.zero('USD'), true, 'Test');
      expect(result.isFailure).toBe(true);
    });
  });
});
