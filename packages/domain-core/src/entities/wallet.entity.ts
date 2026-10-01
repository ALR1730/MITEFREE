import { Money } from '../value-objects/money.vo.js';
import { WalletTransactionType } from '../enums/wallet-transaction-type.enum.js';
import { Result, ok, fail } from '../common/result.js';

export interface WalletTransactionProps {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: Money;
  balanceBefore: Money;
  balanceAfter: Money;
  sourceReference: string;
  createdAt: Date;
}

export class WalletTransaction {
  readonly id: string;
  readonly walletId: string;
  readonly type: WalletTransactionType;
  readonly amount: Money;
  readonly balanceBefore: Money;
  readonly balanceAfter: Money;
  readonly sourceReference: string;
  readonly createdAt: Date;

  constructor(props: WalletTransactionProps) {
    this.id = props.id;
    this.walletId = props.walletId;
    this.type = props.type;
    this.amount = props.amount;
    this.balanceBefore = props.balanceBefore;
    this.balanceAfter = props.balanceAfter;
    this.sourceReference = props.sourceReference;
    this.createdAt = props.createdAt;
    Object.freeze(this);
  }
}

export class Wallet {
  readonly id: string;
  readonly userId: string;
  readonly balance: Money;
  readonly version: number;
  readonly transactions: readonly WalletTransaction[];

  private constructor(params: {
    id: string;
    userId: string;
    balance: Money;
    version: number;
    transactions: WalletTransaction[];
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.balance = params.balance;
    this.version = params.version;
    this.transactions = Object.freeze([...params.transactions]);
    Object.freeze(this);
  }

  static create(id: string, userId: string): Wallet {
    return new Wallet({
      id,
      userId,
      balance: Money.zero(),
      version: 1,
      transactions: [],
    });
  }

  static reconstitute(params: {
    id: string;
    userId: string;
    balance: Money;
    version: number;
    transactions: WalletTransaction[];
  }): Wallet {
    return new Wallet(params);
  }

  creditCashback(
    transactionId: string,
    amount: Money,
    sourceReference: string,
    now: Date = new Date(),
  ): Result<Wallet, string> {
    if (amount.isZero()) {
      return fail('Credit amount must be greater than zero');
    }
    const newBalanceResult = this.balance.add(amount);
    if (newBalanceResult.isFailure) {
      return fail(newBalanceResult.error);
    }

    const tx = new WalletTransaction({
      id: transactionId,
      walletId: this.id,
      type: WalletTransactionType.Earned,
      amount,
      balanceBefore: this.balance,
      balanceAfter: newBalanceResult.value,
      sourceReference,
      createdAt: now,
    });

    return ok(
      new Wallet({
        id: this.id,
        userId: this.userId,
        balance: newBalanceResult.value,
        version: this.version + 1,
        transactions: [...this.transactions, tx],
      }),
    );
  }

  redeem(
    transactionId: string,
    amount: Money,
    sourceReference: string,
    now: Date = new Date(),
  ): Result<Wallet, string> {
    if (amount.isZero()) {
      return fail('Redeem amount must be greater than zero');
    }
    if (this.balance.isLessThan(amount)) {
      return fail(
        `Insufficient wallet balance: available ${this.balance.format()}, requested ${amount.format()}`,
      );
    }
    const newBalanceResult = this.balance.subtract(amount);
    if (newBalanceResult.isFailure) {
      return fail(newBalanceResult.error);
    }

    const tx = new WalletTransaction({
      id: transactionId,
      walletId: this.id,
      type: WalletTransactionType.Redeemed,
      amount,
      balanceBefore: this.balance,
      balanceAfter: newBalanceResult.value,
      sourceReference,
      createdAt: now,
    });

    return ok(
      new Wallet({
        id: this.id,
        userId: this.userId,
        balance: newBalanceResult.value,
        version: this.version + 1,
        transactions: [...this.transactions, tx],
      }),
    );
  }
}
