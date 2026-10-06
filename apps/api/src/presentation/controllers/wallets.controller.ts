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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreditWalletRequestSchema,
  type CreditWalletRequestDto,
  RedeemWalletRequestSchema,
  type RedeemWalletRequestDto,
  type WalletResponseDto,
  ValidateReferralCodeSchema,
  type ValidateReferralCodeDto,
  type ReferralValidationResponseDto,
  ApplyWalletRedemptionSchema,
  type ApplyWalletRedemptionDto,
  type WalletRedemptionResponseDto,
  ProcessAppointmentCashbackSchema,
  type ProcessAppointmentCashbackDto,
  ProcessReferralRewardSchema,
  type ProcessReferralRewardDto,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { GetWalletUseCase } from '../../application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../../application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../../application/wallets/redeem-wallet.use-case.js';
import { ValidateReferralUseCase } from '../../application/wallets/validate-referral.use-case.js';
import { ApplyWalletRedemptionUseCase } from '../../application/wallets/apply-wallet-redemption.use-case.js';
import { ProcessCashbackUseCase } from '../../application/wallets/process-cashback.use-case.js';
import { ProcessReferralBonusUseCase } from '../../application/wallets/process-referral-bonus.use-case.js';

@ApiTags('Wallets & Loyalty (Billetera y Fidelización)')
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly redeemWalletUseCase: RedeemWalletUseCase,
    private readonly validateReferralUseCase: ValidateReferralUseCase,
    private readonly applyWalletRedemptionUseCase: ApplyWalletRedemptionUseCase,
    private readonly processCashbackUseCase: ProcessCashbackUseCase,
    private readonly processReferralBonusUseCase: ProcessReferralBonusUseCase,
  ) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener o inicializar saldo y transacciones de billetera por usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Saldo retornado con éxito.' })
  async getByUserId(@Param('userId') userId: string): Promise<WalletResponseDto> {
    const result = await this.getWalletUseCase.execute(userId);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Post('credit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acreditar cashback o saldo manual a la billetera' })
  @ApiResponse({ status: 200, description: 'Crédito aplicado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Monto inválido o usuario inexistente.' })
  @UsePipes(new ZodValidationPipe(CreditWalletRequestSchema))
  async credit(@Body() body: CreditWalletRequestDto): Promise<WalletResponseDto> {
    const result = await this.creditWalletUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redimir saldo de la billetera' })
  @ApiResponse({ status: 200, description: 'Saldo redimido exitosamente.' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente o error de concurrencia.' })
  @UsePipes(new ZodValidationPipe(RedeemWalletRequestSchema))
  async redeem(@Body() body: RedeemWalletRequestDto): Promise<WalletResponseDto> {
    const result = await this.redeemWalletUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('referrals/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar código de embajador con barreras anti-fraude' })
  @ApiResponse({ status: 200, description: 'Código evaluado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Código inválido o infracción anti-fraude.' })
  @UsePipes(new ZodValidationPipe(ValidateReferralCodeSchema))
  async validateReferral(
    @Body() body: ValidateReferralCodeDto,
  ): Promise<ReferralValidationResponseDto> {
    const result = await this.validateReferralUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('apply-redemption')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aplicar redención de saldo a una orden con tope de salvaguarda (50%)' })
  @ApiResponse({ status: 200, description: 'Redención aprobada y descontada del balance.' })
  @ApiResponse({ status: 400, description: 'Excede el tope o saldo insuficiente.' })
  @UsePipes(new ZodValidationPipe(ApplyWalletRedemptionSchema))
  async applyRedemption(
    @Body() body: ApplyWalletRedemptionDto,
  ): Promise<WalletRedemptionResponseDto> {
    const result = await this.applyWalletRedemptionUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('cashback/process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acreditar automáticamente 5% de cashback por servicio completado' })
  @ApiResponse({ status: 200, description: 'Cashback acreditado exitosamente.' })
  @UsePipes(new ZodValidationPipe(ProcessAppointmentCashbackSchema))
  async processCashback(
    @Body() body: ProcessAppointmentCashbackDto,
  ): Promise<WalletResponseDto> {
    const result = await this.processCashbackUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }

  @Post('referrals/reward')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liquidar bono de $20 USD para el patrocinador tras orden del referido' })
  @ApiResponse({ status: 200, description: 'Bono acreditado al patrocinador.' })
  @UsePipes(new ZodValidationPipe(ProcessReferralRewardSchema))
  async rewardReferral(
    @Body() body: ProcessReferralRewardDto,
  ): Promise<WalletResponseDto> {
    const result = await this.processReferralBonusUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
