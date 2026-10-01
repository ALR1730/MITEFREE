import { describe, it, expect } from 'vitest';
import { Wallet } from '../src/entities/wallet.entity.js';
import { Money } from '../src/value-objects/money.vo.js';
import { WalletTransactionType } from '../src/enums/wallet-transaction-type.enum.js';

describe('Wallet Aggregate (Immutable Ledger)', () => {
  it('GivenNewWallet_WhenCreated_ThenInitialBalanceIsZero', () => {
    const wallet = Wallet.create('w-1', 'u-1');
    expect(wallet.balance.amount).toBe(0);
    expect(wallet.version).toBe(1);
    expect(wallet.transactions.length).toBe(0);
  });

  it('GivenWallet_WhenCashbackCredited_ThenBalanceIncreasesAndTransactionIsRecorded', () => {
    const wallet = Wallet.create('w-1', 'u-1');
    const cashback = Money.create(15).unwrap();

    const updatedRes = wallet.creditCashback('tx-1', cashback, 'appt-123');
    expect(updatedRes.isSuccess).toBe(true);

    if (updatedRes.isSuccess) {
      const w = updatedRes.value;
      expect(w.balance.amount).toBe(15);
      expect(w.version).toBe(2);
      expect(w.transactions.length).toBe(1);
      expect(w.transactions[0]?.type).toBe(WalletTransactionType.Earned);
      expect(w.transactions[0]?.balanceBefore.amount).toBe(0);
      expect(w.transactions[0]?.balanceAfter.amount).toBe(15);
    }
  });

  it('GivenWalletWithFunds_WhenRedeemingMoreThanBalance_ThenReturnsFailureAndDoesNotChange', () => {
    const wallet = Wallet.create('w-1', 'u-1');
    const cashback = Money.create(20).unwrap();
    const fundedWallet = wallet.creditCashback('tx-1', cashback, 'appt-123').unwrap();

    const excessiveRedeem = Money.create(50).unwrap();
    const redeemRes = fundedWallet.redeem('tx-2', excessiveRedeem, 'quote-999');

    expect(redeemRes.isFailure).toBe(true);
    expect(fundedWallet.balance.amount).toBe(20);
  });
});
