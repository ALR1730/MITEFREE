import { z } from 'zod';

export const ValidateReferralCodeSchema = z.object({
  referralCode: z.string().min(3, 'Código de referido debe tener al menos 3 caracteres'),
  refereeUserId: z.string().uuid('ID de usuario referee inválido'),
  refereePhone: z.string().optional(),
  refereeEmail: z.string().email('Email inválido').optional(),
});

export type ValidateReferralCodeDto = z.infer<typeof ValidateReferralCodeSchema>;

export const ApplyWalletRedemptionSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  orderTotal: z.number().positive('El total de la orden debe ser positivo'),
  amountToRedeem: z.number().positive('El monto a redimir debe ser positivo'),
  appointmentId: z.string().uuid().optional(),
  currency: z.string().default('USD'),
});

export type ApplyWalletRedemptionDto = z.infer<typeof ApplyWalletRedemptionSchema>;

export const ProcessReferralRewardSchema = z.object({
  appointmentId: z.string().uuid('ID de cita inválido'),
  refereeUserId: z.string().uuid('ID del usuario referido inválido'),
  referrerUserId: z.string().uuid('ID del usuario patrocinador inválido'),
});

export type ProcessReferralRewardDto = z.infer<typeof ProcessReferralRewardSchema>;

export const ProcessAppointmentCashbackSchema = z.object({
  appointmentId: z.string().uuid('ID de cita inválido'),
  userId: z.string().uuid('ID de usuario inválido'),
  paidAmount: z.number().positive('El monto pagado debe ser positivo'),
  currency: z.string().default('USD'),
});

export type ProcessAppointmentCashbackDto = z.infer<typeof ProcessAppointmentCashbackSchema>;

export interface ReferralValidationResponseDto {
  isValid: boolean;
  referrerUserId: string;
  bonusAmount: number;
  welcomeDiscountPercent: number;
  message: string;
}

export interface WalletRedemptionResponseDto {
  success: boolean;
  amountRedeemed: number;
  maxRedeemableAllowed: number;
  remainingBalance: number;
  currency: string;
}

export interface WalletTransactionItemDto {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  sourceReference: string;
  createdAt: string;
}

export interface WalletSummaryResponseDto {
  id: string;
  userId: string;
  balance: number;
  balanceDop: number;
  currency: string;
  version: number;
  transactionsCount: number;
  recentTransactions: WalletTransactionItemDto[];
}
