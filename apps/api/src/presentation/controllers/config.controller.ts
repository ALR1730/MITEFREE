import { Controller, Get, Put, Body, UsePipes, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  DiscountPolicyConfigSchema,
  DEFAULT_DISCOUNT_POLICY,
  type DiscountPolicyConfig,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';

@ApiTags('Configuration (Tarifas, Zonas & Políticas de Descuento)')
@Controller('config')
export class ConfigController {
  private currentPolicy: DiscountPolicyConfig = JSON.parse(JSON.stringify(DEFAULT_DISCOUNT_POLICY));

  @Get('discounts')
  @ApiOperation({
    summary: 'Consultar configuración personalizada de descuentos por zona y horario',
  })
  @ApiResponse({
    status: 200,
    description: 'Políticas de descuento por zona y horario retornadas con éxito.',
  })
  getDiscountPolicy(): DiscountPolicyConfig {
    return this.currentPolicy;
  }

  @Put('discounts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar configuración personalizada de descuentos por zona y horario desde Admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Políticas de descuento actualizadas con éxito.',
  })
  @UsePipes(new ZodValidationPipe(DiscountPolicyConfigSchema))
  updateDiscountPolicy(@Body() body: DiscountPolicyConfig): DiscountPolicyConfig {
    this.currentPolicy = body;
    return this.currentPolicy;
  }
}
