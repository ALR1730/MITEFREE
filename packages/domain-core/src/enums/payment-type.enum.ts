export enum PaymentType {
  Deposit = 'DEPOSIT',
  Settlement = 'SETTLEMENT',
  Full = 'FULL',
  Refund = 'REFUND',
}

export enum PaymentMethod {
  Stripe = 'STRIPE',
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  Wallet = 'WALLET',
}

export enum PaymentStatus {
  Pending = 'PENDING',
  UnderReview = 'UNDER_REVIEW',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Refunded = 'REFUNDED',
}
