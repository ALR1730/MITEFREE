import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type JwtPayload } from '../../application/auth/auth.service.js';

export type AuthenticatedUser = JwtPayload;

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización requerido en cabecera Authorization Bearer.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const payload = this.authService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Token de sesión inválido, alterado o expirado.');
    }

    request.user = payload;
    return true;
  }
}
