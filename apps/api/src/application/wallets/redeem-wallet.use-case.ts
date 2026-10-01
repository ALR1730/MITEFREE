import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type IWalletRepository, Money, Result, ok, fail } from '@mitefree/domain-core';
import type { RedeemWalletRequestDto, WalletResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class RedeemWalletUseCase implements IUseCase<
  RedeemWalletRequestDto,
  Result<WalletResponseDto, string>
> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(dto: RedeemWalletRequestDto): Promise<Result<WalletResponseDto, string>> {
    const wallet = await this.walletRepo.findByUserId(dto.userId);

    if (!wallet) {
      return fail(`Wallet for user '${dto.userId}' does not exist.`);
    }

    const moneyResult = Money.create(dto.amount);
    if (moneyResult.isFailure) {
      return fail(moneyResult.error);
    }

    const txId = randomUUID();
    const redeemResult = wallet.redeem(txId, moneyResult.value, dto.sourceReference);
    if (redeemResult.isFailure) {
      return fail(redeemResult.error);
    }

    const updatedWallet = redeemResult.value;
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
