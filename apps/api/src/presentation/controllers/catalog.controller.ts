import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  type CatalogItem,
  type CreateCatalogItemDto,
  type UpdateCatalogItemDto,
} from '@mitefree/shared-types';
import { JwtAuthGuard, RolesGuard, Roles } from '../guards/index.js';
import { CatalogService } from '../../application/catalog/catalog.service.js';

@ApiTags('Catalog (Catálogo Dinámico de Artículos & Tarifas)')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los artículos del catálogo de cotización',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de artículos del catálogo retornada con éxito.',
  })
  getAll(): CatalogItem[] {
    return this.catalogService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Crear un nuevo artículo en el catálogo',
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo creado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: solo administradores pueden agregar artículos al catálogo.',
  })
  create(@Body() body: CreateCatalogItemDto): CatalogItem {
    return this.catalogService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Actualizar valores de un artículo existente (nombre, precio, descripción, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo actualizado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: solo administradores pueden modificar artículos.',
  })
  update(@Param('id') id: string, @Body() body: UpdateCatalogItemDto): CatalogItem {
    return this.catalogService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Eliminar totalmente un artículo del catálogo',
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo eliminado exitosamente del catálogo.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: solo administradores pueden eliminar artículos.',
  })
  delete(@Param('id') id: string): { success: boolean; id: string } {
    return this.catalogService.delete(id);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Restaurar el catálogo completo a los artículos y precios canónicos de fábrica',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo restaurado a valores canónicos.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: solo administradores pueden restaurar el catálogo.',
  })
  reset(): CatalogItem[] {
    return this.catalogService.reset();
  }
}
