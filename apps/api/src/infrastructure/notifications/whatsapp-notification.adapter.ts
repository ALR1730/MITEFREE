import { Injectable, Logger } from '@nestjs/common';
import {
  WhatsAppMessageEngine,
  type QuotationWhatsAppPayload,
  type BookingConfirmationWhatsAppPayload,
  type CrewDispatchWhatsAppPayload,
  type Reminder24hWhatsAppPayload,
  type PaymentProofWhatsAppPayload,
  type WhatsAppDeepLinkResult,
} from '@mitefree/domain-core';

@Injectable()
export class WhatsAppNotificationAdapter {
  private readonly logger = new Logger(WhatsAppNotificationAdapter.name);
  private readonly engine = new WhatsAppMessageEngine();

  public getEngine(): WhatsAppMessageEngine {
    return this.engine;
  }

  public generateQuotationDeepLink(
    payload: QuotationWhatsAppPayload,
    targetPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawText = this.engine.buildQuotationProposal(payload);
    const linkRes = this.engine.generateDeepLink(targetPhone, rawText);

    if (linkRes.isFailure) {
      this.logger.warn(`Falla al generar deep link para ${targetPhone}: ${linkRes.error}`);
      return {
        targetPhone,
        url: `https://wa.me/${targetPhone}?text=${encodeURIComponent(rawText)}`,
        rawText,
      };
    }

    return linkRes.value;
  }

  public generateBookingConfirmationDeepLink(
    payload: BookingConfirmationWhatsAppPayload,
    clientPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawText = this.engine.buildBookingConfirmation(payload);
    const linkRes = this.engine.generateDeepLink(clientPhone, rawText);

    if (linkRes.isFailure) {
      this.logger.warn(`Falla al generar deep link para ${clientPhone}: ${linkRes.error}`);
      return {
        targetPhone: clientPhone,
        url: `https://wa.me/${clientPhone}?text=${encodeURIComponent(rawText)}`,
        rawText,
      };
    }

    return linkRes.value;
  }

  public generateCrewDispatchDeepLink(
    payload: CrewDispatchWhatsAppPayload,
    crewLeaderPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawText = this.engine.buildCrewDispatch(payload);
    const linkRes = this.engine.generateDeepLink(crewLeaderPhone, rawText);

    if (linkRes.isFailure) {
      this.logger.warn(`Falla al generar deep link para cuadrilla ${crewLeaderPhone}: ${linkRes.error}`);
      return {
        targetPhone: crewLeaderPhone,
        url: `https://wa.me/${crewLeaderPhone}?text=${encodeURIComponent(rawText)}`,
        rawText,
      };
    }

    return linkRes.value;
  }

  public generateReminder24hDeepLink(
    payload: Reminder24hWhatsAppPayload,
    clientPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawText = this.engine.buildReminder24h(payload);
    const linkRes = this.engine.generateDeepLink(clientPhone, rawText);

    if (linkRes.isFailure) {
      this.logger.warn(`Falla al generar deep link de recordatorio para ${clientPhone}: ${linkRes.error}`);
      return {
        targetPhone: clientPhone,
        url: `https://wa.me/${clientPhone}?text=${encodeURIComponent(rawText)}`,
        rawText,
      };
    }

    return linkRes.value;
  }

  public generatePaymentProofDeepLink(
    payload: PaymentProofWhatsAppPayload,
    deskPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawText = this.engine.buildPaymentProofSubmission(payload);
    const linkRes = this.engine.generateDeepLink(deskPhone, rawText);

    if (linkRes.isFailure) {
      this.logger.warn(`Falla al generar deep link de comprobante para ${deskPhone}: ${linkRes.error}`);
      return {
        targetPhone: deskPhone,
        url: `https://wa.me/${deskPhone}?text=${encodeURIComponent(rawText)}`,
        rawText,
      };
    }

    return linkRes.value;
  }
}
