import { describe, it, expect, beforeEach } from 'vitest';
import { GetWalletUseCase } from '../src/application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../src/application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../src/application/wallets/redeem-wallet.use-case.js';
import { ValidateReferralUseCase } from '../src/application/wallets/validate-referral.use-case.js';
import { ApplyWalletRedemptionUseCase } from '../src/application/wallets/apply-wallet-redemption.use-case.js';
import { ProcessCashbackUseCase } from '../src/application/wallets/process-cashback.use-case.js';
import { ProcessReferralBonusUseCase } from '../src/application/wallets/process-referral-bonus.use-case.js';
import { DrizzleWalletRepository } from '../src/infrastructure/repositories/drizzle-wallet.repository.js';

describe('Wallets & Loyalty System — Comprehensive Specs (Turing-Grade)', () => {
  let repository: DrizzleWalletRepository;
  let getWalletUseCase: GetWalletUseCase;
  let creditWalletUseCase: CreditWalletUseCase;
  let redeemWalletUseCase: RedeemWalletUseCase;
  let validateReferralUseCase: ValidateReferralUseCase;
  let applyWalletRedemptionUseCase: ApplyWalletRedemptionUseCase;
  let processCashbackUseCase: ProcessCashbackUseCase;
  let processReferralBonusUseCase: ProcessReferralBonusUseCase;

  const testUserId = '33333333-3333-3333-3333-333333333333';
  const referrerUserId = '11111111-2222-3333-4444-555555555555';
  const refereeUserId = '22222222-3333-4444-5555-666666666666';
  const appointmentId = '77777777-7777-7777-7777-777777777777';

  beforeEach(() => {
    repository = new DrizzleWalletRepository(null);
    getWalletUseCase = new GetWalletUseCase(repository);
    creditWalletUseCase = new CreditWalletUseCase(repository);
    redeemWalletUseCase = new RedeemWalletUseCase(repository);
    validateReferralUseCase = new ValidateReferralUseCase(repository);
    applyWalletRedemptionUseCase = new ApplyWalletRedemptionUseCase(repository);
    processCashbackUseCase = new ProcessCashbackUseCase(repository);
    processReferralBonusUseCase = new ProcessReferralBonusUseCase(repository);
  });

  it('GivenNewUser_WhenQueryingWallet_ThenInitializesWithZeroBalance', async () => {
    const result = await getWalletUseCase.execute(testUserId);
    expect(result.isSuccess).toBe(true);
    expect(result.value.userId).toBe(testUserId);
    expect(result.value.balance).toBe(0.0);
    expect(result.value.version).toBe(1);
  });

  it('GivenWallet_WhenCreditingCashback_ThenIncreasesBalanceAndVersion', async () => {
    const creditResult = await creditWalletUseCase.execute({
      userId: testUserId,
      amount: 25.5,
      sourceReference: 'ORDER-1001-CASHBACK-5PCT',
    });

    expect(creditResult.isSuccess).toBe(true);
    expect(creditResult.value.balance).toBe(25.5);
    expect(creditResult.value.version).toBe(2);

    const wallet = await getWalletUseCase.execute(testUserId);
    expect(wallet.value.balance).toBe(25.5);
  });

  it('GivenWalletWithBalance_WhenRedeemingAllowedAmount_ThenDeductsSuccessfully', async () => {
    await creditWalletUseCase.execute({
      userId: testUserId,
      amount: 50.0,
      sourceReference: 'DEPOSIT',
    });

    const redeemResult = await redeemWalletUseCase.execute({
      userId: testUserId,
      amount: 20.0,
      sourceReference: 'APPOINTMENT-DISCOUNT',
    });

    expect(redeemResult.isSuccess).toBe(true);
    expect(redeemResult.value.balance).toBe(30.0);
  });

  it('GivenWalletWithBalance_WhenRedeemingMoreThanAvailable_ThenFailsWithDomainInvariant', async () => {
    await creditWalletUseCase.execute({
      userId: testUserId,
      amount: 10.0,
      sourceReference: 'DEPOSIT',
    });

    const redeemResult = await redeemWalletUseCase.execute({
      userId: testUserId,
      amount: 50.0,
      sourceReference: 'EXCESSIVE-REQUEST',
    });

    expect(redeemResult.isFailure).toBe(true);
    expect(redeemResult.error).toContain('Insufficient wallet balance');
  });

  it('GivenReferralCode_WhenValidatingValidAmbassador_ThenReturnsDiscountAndBonus', async () => {
    const result = await validateReferralUseCase.execute({
      referralCode: 'MITE-ANGEL-2026',
      refereeUserId,
      refereePhone: '8095551234',
      refereeEmail: 'carlos@cliente.com',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.isValid).toBe(true);
    expect(result.value.welcomeDiscountPercent).toBe(0.1);
    expect(result.value.bonusAmount).toBe(20.0);
  });

  it('GivenReferralCode_WhenFraudulentSelfReferral_ThenFailsWithAntiFraudViolation', async () => {
    const result = await validateReferralUseCase.execute({
      referralCode: 'MITE-ANGEL-2026',
      refereeUserId: referrerUserId, // Same as referrer
      refereePhone: '8095550000',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('A user cannot refer themselves');
  });

  it('GivenCompletedAppointment_WhenProcessingCashback_ThenAutomaticallyCredits5Percent', async () => {
    const result = await processCashbackUseCase.execute({
      appointmentId,
      userId: testUserId,
      paidAmount: 200.0,
      currency: 'USD',
    });

    expect(result.isSuccess).toBe(true);
    // 200 * 0.05 = 10 USD
    expect(result.value.balance).toBe(10.0);
  });

  it('GivenOrderTotalAndWalletBalance_WhenRedeemingBeyond50PercentCap_ThenFailsWithSafeguardPolicy', async () => {
    // Acreditar 100 USD al usuario
    await creditWalletUseCase.execute({
      userId: testUserId,
      amount: 100.0,
      sourceReference: 'REWARD_BONUS',
    });

    // Orden total = 100 USD -> max 50% = 50 USD. Intenta redimir 60 USD
    const result = await applyWalletRedemptionUseCase.execute({
      userId: testUserId,
      orderTotal: 100.0,
      amountToRedeem: 60.0,
      currency: 'USD',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('50% del total de la orden');
  });

  it('GivenOrderTotalAndWalletBalance_WhenRedeemingWithin50PercentCap_ThenApprovesAndDeducts', async () => {
    await creditWalletUseCase.execute({
      userId: testUserId,
      amount: 80.0,
      sourceReference: 'REWARD_BONUS',
    });

    // Orden total = 100 USD -> max 50 USD. Redime 40 USD
    const result = await applyWalletRedemptionUseCase.execute({
      userId: testUserId,
      orderTotal: 100.0,
      amountToRedeem: 40.0,
      currency: 'USD',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.amountRedeemed).toBe(40.0);
    expect(result.value.maxRedeemableAllowed).toBe(50.0);
    expect(result.value.remainingBalance).toBe(40.0);
  });

  it('GivenCompletedReferralOrder_WhenProcessingReferralBonus_ThenCredits20UsdToReferrer', async () => {
    const result = await processReferralBonusUseCase.execute({
      appointmentId,
      referrerUserId,
      refereeUserId,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.balance).toBe(20.0);
  });
});
