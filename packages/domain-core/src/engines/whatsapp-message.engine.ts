import { Result, ok, fail } from '../common/result.js';

export interface QuotationWhatsAppItem {
  name: string;
  quantity: number;
  totalAmountDop: number;
}

export interface QuotationWhatsAppPayload {
  quotationCode: string;
  clientName?: string;
  items: QuotationWhatsAppItem[];
  fabricName?: string;
  stainSeverityName?: string;
  totalDop: number;
  deposit30PercentDop: number;
  quotationUrl?: string;
}

export interface BookingConfirmationWhatsAppPayload {
  appointmentCode: string;
  clientName: string;
  scheduledDate: string;
  timeSlotLabel: string;
  crewName: string;
  address: string;
  zoneName: string;
  depositPaidDop: number;
  remainingBalanceDop: number;
  supportPhone?: string;
}

export interface CrewDispatchWhatsAppPayload {
  appointmentCode: string;
  crewName: string;
  clientName: string;
  clientPhone: string;
  address: string;
  zoneName: string;
  timeSlotLabel: string;
  taskSummary: string;
  mapsQuery?: string;
}

export interface Reminder24hWhatsAppPayload {
  clientName: string;
  scheduledDate: string;
  timeSlotLabel: string;
  crewName: string;
  supportPhone?: string;
}

export interface PaymentProofWhatsAppPayload {
  appointmentCode: string;
  clientName: string;
  bankName: string;
  depositAmountDop: number;
}

export interface WhatsAppDeepLinkResult {
  url: string;
  rawText: string;
  targetPhone: string;
}

function formatDop(amount: number): string {
  return `RD$ ${Math.round(amount).toLocaleString('en-US')}`;
}

export class WhatsAppMessageEngine {
  /**
   * Sanitiza un número dominicano o internacional para formato canónico wa.me (solo dígitos).
   * Por ejemplo: "(809) 513-4773" -> "18095134773"
   */
  public sanitizePhoneNumber(raw: string): Result<string, string> {
    if (!raw || typeof raw !== 'string') {
      return fail('Número de teléfono inválido o vacío');
    }

    const digitsOnly = raw.replace(/\D/g, '');

    // Si viene en formato local de 10 dígitos (809XXXXXXX / 829XXXXXXX / 849XXXXXXX)
    if (digitsOnly.length === 10) {
      if (['809', '829', '849'].includes(digitsOnly.substring(0, 3))) {
        return ok(`1${digitsOnly}`);
      }
      return ok(`1${digitsOnly}`);
    }

    // Si viene con el 1 inicial (11 dígitos para NANP / República Dominicana)
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return ok(digitsOnly);
    }

