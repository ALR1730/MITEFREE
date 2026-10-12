import {
  WhatsAppMessageEngine,
  type QuotationWhatsAppPayload,
  type BookingConfirmationWhatsAppPayload,
  type PaymentProofWhatsAppPayload,
  type WhatsAppDeepLinkResult,
} from '@mitefree/domain-core';

export const OFFICIAL_MITEFREE_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '18095134773';

const engine = new WhatsAppMessageEngine();

export class WhatsAppClientAdapter {
  /**
   * Genera el deep link para enviar la cotización actual al asesor de MITEFREE.
   */
  public static createQuotationLink(
    payload: QuotationWhatsAppPayload,
    businessPhone = OFFICIAL_MITEFREE_WHATSAPP_PHONE,
  ): WhatsAppDeepLinkResult {
    const rawMessage = engine.buildQuotationProposal(payload);
    const linkResult = engine.generateDeepLink(businessPhone, rawMessage);

    if (linkResult.isFailure) {
      // Fallback seguro en caso de teléfono malformado
      return {
        url: `https://wa.me/${businessPhone}?text=${encodeURIComponent(rawMessage)}`,
        rawText: rawMessage,
        targetPhone: businessPhone,
      };
    }

    return linkResult.value;
  }

  /**
   * Genera el deep link para enviar el comprobante de pago de la cita al asesor de MITEFREE.
   */
  public static createPaymentProofLink(
    payload: PaymentProofWhatsAppPayload,
    businessPhone = OFFICIAL_MITEFREE_WHATSAPP_PHONE,
  ): WhatsAppDeepLinkResult {
    const rawMessage = engine.buildPaymentProofSubmission(payload);
    const linkResult = engine.generateDeepLink(businessPhone, rawMessage);

    if (linkResult.isFailure) {
      return {
        url: `https://wa.me/${businessPhone}?text=${encodeURIComponent(rawMessage)}`,
        rawText: rawMessage,
        targetPhone: businessPhone,
      };
    }

    return linkResult.value;
  }

  /**
   * Abre la URL de WhatsApp en una pestaña nueva o app nativa.
   * Si el navegador bloquea la ventana emergente, copia el texto al portapapeles como salvaguarda.
   */
  public static openOrCopy(deepLink: WhatsAppDeepLinkResult): {
    opened: boolean;
    copied: boolean;
  } {
    if (typeof window === 'undefined') {
      return { opened: false, copied: false };
    }

    let opened = false;
    try {
      const newTab = window.open(deepLink.url, '_blank', 'noopener,noreferrer');
      opened = !!newTab && !newTab.closed;
    } catch {
      opened = false;
    }

    let copied = false;
    if (!opened && navigator?.clipboard) {
      try {
        navigator.clipboard.writeText(deepLink.rawText);
        copied = true;
      } catch {
        copied = false;
      }
    }

    return { opened, copied };
  }
}
