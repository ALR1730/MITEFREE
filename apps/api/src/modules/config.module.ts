import { Module } from '@nestjs/common';
import { ConfigController } from '../presentation/controllers/config.controller.js';
import { ConfigService } from '../application/config/config.service.js';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
