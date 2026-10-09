import {
  Controller,
  Get,
  Put,
  Body,
  UsePipes,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  DiscountPolicyConfigSchema,
  type DiscountPolicyConfig,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { JwtAuthGuard, RolesGuard, Roles } from '../guards/index.js';
import { ConfigService } from '../../application/config/config.service.js';

@ApiTags('Configuration (Tarifas, Zonas & Políticas de Descuento)')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('discounts')
  @ApiOperation({
    summary: 'Consultar configuración personalizada de descuentos por zona y horario',
  })
  @ApiResponse({
    status: 200,
    description: 'Políticas de descuento por zona y horario retornadas con éxito.',
  })
  getDiscountPolicy(): DiscountPolicyConfig {
    return this.configService.getDiscountPolicy();
  }

  @Put('discounts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-Auth')
  @ApiOperation({
    summary: 'Actualizar configuración personalizada de descuentos por zona y horario desde Admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Políticas de descuento actualizadas con éxito.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: solo administradores pueden modificar las políticas financieras.',
  })
  @UsePipes(new ZodValidationPipe(DiscountPolicyConfigSchema))
  updateDiscountPolicy(@Body() body: DiscountPolicyConfig): DiscountPolicyConfig {
    return this.configService.updateDiscountPolicy(body);
  }
}
