import { z } from 'zod';
import { FabricTypeEnum, StainSeverityEnum } from './quotation.dto.js';

export const PricePreviewItemSchema = z.object({
  furnitureType: z.string().min(2, 'Furniture type must be at least 2 characters'),
  fabricType: FabricTypeEnum,
  stainSeverity: StainSeverityEnum,
  basePriceAmount: z.number().positive('Base price must be positive'),
  photoUrls: z.array(z.string().url('Invalid photo URL')).optional().default([]),
  additionalServices: z
    .array(
      z.object({
        name: z.string().min(2),
        price: z.number().nonnegative(),
      }),
    )
    .optional()
    .default([]),
});

export const PricePreviewRequestSchema = z.object({
  items: z.array(PricePreviewItemSchema).min(1, 'At least one item is required'),
  routeDiscountAmount: z.number().nonnegative().optional().default(0),
  couponCode: z.string().optional(),
  couponDiscountAmount: z.number().nonnegative().optional().default(0),
  walletBalanceAvailable: z.number().nonnegative().optional().default(0),
  currency: z.string().length(3).optional().default('USD'),
});

export const ItemPriceBreakdownDtoSchema = z.object({
  furnitureType: z.string(),
  fabricType: FabricTypeEnum,
  fabricMultiplier: z.number(),
  priceAfterFabric: z.number(),
  stainSeverity: StainSeverityEnum,
  stainSurcharge: z.number(),
  additionalServicesTotal: z.number(),
  lineTotal: z.number(),
});

export const PricePreviewResponseSchema = z.object({
  itemsBreakdown: z.array(ItemPriceBreakdownDtoSchema),
  subtotal: z.number(),
  routeDiscount: z.number(),
  couponDiscount: z.number(),
  discountApplied: z.number(),
  subtotalAfterDiscount: z.number(),
  walletCreditApplied: z.number(),
  total: z.number(),
  depositRequired: z.number(),
  remainingBalance: z.number(),
  currency: z.string(),
  depositRate: z.number(),
});

export type PricePreviewItemDto = z.infer<typeof PricePreviewItemSchema>;
export type PricePreviewRequestDto = z.infer<typeof PricePreviewRequestSchema>;
export type ItemPriceBreakdownDto = z.infer<typeof ItemPriceBreakdownDtoSchema>;
export type PricePreviewResponseDto = z.infer<typeof PricePreviewResponseSchema>;
