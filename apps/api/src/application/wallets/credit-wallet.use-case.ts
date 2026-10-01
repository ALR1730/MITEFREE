import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type IWalletRepository, Wallet, Money, Result, ok, fail } from '@mitefree/domain-core';
import type { CreditWalletRequestDto, WalletResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class CreditWalletUseCase implements IUseCase<
  CreditWalletRequestDto,
  Result<WalletResponseDto, string>
> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(dto: CreditWalletRequestDto): Promise<Result<WalletResponseDto, string>> {
    let wallet = await this.walletRepo.findByUserId(dto.userId);

    if (!wallet) {
      wallet = Wallet.create(randomUUID(), dto.userId);
      await this.walletRepo.save(wallet);
    }

    const moneyResult = Money.create(dto.amount);
    if (moneyResult.isFailure) {
      return fail(moneyResult.error);
    }

    const txId = randomUUID();
    const creditResult = wallet.creditCashback(txId, moneyResult.value, dto.sourceReference);
    if (creditResult.isFailure) {
      return fail(creditResult.error);
    }

    const updatedWallet = creditResult.value;
    const lockAcquired = await this.walletRepo.updateWithOptimisticLock(
      updatedWallet,
      wallet.version,
    );

    if (!lockAcquired) {
      return fail('Concurrent modification detected. Please retry the transaction.');
    }

    return ok({
      id: updatedWallet.id,
      userId: updatedWallet.userId,
      balance: updatedWallet.balance.amount,
      currency: updatedWallet.balance.currency,
      version: updatedWallet.version,
      updatedAt: new Date().toISOString(),
    });
  }
}
