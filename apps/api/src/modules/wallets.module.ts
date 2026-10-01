import { Module } from '@nestjs/common';
import { WalletsController } from '../presentation/controllers/wallets.controller.js';
import { GetWalletUseCase } from '../application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../application/wallets/redeem-wallet.use-case.js';
import { DrizzleWalletRepository } from '../infrastructure/repositories/drizzle-wallet.repository.js';
import { WALLET_REPOSITORY } from '../infrastructure/database/database.tokens.js';

@Module({
  controllers: [WalletsController],
  providers: [
    GetWalletUseCase,
    CreditWalletUseCase,
    RedeemWalletUseCase,
    {
      provide: WALLET_REPOSITORY,
      useClass: DrizzleWalletRepository,
    },
  ],
  exports: [WALLET_REPOSITORY, GetWalletUseCase, CreditWalletUseCase, RedeemWalletUseCase],
})
export class WalletsModule {}
