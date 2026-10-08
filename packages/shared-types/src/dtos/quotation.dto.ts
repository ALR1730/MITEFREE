import { z } from 'zod';

export const FabricTypeEnum = z.enum([
  'SYNTHETIC',
  'MICROFIBER',
  'LINEN',
  'VELVET',
  'LEATHER',
  'SILK',
]);
export type FabricType = z.infer<typeof FabricTypeEnum>;

export const StainSeverityEnum = z.enum(['LIGHT', 'MODERATE', 'CRITICAL']);
export type StainSeverity = z.infer<typeof StainSeverityEnum>;

export const CreateQuotationItemSchema = z.object({
  furnitureType: z.string().min(2, 'Furniture type must be at least 2 characters'),
  fabricType: FabricTypeEnum,
  stainSeverity: StainSeverityEnum,
  basePriceAmount: z.number().positive('Base price must be positive'),
  photoUrls: z.array(z.string().url('Invalid photo URL')).optional().default([]),
});

export const CreateQuotationRequestSchema = z.object({
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  items: z.array(CreateQuotationItemSchema).min(1, 'At least one item is required'),
  discountCode: z.string().optional(),
});

export type CreateQuotationItemDto = z.infer<typeof CreateQuotationItemSchema>;
export type CreateQuotationRequestDto = z.infer<typeof CreateQuotationRequestSchema>;

export interface QuotationResponseDto {
  id: string;
  clientId: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  depositRequired: number;
  currency: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}
