import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  type IWalletRepository,
  LoyaltyPolicyEngine,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type {
  ValidateReferralCodeDto,
  ReferralValidationResponseDto,
} from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { WALLET_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ValidateReferralUseCase
  implements IUseCase<ValidateReferralCodeDto, Result<ReferralValidationResponseDto, string>>
{
  private readonly logger = new Logger(ValidateReferralUseCase.name);

  // Mapeo o resolución de embajadores fundadores / usuarios
  private readonly codeToUserMap = new Map<string, string>([
    ['MITE-ANGEL-2026', '11111111-2222-3333-4444-555555555555'],
    ['MITE-VIP-ALR', '22222222-3333-4444-5555-666666666666'],
    ['MITE-EMBAJADOR-01', '33333333-4444-5555-6666-777777777777'],
  ]);

  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(
    dto: ValidateReferralCodeDto,
  ): Promise<Result<ReferralValidationResponseDto, string>> {
    const normalizedCode = dto.referralCode.trim().toUpperCase();

    // 1. Resolver el usuario patrocinador
    const referrerUserId =
      this.codeToUserMap.get(normalizedCode) || '99999999-9999-9999-9999-999999999999';

    if (!normalizedCode.startsWith('MITE-')) {
      return fail(`El código "${dto.referralCode}" no es un código de embajador válido de MITEFREE.`);
    }

    // 2. Consultar historial del referee para verificar si es cliente recurrente
    const refereeWallet = await this.walletRepo.findByUserId(dto.refereeUserId);
    const refereeCompletedCount = refereeWallet ? refereeWallet.transactions.length : 0;

    // 3. Ejecutar motor de reglas de fidelización y anti-fraude del dominio
    const eligibilityResult = LoyaltyPolicyEngine.validateReferralEligibility({
      referrerUserId,
      refereeUserId: dto.refereeUserId,
      refereePhone: dto.refereePhone,
      refereeEmail: dto.refereeEmail,
      refereeCompletedAppointmentsCount: refereeCompletedCount,
    });

    if (eligibilityResult.isFailure) {
      this.logger.warn(
        `Referral code ${normalizedCode} rejected by anti-fraud: ${eligibilityResult.error}`,
      );
      return fail(eligibilityResult.error);
    }

    const { bonusAmount, welcomeDiscountPercent } = eligibilityResult.value;

    return ok({
      isValid: true,
      referrerUserId,
      bonusAmount: bonusAmount.amount,
      welcomeDiscountPercent,
      message: `¡Código válido! Tienes un 10% de descuento en tu primera cita y tu patrocinador recibirá $20 USD.`,
    });
  }
}
