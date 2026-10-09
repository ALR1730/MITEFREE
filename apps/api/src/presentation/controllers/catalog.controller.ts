import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  DEFAULT_CATALOG_ITEMS,
  type CatalogItem,
  type CreateCatalogItemDto,
  type UpdateCatalogItemDto,
} from '@mitefree/shared-types';

@ApiTags('Catalog (Catálogo Dinámico de Artículos & Tarifas)')
@Controller('catalog')
export class CatalogController {
  // Estado en memoria inicializado con los ítems canónicos
  private items: CatalogItem[] = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));

  @Get()
  @ApiOperation({
    summary: 'Listar todos los artículos del catálogo de cotización',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de artículos del catálogo retornada con éxito.',
  })
  getAll(): CatalogItem[] {
    return this.items;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo artículo en el catálogo',
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo creado exitosamente.',
  })
  create(@Body() body: CreateCatalogItemDto): CatalogItem {
    const newItem: CatalogItem = {
      id: body.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: body.name,
      category: body.category,
      basePrice: Number(body.basePrice),
      bothSidesPrice: body.bothSidesPrice !== undefined ? Number(body.bothSidesPrice) : undefined,
      iconText: body.iconText || '🪑',
      image: body.image || '/cat-chair.jpg',
      subtitle: body.subtitle || `Tarifa estándar RD$ ${Number(body.basePrice).toLocaleString('es-DO')}`,
      dimensions: body.dimensions,
      isMattress: body.isMattress ?? (body.category === 'Colchones'),
      isSofaModular: body.isSofaModular,
      isChair: body.isChair ?? (body.category === 'Sillas de Comedor'),
      isRug: body.isRug ?? (body.category === 'Alfombras'),
      isCustomRug: body.isCustomRug,
    };

    this.items.push(newItem);
    return newItem;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar valores de un artículo existente (nombre, precio, descripción, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo actualizado exitosamente.',
  })
  update(
    @Param('id') id: string,
    @Body() body: UpdateCatalogItemDto,
  ): CatalogItem {
    const index = this.items.findIndex((it) => it.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado en el catálogo.`);
    }

    const current = this.items[index]!;
    const updated: CatalogItem = {
      ...current,
      ...body,
      basePrice: body.basePrice !== undefined ? Number(body.basePrice) : current.basePrice,
      bothSidesPrice:
        body.bothSidesPrice !== undefined ? Number(body.bothSidesPrice) : current.bothSidesPrice,
    };

    this.items[index] = updated;
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar totalmente un artículo del catálogo',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo eliminado exitosamente del catálogo.',
  })
  delete(@Param('id') id: string): { success: boolean; id: string } {
    const index = this.items.findIndex((it) => it.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado.`);
    }

    this.items.splice(index, 1);
    return { success: true, id };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restaurar el catálogo completo a los artículos y precios canónicos de fábrica',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo restaurado a valores canónicos.',
  })
  reset(): CatalogItem[] {
    this.items = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
    return this.items;
  }
}
