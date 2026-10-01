import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string[]> = {};

        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'body';
          if (!errorMap[path]) {
            errorMap[path] = [];
          }
          errorMap[path].push(issue.message);
        }

        throw new BadRequestException({
          message: 'The submitted request payload failed schema validation.',
          error: 'Validation Error',
          errors: errorMap,
        });
      }

      throw new BadRequestException('Request payload is invalid.');
    }
  }
}
