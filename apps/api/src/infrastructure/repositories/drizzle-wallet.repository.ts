import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  type IWalletRepository,
  Wallet,
  WalletTransaction,
  WalletTransactionType,
  Money,
} from '@mitefree/domain-core';
import { type DatabaseClient, wallets, walletTransactions } from '@mitefree/database';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE_DB } from '../database/database.tokens.js';

@Injectable()
export class DrizzleWalletRepository implements IWalletRepository {
  private readonly logger = new Logger(DrizzleWalletRepository.name);
  private readonly memoryStore = new Map<string, Wallet>();

  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DatabaseClient | null,
  ) {}

  async findById(id: string): Promise<Wallet | null> {
    if (!this.db) {
      return this.memoryStore.get(id) ?? null;
    }

    try {
      const rows = await this.db.select().from(wallets).where(eq(wallets.id, id)).limit(1);
      const row = rows[0];
      if (!row) return null;

      const txRows = await this.db
        .select()
        .from(walletTransactions)
        .where(eq(walletTransactions.walletId, id));

      const txs = txRows.map(
        (tx) =>
          new WalletTransaction({
            id: tx.id,
            walletId: tx.walletId,
            type: tx.type as WalletTransactionType,
            amount: Money.create(Number(tx.amount)).unwrap(),
            balanceBefore: Money.create(Number(tx.balanceBefore)).unwrap(),
            balanceAfter: Money.create(Number(tx.balanceAfter)).unwrap(),
            sourceReference: tx.sourceReference,
            createdAt: tx.createdAt,
          }),
      );

      return Wallet.reconstitute({
        id: row.id,
        userId: row.userId,
        balance: Money.create(Number(row.balance)).unwrap(),
        version: row.version,
        transactions: txs,
      });
    } catch (error) {
      this.logger.error(`Error finding wallet by id ${id}, falling back to memory`, error);
      return this.memoryStore.get(id) ?? null;
    }
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    if (!this.db) {
      return Array.from(this.memoryStore.values()).find((w) => w.userId === userId) ?? null;
    }

    try {
      const rows = await this.db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);

      const row = rows[0];
      if (!row) return null;

      return this.findById(row.id);
    } catch (error) {
      this.logger.error(`Error finding wallet for user ${userId}, falling back to memory`, error);
      return Array.from(this.memoryStore.values()).find((w) => w.userId === userId) ?? null;
    }
  }

  async save(wallet: Wallet): Promise<void> {
    this.memoryStore.set(wallet.id, wallet);

    if (!this.db) return;

    try {
      await this.db.insert(wallets).values({
        id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance.amount.toString(),
        version: wallet.version,
        updatedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`Error saving wallet ${wallet.id} to Drizzle`, error);
    }
  }

  async updateWithOptimisticLock(wallet: Wallet, expectedVersion: number): Promise<boolean> {
    const existing = this.memoryStore.get(wallet.id);
    if (existing && existing.version !== expectedVersion) {
      return false;
    }
    this.memoryStore.set(wallet.id, wallet);

    if (!this.db) return true;

    try {
      await this.db
        .update(wallets)
        .set({
          balance: wallet.balance.amount.toString(),
          version: wallet.version,
          updatedAt: new Date(),
        })
        .where(and(eq(wallets.id, wallet.id), eq(wallets.version, expectedVersion)));

      // Save any newly added transaction
      const lastTx = wallet.transactions[wallet.transactions.length - 1];
      if (lastTx) {
        await this.db.insert(walletTransactions).values({
          id: lastTx.id,
          walletId: lastTx.walletId,
          type: lastTx.type,
          amount: lastTx.amount.amount.toString(),
          balanceBefore: lastTx.balanceBefore.amount.toString(),
          balanceAfter: lastTx.balanceAfter.amount.toString(),
          sourceReference: lastTx.sourceReference,
          createdAt: lastTx.createdAt,
        });
      }

      return true;
    } catch (error) {
      this.logger.error(`Optimistic lock failure or error updating wallet ${wallet.id}`, error);
      return false;
    }
  }
}
