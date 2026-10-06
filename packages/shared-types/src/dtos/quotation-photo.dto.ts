import { z } from 'zod';

export const PhotoUploadIntentSchema = z.object({
  quotationId: z.string().uuid('Quotation ID must be a valid UUID'),
  quotationItemId: z.string().uuid('Quotation Item ID must be a valid UUID').optional(),
  filename: z.string().min(3, 'Filename must be at least 3 characters'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'Only image/jpeg, image/png, and image/webp are supported' }),
  }),
  sizeBytes: z
    .number()
    .positive()
    .max(5 * 1024 * 1024, 'Maximum file size allowed is 5MB'),
});

export const PhotoUploadIntentResponseSchema = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  storageKey: z.string(),
  expiresInSeconds: z.number().int().positive(),
});

export const PhotoConfirmSchema = z.object({
  quotationItemId: z.string().uuid('Quotation Item ID must be a valid UUID'),
  storageKey: z.string().min(5, 'Storage key must be valid'),
  publicUrl: z.string().url('Public URL must be a valid URL'),
});

export const PhotoConfirmResponseSchema = z.object({
  photoId: z.string().uuid(),
  quotationItemId: z.string().uuid(),
  publicUrl: z.string().url(),
  createdAt: z.string(),
});

export type PhotoUploadIntentDto = z.infer<typeof PhotoUploadIntentSchema>;
export type PhotoUploadIntentResponseDto = z.infer<typeof PhotoUploadIntentResponseSchema>;
export type PhotoConfirmDto = z.infer<typeof PhotoConfirmSchema>;
export type PhotoConfirmResponseDto = z.infer<typeof PhotoConfirmResponseSchema>;
