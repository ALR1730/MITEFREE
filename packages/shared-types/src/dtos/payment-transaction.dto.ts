import { z } from 'zod';

export const PaymentTypeEnum = z.enum(['DEPOSIT', 'SETTLEMENT', 'FULL', 'REFUND']);

export const PaymentMethodEnum = z.enum([
  'STRIPE',
  'BANK_TRANSFER',
  'CASH',
  'WALLET',
]);

export const PaymentStatusEnum = z.enum([
  'PENDING',
  'UNDER_REVIEW',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
]);

export const CreatePaymentIntentRequestSchema = z.object({
  appointmentId: z.string().uuid('Appointment ID must be a valid UUID'),
  amount: z.number().positive('Payment amount must be positive'),
  currency: z.string().length(3).optional().default('USD'),
  idempotencyKey: z
    .string()
    .min(8, 'Idempotency key must be at least 8 characters for financial security'),
});

export const PaymentIntentResponseSchema = z.object({
  paymentId: z.string().uuid(),
  clientSecret: z.string(),
  amount: z.number(),
  currency: z.string(),
  idempotencyKey: z.string(),
  status: PaymentStatusEnum,
});

export const SubmitBankTransferProofSchema = z.object({
  appointmentId: z.string().uuid('Appointment ID must be a valid UUID'),
  amount: z.number().positive('Amount must be positive'),
  bankName: z.enum(['POPULAR', 'BHD', 'BANRESERVAS', 'OTHER']),
  referenceNumber: z.string().min(4, 'Bank reference number must be at least 4 characters'),
  proofPhotoUrl: z.string().url().optional(),
  idempotencyKey: z.string().min(8, 'Idempotency key must be at least 8 characters'),
});

export const ReviewPaymentSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT']),
  rejectionReason: z.string().optional(),
});

export const StripeWebhookPayloadSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
});

export const PaymentRecordResponseSchema = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  amount: z.number(),
  currency: z.string(),
  type: PaymentTypeEnum,
  method: PaymentMethodEnum,
  status: PaymentStatusEnum,
  externalReference: z.string().nullable().optional(),
  idempotencyKey: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreatePaymentIntentRequestDto = z.infer<
  typeof CreatePaymentIntentRequestSchema
>;
export type PaymentIntentResponseDto = z.infer<typeof PaymentIntentResponseSchema>;
export type SubmitBankTransferProofDto = z.infer<typeof SubmitBankTransferProofSchema>;
export type ReviewPaymentDto = z.infer<typeof ReviewPaymentSchema>;
export type StripeWebhookPayloadDto = z.infer<typeof StripeWebhookPayloadSchema>;
export type PaymentRecordResponseDto = z.infer<typeof PaymentRecordResponseSchema>;
