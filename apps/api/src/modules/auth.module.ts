import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module.js';
import { AuthService } from '../application/auth/auth.service.js';
import { AuthController } from '../presentation/controllers/auth.controller.js';
import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard.js';
import { RolesGuard } from '../presentation/guards/roles.guard.js';

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}

