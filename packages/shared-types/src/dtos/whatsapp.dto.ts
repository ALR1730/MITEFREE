export type WhatsAppTemplateType =
  | 'QUOTATION_PROPOSAL'
  | 'BOOKING_CONFIRMATION'
  | 'CREW_DISPATCH'
  | 'REMINDER_24H'
  | 'PAYMENT_PROOF_SUBMISSION';

export interface WhatsAppDeepLinkDto {
  targetPhone: string;
  url: string;
  rawText: string;
}

export interface SendWhatsAppNotificationRequestDto {
  templateType: WhatsAppTemplateType;
  recipientPhone: string;
  payload: Record<string, unknown>;
}
