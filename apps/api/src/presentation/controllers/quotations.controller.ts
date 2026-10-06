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
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateQuotationRequestSchema,
  PricePreviewRequestSchema,
  PhotoUploadIntentSchema,
  PhotoConfirmSchema,
  type CreateQuotationRequestDto,
  type QuotationResponseDto,
  type PricePreviewRequestDto,
  type PricePreviewResponseDto,
  type PhotoUploadIntentDto,
  type PhotoUploadIntentResponseDto,
  type PhotoConfirmDto,
  type PhotoConfirmResponseDto,
} from '@mitefree/shared-types';
import type { IQuotationRepository } from '@mitefree/domain-core';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { CreateQuotationUseCase } from '../../application/quotations/create-quotation.use-case.js';
import { GetQuotationUseCase } from '../../application/quotations/get-quotation.use-case.js';
import { CalculatePricePreviewUseCase } from '../../application/quotations/calculate-price-preview.use-case.js';
import { UploadPhotoIntentUseCase } from '../../application/quotations/upload-photo-intent.use-case.js';
import { ConfirmPhotoUseCase } from '../../application/quotations/confirm-photo.use-case.js';
import { QuotationPdfService } from '../../infrastructure/pdf/quotation-pdf.service.js';
import { QUOTATION_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@ApiTags('Quotations (Cotizaciones & Pricing Engine)')
@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly createQuotationUseCase: CreateQuotationUseCase,
    private readonly getQuotationUseCase: GetQuotationUseCase,
    private readonly calculatePricePreviewUseCase: CalculatePricePreviewUseCase,
    private readonly uploadPhotoIntentUseCase: UploadPhotoIntentUseCase,
    private readonly confirmPhotoUseCase: ConfirmPhotoUseCase,
    private readonly pdfService: QuotationPdfService,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate reactive real-time price preview using pure QuotationPricingEngine' })
  @ApiResponse({ status: 200, description: 'Price preview calculated with canonical math.' })
  @ApiResponse({ status: 400, description: 'Validation failed or domain invariant broken.' })
  @UsePipes(new ZodValidationPipe(PricePreviewRequestSchema))
  async calculatePreview(
    @Body() body: PricePreviewRequestDto,
  ): Promise<PricePreviewResponseDto> {
    const result = await this.calculatePricePreviewUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('photos/upload-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Cloudflare R2 Presigned PUT URL for evidence photos (TTL 15 min, $0 egress)' })
  @ApiResponse({ status: 200, description: 'Presigned upload URL generated.' })
  @ApiResponse({ status: 400, description: 'Invalid photo metadata.' })
  @UsePipes(new ZodValidationPipe(PhotoUploadIntentSchema))
  async requestPhotoUpload(
    @Body() body: PhotoUploadIntentDto,
  ): Promise<PhotoUploadIntentResponseDto> {
    const result = await this.uploadPhotoIntentUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('photos/confirm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Confirm photo upload and attach to quotation item' })
  @ApiResponse({ status: 201, description: 'Photo verified and linked.' })
  @ApiResponse({ status: 400, description: 'Failed to verify photo object.' })
  @UsePipes(new ZodValidationPipe(PhotoConfirmSchema))
  async confirmPhoto(
    @Body() body: PhotoConfirmDto,
  ): Promise<PhotoConfirmResponseDto> {
    const result = await this.confirmPhotoUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

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

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download frozen official quotation PDF document (7 days validity)' })
  @ApiParam({ name: 'id', description: 'UUID of quotation' })
  @ApiResponse({ status: 200, description: 'Official PDF stream binary' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const result = await this.getQuotationUseCase.execute(id);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    const pdfBuffer = await this.pdfService.generateQuotationPdf(result.value);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cotizacion-${id.substring(0, 8)}.pdf"`,
    );
    res.send(pdfBuffer);
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
