import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { HealthModule } from './modules/health.module.js';
import { QuotationsModule } from './modules/quotations.module.js';
import { AppointmentsModule } from './modules/appointments.module.js';
import { WalletsModule } from './modules/wallets.module.js';
import { PaymentsModule } from './modules/payments.module.js';
import { ConfigModule } from './modules/config.module.js';
import { AuthModule } from './modules/auth.module.js';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    QuotationsModule,
    AppointmentsModule,
    WalletsModule,
    PaymentsModule,
    ConfigModule,
    AuthModule,
  ],
})
export class AppModule {}
