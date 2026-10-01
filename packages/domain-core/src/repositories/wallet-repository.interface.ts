import { Wallet } from '../entities/wallet.entity.js';

export interface IWalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  findById(id: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
  updateWithOptimisticLock(wallet: Wallet, expectedVersion: number): Promise<boolean>;
}
