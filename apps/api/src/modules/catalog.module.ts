import { Module } from '@nestjs/common';
import { CatalogController } from '../presentation/controllers/catalog.controller.js';

@Module({
  controllers: [CatalogController],
  exports: [],
})
export class CatalogModule {}
