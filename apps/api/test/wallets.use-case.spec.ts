import { describe, it, expect, beforeEach } from 'vitest';
import { GetWalletUseCase } from '../src/application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../src/application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../src/application/wallets/redeem-wallet.use-case.js';
import { DrizzleWalletRepository } from '../src/infrastructure/repositories/drizzle-wallet.repository.js';

describe('Wallets & Cashback Use Cases (Unit Tests)', () => {
  let repository: DrizzleWalletRepository;
  let getWalletUseCase: GetWalletUseCase;
  let creditWalletUseCase: CreditWalletUseCase;
  let redeemWalletUseCase: RedeemWalletUseCase;

  const testUserId = '33333333-3333-3333-3333-333333333333';

  beforeEach(() => {
    repository = new DrizzleWalletRepository(null);
    getWalletUseCase = new GetWalletUseCase(repository);
    creditWalletUseCase = new CreditWalletUseCase(repository);
    redeemWalletUseCase = new RedeemWalletUseCase(repository);
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
      amount: 50.0, // Insufficient funds
      sourceReference: 'EXCESSIVE-REQUEST',
    });

    expect(redeemResult.isFailure).toBe(true);
    expect(redeemResult.error).toContain('Insufficient wallet balance');
  });
});
