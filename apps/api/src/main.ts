import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { config } from 'dotenv';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter.js';

config();

async function bootstrap() {
  const logger = new Logger('MitefreeBootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // Global Exception Filter for RFC 7807 ProblemDetails
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global prefix for all API endpoints except health checks
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MITEFREE Core WebAPI')
    .setDescription(
      'Enterprise platform for smart quotes, technician scheduling, and cashback loyalty — ALR COMPANY',
    )
    .setVersion('1.0.0')
    .setContact('Angel Luis Rosario', 'https://github.com/ALR1730', 'angelluisrosario12345@gmail.com')
    .addTag('Health & Telemetry', 'Health probes and status checks')
    .addTag('Quotations (Cotizaciones)', 'Quotation creation and canonical pricing engine')
    .addTag('Appointments (Citas y Rutas)', 'Technician booking and dispatch slots')
    .addTag('Wallets (Billetera y Fidelización)', 'Cashback balance and ledger transactions')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Mount Scalar Modern API Reference on /api/docs
  app.use(
    '/api/docs',
    apiReference({
      theme: 'kepler',
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 MITEFREE Core WebAPI running on: http://localhost:${port}`);
  logger.log(`📚 Modern Scalar OpenAPI Documentation available at: http://localhost:${port}/api/docs`);
  logger.log(`🩺 Health Probe endpoint: http://localhost:${port}/health`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrapping error in MITEFREE Core WebAPI:', err);
  process.exit(1);
});
