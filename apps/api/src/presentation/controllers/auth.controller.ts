import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RegisterClientDtoSchema,
  type RegisterClientDto,
  LoginDtoSchema,
  type LoginDto,
  WhatsAppOtpLoginDtoSchema,
  type WhatsAppOtpLoginDto,
  type AuthResponseDto,
  type UserProfileDto,
  type ClientDirectoryItemDto,
} from '@mitefree/shared-types';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import { AuthService } from '../../application/auth/auth.service.js';

@ApiTags('Auth & Identity (Registro, Sesión y Clientes)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo cliente en la plataforma MITEFREE' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El correo o teléfono ya están registrados.' })
  @UsePipes(new ZodValidationPipe(RegisterClientDtoSchema))
  async register(@Body() dto: RegisterClientDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con Email/Teléfono y Contraseña' })
  @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UsePipes(new ZodValidationPipe(LoginDtoSchema))
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('whatsapp-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acceso rápido con número de WhatsApp y código OTP' })
  @ApiResponse({ status: 200, description: 'Acceso exitoso vía WhatsApp.' })
  @UsePipes(new ZodValidationPipe(WhatsAppOtpLoginDtoSchema))
  async loginWithWhatsAppOtp(@Body() dto: WhatsAppOtpLoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithWhatsAppOtp(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener datos del usuario/cliente actualmente autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado.' })
  async getMe(@Headers('authorization') authHeader?: string): Promise<UserProfileDto> {
    let userId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; // Default seed client Laura
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const rawToken = authHeader.replace('Bearer ', '');
        const decoded = JSON.parse(Buffer.from(rawToken, 'base64url').toString('utf-8'));
        if (decoded.sub) userId = decoded.sub;
      } catch {
        // Fallback default
      }
    }
    return this.authService.getProfile(userId);
  }

  @Get('clients')
  @ApiOperation({ summary: 'Directorio de clientes registrados para el portal de administración' })
  @ApiResponse({ status: 200, description: 'Listado de clientes retornado.' })
  async getClients(): Promise<ClientDirectoryItemDto[]> {
    return this.authService.getAllClients();
  }
}
