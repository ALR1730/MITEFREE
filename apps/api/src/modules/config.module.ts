import { Module } from '@nestjs/common';
import { ConfigController } from '../presentation/controllers/config.controller.js';

@Module({
  controllers: [ConfigController],
  exports: [],
})
export class ConfigModule {}
