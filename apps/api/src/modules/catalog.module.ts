import { Module } from '@nestjs/common';
import { CatalogController } from '../presentation/controllers/catalog.controller.js';
import { CatalogService } from '../application/catalog/catalog.service.js';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
