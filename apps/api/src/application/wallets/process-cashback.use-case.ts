import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IWalletRepository,
  LoyaltyPolicyEngine,
  Wallet,
  Money,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { ProcessAppointmentCashbackDto, WalletResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ProcessCashbackUseCase implements IUseCase<
  ProcessAppointmentCashbackDto,
  Result<WalletResponseDto, string>
> {
  private readonly logger = new Logger(ProcessCashbackUseCase.name);

  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(dto: ProcessAppointmentCashbackDto): Promise<Result<WalletResponseDto, string>> {
    let wallet = await this.walletRepo.findByUserId(dto.userId);
    if (!wallet) {
      wallet = Wallet.create(randomUUID(), dto.userId);
      await this.walletRepo.save(wallet);
    }

    const paidResult = Money.create(dto.paidAmount, dto.currency);
    if (paidResult.isFailure) return fail(paidResult.error);

    // Calcular cashback con el motor de reglas de dominio
    const cashbackAmount = LoyaltyPolicyEngine.calculateCashback(paidResult.value);
    if (cashbackAmount.amount <= 0) {
      return fail('No se generó monto de cashback para este pago.');
    }

    const txId = randomUUID();
    const sourceRef = `CASHBACK:APT:${dto.appointmentId}`;

    const creditResult = wallet.creditCashback(txId, cashbackAmount, sourceRef);
    if (creditResult.isFailure) {
      return fail(creditResult.error);
    }

    const updatedWallet = creditResult.value;
    const lockSuccess = await this.walletRepo.updateWithOptimisticLock(
      updatedWallet,
      wallet.version,
    );

    if (!lockSuccess) {
      return fail('Conflicto de concurrencia al acreditar cashback.');
    }

    this.logger.log(
      `Cashback credited: ${cashbackAmount.format()} to user ${dto.userId} (Appointment ${dto.appointmentId})`,
    );

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
