import { Module } from '@nestjs/common';
import { WalletsController } from '../presentation/controllers/wallets.controller.js';
import { GetWalletUseCase } from '../application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../application/wallets/redeem-wallet.use-case.js';
import { ValidateReferralUseCase } from '../application/wallets/validate-referral.use-case.js';
import { ApplyWalletRedemptionUseCase } from '../application/wallets/apply-wallet-redemption.use-case.js';
import { ProcessCashbackUseCase } from '../application/wallets/process-cashback.use-case.js';
import { ProcessReferralBonusUseCase } from '../application/wallets/process-referral-bonus.use-case.js';
import { DrizzleWalletRepository } from '../infrastructure/repositories/drizzle-wallet.repository.js';
import { WALLET_REPOSITORY } from '../infrastructure/database/database.tokens.js';

@Module({
  controllers: [WalletsController],
  providers: [
    GetWalletUseCase,
    CreditWalletUseCase,
    RedeemWalletUseCase,
    ValidateReferralUseCase,
    ApplyWalletRedemptionUseCase,
    ProcessCashbackUseCase,
    ProcessReferralBonusUseCase,
    {
      provide: WALLET_REPOSITORY,
      useClass: DrizzleWalletRepository,
    },
  ],
  exports: [
    WALLET_REPOSITORY,
    GetWalletUseCase,
    CreditWalletUseCase,
    RedeemWalletUseCase,
    ValidateReferralUseCase,
    ApplyWalletRedemptionUseCase,
    ProcessCashbackUseCase,
    ProcessReferralBonusUseCase,
  ],
})
export class WalletsModule {}
