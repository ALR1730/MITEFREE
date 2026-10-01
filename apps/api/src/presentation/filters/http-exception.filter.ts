import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { type ProblemDetails, createProblemDetails } from '@mitefree/shared-types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'An unexpected internal server error occurred.';
    let validationErrors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        detail = exceptionResponse;
        title = exception.name;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, unknown>;
        title = (respObj['error'] as string) || exception.name;
        detail = (respObj['message'] as string) || exception.message;

        if (respObj['errors'] && typeof respObj['errors'] === 'object') {
          validationErrors = respObj['errors'] as Record<string, string[]>;
        }
      }
    } else if (exception instanceof Error) {
      detail = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
    } else {
      this.logger.error('Unhandled unknown exception occurred');
    }

    const problemDetails: ProblemDetails = createProblemDetails({
      status,
      title,
      detail: Array.isArray(detail) ? detail.join(', ') : detail,
      instance: request.url,
      errors: validationErrors,
    });

    response.setHeader('Content-Type', 'application/problem+json');
    response.status(status).json(problemDetails);
  }
}
