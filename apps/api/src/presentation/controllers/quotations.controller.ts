import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateQuotationRequestSchema,
  type CreateQuotationRequestDto,
  type QuotationResponseDto,
} from '@mitefree/shared-types';
import type { IQuotationRepository } from '@mitefree/domain-core';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { CreateQuotationUseCase } from '../../application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../../application/quotations/get-quotation.use-case.js';
import { QUOTATION_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@ApiTags('Quotations (Cotizaciones)')
@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly createQuotationUseCase: CreateQuotationUseCase,
    private readonly getQuotationUseCase: GetQuotationUseCase,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new smart quotation with canonical pricing engine' })
  @ApiResponse({ status: 201, description: 'Quotation created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed or domain invariant broken.' })
  @UsePipes(new ZodValidationPipe(CreateQuotationRequestSchema))
  async createQuotation(@Body() body: CreateQuotationRequestDto): Promise<QuotationResponseDto> {
    const result = await this.createQuotationUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quotation by unique identifier' })
  @ApiParam({ name: 'id', description: 'UUID of quotation' })
  @ApiResponse({ status: 200, description: 'Quotation found.' })
  @ApiResponse({ status: 404, description: 'Quotation not found.' })
  async getById(@Param('id') id: string): Promise<QuotationResponseDto> {
    const result = await this.getQuotationUseCase.execute(id);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'List quotations by client UUID' })
  @ApiParam({ name: 'clientId', description: 'UUID of client' })
  async getByClientId(@Param('clientId') clientId: string): Promise<QuotationResponseDto[]> {
    const quotations = await this.quotationRepo.findByClientId(clientId);

    return quotations.map((q) => ({
      id: q.id,
      clientId: q.clientId,
      subtotal: q.subtotal.amount,
      discountAmount: q.discountAmount.amount,
      total: q.total.amount,
      depositRequired: q.depositRequired.amount,
      currency: q.total.currency,
      status: q.status,
      expiresAt: q.expiresAt.toISOString(),
      createdAt: q.createdAt.toISOString(),
    }));
  }
}
