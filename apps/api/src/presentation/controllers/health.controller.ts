import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health & Telemetry')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'System Health & Liveness Probe' })
  @ApiResponse({ status: 200, description: 'Service is completely healthy.' })
  check() {
    return {
      status: 'ok',
      service: 'MITEFREE Core API',
      version: '1.0.0',
      edition: 'Turing-Grade',
      organization: 'ALR COMPANY',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
