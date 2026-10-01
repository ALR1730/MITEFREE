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
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { GetWalletUseCase } from '../../application/wallets/get-wallet.use-case.js';
import { CreditWalletUseCase } from '../../application/wallets/credit-wallet.use-case.js';
import { RedeemWalletUseCase } from '../../application/wallets/redeem-wallet.use-case.js';

@ApiTags('Wallets (Billetera y Fidelización)')
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
    private readonly redeemWalletUseCase: RedeemWalletUseCase,
  ) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get or initialize wallet balance and transactions for user' })
  @ApiParam({ name: 'userId', description: 'UUID of user' })
  @ApiResponse({ status: 200, description: 'Wallet balance returned.' })
  async getByUserId(@Param('userId') userId: string): Promise<WalletResponseDto> {
    const result = await this.getWalletUseCase.execute(userId);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Post('credit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Credit cashback or reward to wallet' })
  @ApiResponse({ status: 200, description: 'Cashback successfully credited.' })
  @ApiResponse({ status: 400, description: 'Invalid amount or user.' })
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
  @ApiOperation({ summary: 'Redeem balance from wallet towards order/service' })
  @ApiResponse({ status: 200, description: 'Balance redeemed successfully.' })
  @ApiResponse({ status: 400, description: 'Insufficient funds or concurrency error.' })
  @UsePipes(new ZodValidationPipe(RedeemWalletRequestSchema))
  async redeem(@Body() body: RedeemWalletRequestDto): Promise<WalletResponseDto> {
    const result = await this.redeemWalletUseCase.execute(body);

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.value;
  }
}
