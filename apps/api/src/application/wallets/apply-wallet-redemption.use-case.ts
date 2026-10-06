import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IWalletRepository,
  LoyaltyPolicyEngine,
  Money,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type {
  ApplyWalletRedemptionDto,
  WalletRedemptionResponseDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ApplyWalletRedemptionUseCase
  implements
    IUseCase<ApplyWalletRedemptionDto, Result<WalletRedemptionResponseDto, string>>
{
  private readonly logger = new Logger(ApplyWalletRedemptionUseCase.name);

  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(
    dto: ApplyWalletRedemptionDto,
  ): Promise<Result<WalletRedemptionResponseDto, string>> {
    const wallet = await this.walletRepo.findByUserId(dto.userId);
    if (!wallet) {
      return fail('No se encontró una billetera asociada para este usuario.');
    }

    const orderTotalResult = Money.create(dto.orderTotal, dto.currency);
    if (orderTotalResult.isFailure) return fail(orderTotalResult.error);

    const amountToRedeemResult = Money.create(dto.amountToRedeem, dto.currency);
    if (amountToRedeemResult.isFailure) return fail(amountToRedeemResult.error);

    const orderTotal = orderTotalResult.value;
    const amountToRedeem = amountToRedeemResult.value;

    // 1. Validar límite máximo de salvaguarda financiera (50% de la orden)
    const maxRedeemable = LoyaltyPolicyEngine.calculateMaxRedeemable(orderTotal);
    if (amountToRedeem.isGreaterThan(maxRedeemable)) {
      return fail(
        `Política de salvaguarda: El monto máximo redimible es ${maxRedeemable.format()} (50% del total de la orden).`,
      );
    }

    // 2. Ejecutar redención inmutable en el agregado Wallet
    const txId = randomUUID();
    const sourceRef = dto.appointmentId ? `APT:${dto.appointmentId}` : 'CHECKOUT_PREVIEW';

    const redeemResult = wallet.redeem(txId, amountToRedeem, sourceRef);
    if (redeemResult.isFailure) {
      return fail(redeemResult.error);
    }

    const updatedWallet = redeemResult.value;
    const lockSuccess = await this.walletRepo.updateWithOptimisticLock(
      updatedWallet,
      wallet.version,
    );

    if (!lockSuccess) {
      return fail('Conflicto de concurrencia al actualizar saldo de billetera. Reintente.');
    }

    this.logger.log(
      `Wallet ${wallet.id} redeemed ${amountToRedeem.format()} for order total ${orderTotal.format()}`,
    );

    return ok({
      success: true,
      amountRedeemed: amountToRedeem.amount,
      maxRedeemableAllowed: maxRedeemable.amount,
      remainingBalance: updatedWallet.balance.amount,
      currency: dto.currency,
    });
  }
}