    // Validación E.164 genérica (entre 10 y 15 dígitos)
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      return ok(digitsOnly);
    }

    return fail(`Número de teléfono inválido (${raw}). Se esperaba formato dominicano E.164 (ej. 809-513-4773)`);
  }

  /**
   * Genera el deep link oficial de WhatsApp https://wa.me/PHONE?text=ENCODED_TEXT
   */
  public generateDeepLink(
    targetPhone: string,
    messageText: string,
  ): Result<WhatsAppDeepLinkResult, string> {
    const sanitizeResult = this.sanitizePhoneNumber(targetPhone);
    if (sanitizeResult.isFailure) {
      return fail(sanitizeResult.error);
    }

    const phone = sanitizeResult.value;
    const encodedText = encodeURIComponent(messageText);
    const url = `https://wa.me/${phone}?text=${encodedText}`;

    return ok({
      url,
      rawText: messageText,
      targetPhone: phone,
    });
  }

  /**
   * Plantilla A: Cotización para que el cliente la comparta con el asesor de MITEFREE.
   */
  public buildQuotationProposal(payload: QuotationWhatsAppPayload): string {
    const lines: string[] = [];
    lines.push('¡Hola MITEFREE! 👋');
    if (payload.clientName) {
      lines.push(`Mi nombre es ${payload.clientName} y acabo de generar esta cotización en la web:`);
    } else {
      lines.push('Acabo de generar esta cotización en la web:');
    }
    lines.push('');
    lines.push(`📋 *Cotización:* #${payload.quotationCode}`);

    if (payload.items.length > 0) {
      lines.push('*Artículos a Tratar:*');
      for (const it of payload.items) {
        lines.push(`• ${it.quantity}x ${it.name} (${formatDop(it.totalAmountDop)})`);
      }
    }

    if (payload.fabricName) {
      lines.push(`🛋️ *Tipo de Tela:* ${payload.fabricName}`);
    }
    if (payload.stainSeverityName) {
      lines.push(`💧 *Tratamiento:* ${payload.stainSeverityName}`);
    }

    lines.push('');
    lines.push(`💰 *Inversión Total:* *${formatDop(payload.totalDop)}*`);
    lines.push(`🔒 *Anticipo 30% Sugerido:* ${formatDop(payload.deposit30PercentDop)}`);
    lines.push('*(Pagas el 70% restante al ver tus muebles impecables)*');

    if (payload.quotationUrl) {
      lines.push('');
      lines.push(`🔗 *Ver detalle completo:* ${payload.quotationUrl}`);
    }

    lines.push('');
    lines.push('¿Tienen disponibilidad de cuadrilla técnica para esta semana? ¡Muchas gracias!');

    return lines.join('\n');
  }

  /**
   * Plantilla B: Confirmación formal de cita enviada por el despacho al cliente.
   */
  public buildBookingConfirmation(payload: BookingConfirmationWhatsAppPayload): string {
    const lines: string[] = [];
    lines.push(`¡Hola ${payload.clientName}! ✅ Tu cita de desinfección MITEFREE está CONFIRMADA.`);
    lines.push('');
    lines.push(`📌 *Código de Cita:* #${payload.appointmentCode}`);
    lines.push(`📅 *Fecha Programada:* ${payload.scheduledDate}`);
    lines.push(`⏰ *Ventana Horaria:* ${payload.timeSlotLabel}`);
    lines.push(`👷 *Cuadrilla Asignada:* ${payload.crewName}`);
    lines.push(`📍 *Dirección:* ${payload.address} (${payload.zoneName})`);
    lines.push('');
    lines.push(`💵 *Anticipo Recibido:* ${formatDop(payload.depositPaidDop)}`);
    lines.push(`💳 *Saldo a Liquidar Post-Servicio:* ${formatDop(payload.remainingBalanceDop)}`);
    lines.push('');
    lines.push('Nuestros técnicos llegarán uniformados y con equipos de extracción profunda.');
    if (payload.supportPhone) {
      lines.push(`Cualquier consulta puedes responder directamente a este mensaje o llamar al ${payload.supportPhone}.`);
    }
    lines.push('¡Gracias por confiar en MITEFREE!');

    return lines.join('\n');
  }

  /**
   * Plantilla C: Despacho de ruta enviado al líder de cuadrilla técnica.
   */
  public buildCrewDispatch(payload: CrewDispatchWhatsAppPayload): string {
    const lines: string[] = [];
    lines.push(`🚨 NUEVO DESPACHO ASIGNADO — CUADRILLA: ${payload.crewName}`);
    lines.push('');
    lines.push(`📋 *Cita:* #${payload.appointmentCode}`);
    lines.push(`⏰ *Horario:* ${payload.timeSlotLabel}`);
    lines.push(`👤 *Cliente:* ${payload.clientName}`);
    lines.push(`📞 *Teléfono:* ${payload.clientPhone}`);
    lines.push(`📍 *Sector:* ${payload.zoneName}`);
    lines.push(`🏠 *Dirección:* ${payload.address}`);

    const query = payload.mapsQuery || `${payload.address}, ${payload.zoneName}, Republica Dominicana`;
    lines.push(`🗺️ *Ruta Google Maps:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);

    lines.push('');
    lines.push(`🛋️ *Detalle del Servicio:*`);
    lines.push(payload.taskSummary);
    lines.push('');
    lines.push('⚠️ *Instrucción:* Realizar inspección de tela previa con el cliente antes de aplicar vapor.');

    return lines.join('\n');
  }

  /**
   * Plantilla D: Recordatorio 24 horas antes para el cliente.
   */
  public buildReminder24h(payload: Reminder24hWhatsAppPayload): string {
    const lines: string[] = [];
    lines.push(`⏰ ¡Hola ${payload.clientName}! Te recordamos que MAÑANA tenemos programado tu servicio de desinfección MITEFREE.`);
    lines.push('');
    lines.push(`📅 *Fecha:* ${payload.scheduledDate}`);
    lines.push(`⏰ *Turno:* ${payload.timeSlotLabel}`);
    lines.push(`👷 *Cuadrilla:* ${payload.crewName}`);
    lines.push('');
    lines.push('💡 *Recomendación:* Por favor despejar objetos personales o decorativos del mobiliario para agilizar el proceso.');
    if (payload.supportPhone) {
      lines.push(`Si necesitas reprogramar, avísanos con tiempo al ${payload.supportPhone}.`);
    }
    lines.push('¡Nos vemos mañana!');

    return lines.join('\n');
  }

  /**
   * Plantilla E: Mensaje para que el cliente envíe el comprobante de depósito al despacho.
   */
  public buildPaymentProofSubmission(payload: PaymentProofWhatsAppPayload): string {
    const lines: string[] = [];
    lines.push('👋 ¡Hola equipo de MITEFREE!');
    lines.push(`Mi nombre es ${payload.clientName}.`);
    lines.push(`Acabo de realizar la transferencia de anticipo para mi cita #${payload.appointmentCode}:`);
    lines.push('');
    lines.push(`🏦 *Banco Emisor:* ${payload.bankName}`);
    lines.push(`💰 *Monto Transferido:* ${formatDop(payload.depositAmountDop)}`);
    lines.push('');
    lines.push('📸 Adjunto el comprobante en esta conversación para su validación y confirmación. ¡Muchas gracias!');

    return lines.join('\n');
  }
}
