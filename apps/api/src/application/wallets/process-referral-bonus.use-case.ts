import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IWalletRepository,
  LoyaltyPolicyEngine,
  Wallet,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { ProcessReferralRewardDto, WalletResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ProcessReferralBonusUseCase implements IUseCase<
  ProcessReferralRewardDto,
  Result<WalletResponseDto, string>
> {
  private readonly logger = new Logger(ProcessReferralBonusUseCase.name);

  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(dto: ProcessReferralRewardDto): Promise<Result<WalletResponseDto, string>> {
    // 1. Validar anti-auto-referido
    const eligibility = LoyaltyPolicyEngine.validateReferralEligibility({
      referrerUserId: dto.referrerUserId,
      refereeUserId: dto.refereeUserId,
      refereeCompletedAppointmentsCount: 0,
    });

    if (eligibility.isFailure) {
      return fail(eligibility.error);
    }

    const { bonusAmount } = eligibility.value;

    // 2. Obtener o crear la billetera del patrocinador
    let referrerWallet = await this.walletRepo.findByUserId(dto.referrerUserId);
    if (!referrerWallet) {
      referrerWallet = Wallet.create(randomUUID(), dto.referrerUserId);
      await this.walletRepo.save(referrerWallet);
    }

    const txId = randomUUID();
    const sourceRef = `REFERRAL_BONUS:REFEREE:${dto.refereeUserId}:APT:${dto.appointmentId}`;

    // 3. Acreditar bono de referido en el dominio
    const creditResult = referrerWallet.creditReferralBonus(txId, bonusAmount, sourceRef);

    if (creditResult.isFailure) {
      return fail(creditResult.error);
    }

    const updatedWallet = creditResult.value;
    const lockSuccess = await this.walletRepo.updateWithOptimisticLock(
      updatedWallet,
      referrerWallet.version,
    );

    if (!lockSuccess) {
      return fail('Conflicto de concurrencia al acreditar bono de referido.');
    }

    this.logger.log(
      `Referral bonus of ${bonusAmount.format()} credited to referrer ${dto.referrerUserId} for referee ${dto.refereeUserId}`,
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
