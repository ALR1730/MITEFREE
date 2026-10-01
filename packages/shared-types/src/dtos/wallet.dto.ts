import { z } from 'zod';

export const CreditWalletRequestSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  amount: z.number().positive('Credit amount must be greater than zero'),
  sourceReference: z.string().min(3, 'Source reference must be at least 3 characters'),
});

export const RedeemWalletRequestSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  amount: z.number().positive('Redeem amount must be greater than zero'),
  sourceReference: z.string().min(3, 'Source reference must be at least 3 characters'),
});

export type CreditWalletRequestDto = z.infer<typeof CreditWalletRequestSchema>;
export type RedeemWalletRequestDto = z.infer<typeof RedeemWalletRequestSchema>;

export interface WalletTransactionDto {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  sourceReference: string;
  createdAt: string;
}

export interface WalletResponseDto {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  version: number;
  transactions?: WalletTransactionDto[];
  updatedAt: string;
}
