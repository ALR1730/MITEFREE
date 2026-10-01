import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type IWalletRepository, Wallet, Result, ok } from '@mitefree/domain-core';
import type { WalletResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class GetWalletUseCase implements IUseCase<string, Result<WalletResponseDto, string>> {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(userId: string): Promise<Result<WalletResponseDto, string>> {
    let wallet = await this.walletRepo.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(randomUUID(), userId);
      await this.walletRepo.save(wallet);
    }

    return ok({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance.amount,
      currency: wallet.balance.currency,
      version: wallet.version,
      transactions: wallet.transactions.map((tx) => ({
        id: tx.id,
        walletId: tx.walletId,
        type: tx.type,
        amount: tx.amount.amount,
        balanceBefore: tx.balanceBefore.amount,
        balanceAfter: tx.balanceAfter.amount,
        sourceReference: tx.sourceReference,
        createdAt: tx.createdAt.toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    });
  }
}
