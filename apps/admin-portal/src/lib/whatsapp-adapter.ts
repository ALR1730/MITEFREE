import {
  WhatsAppMessageEngine,
  type BookingConfirmationWhatsAppPayload,
  type CrewDispatchWhatsAppPayload,
  type Reminder24hWhatsAppPayload,
  type WhatsAppDeepLinkResult,
} from '@mitefree/domain-core';

export const OFFICIAL_MITEFREE_SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+18095134773';

const engine = new WhatsAppMessageEngine();

export class WhatsAppAdminAdapter {
  /**
   * Genera el deep link para enviar la confirmación oficial de cita al cliente.
   */
  public static createBookingConfirmationLink(
    payload: BookingConfirmationWhatsAppPayload,
    clientPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawMessage = engine.buildBookingConfirmation({
      ...payload,
      supportPhone: payload.supportPhone || OFFICIAL_MITEFREE_SUPPORT_PHONE,
    });

    const linkResult = engine.generateDeepLink(clientPhone, rawMessage);
    if (linkResult.isFailure) {
      const fallbackClean = clientPhone.replace(/\D/g, '');
      return {
        url: `https://wa.me/${fallbackClean}?text=${encodeURIComponent(rawMessage)}`,
        rawText: rawMessage,
        targetPhone: fallbackClean,
      };
    }

    return linkResult.value;
  }

  /**
   * Genera el deep link para despachar la hoja de ruta al líder técnico de la cuadrilla.
   */
  public static createCrewDispatchLink(
    payload: CrewDispatchWhatsAppPayload,
    crewLeaderPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawMessage = engine.buildCrewDispatch(payload);
    const linkResult = engine.generateDeepLink(crewLeaderPhone, rawMessage);

    if (linkResult.isFailure) {
      const fallbackClean = crewLeaderPhone.replace(/\D/g, '');
      return {
        url: `https://wa.me/${fallbackClean}?text=${encodeURIComponent(rawMessage)}`,
        rawText: rawMessage,
        targetPhone: fallbackClean,
      };
    }

    return linkResult.value;
  }

  /**
   * Genera el deep link para enviar el recordatorio preventivo de 24 horas al cliente.
   */
  public static createReminder24hLink(
    payload: Reminder24hWhatsAppPayload,
    clientPhone: string,
  ): WhatsAppDeepLinkResult {
    const rawMessage = engine.buildReminder24h({
      ...payload,
      supportPhone: payload.supportPhone || OFFICIAL_MITEFREE_SUPPORT_PHONE,
    });

    const linkResult = engine.generateDeepLink(clientPhone, rawMessage);
    if (linkResult.isFailure) {
      const fallbackClean = clientPhone.replace(/\D/g, '');
      return {
        url: `https://wa.me/${fallbackClean}?text=${encodeURIComponent(rawMessage)}`,
        rawText: rawMessage,
        targetPhone: fallbackClean,
      };
    }

    return linkResult.value;
  }

  /**
   * Abre la URL en una pestaña nueva o copia al portapapeles si hay bloqueo de popup.
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
