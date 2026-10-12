import { Injectable, Logger } from '@nestjs/common';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class ResendEmailAdapter {
  private readonly logger = new Logger(ResendEmailAdapter.name);
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly defaultFrom =
    process.env.RESEND_FROM_EMAIL || 'MITEFREE <notificaciones@mitefree.com.do>';

  /**
   * Envía correo transaccional vía Resend REST API.
   * Si no hay API key configurada en entorno, opera en modo desarrollo registrando en logs estructurados.
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailSendResult> {
    const from = options.from || this.defaultFrom;

    if (!this.apiKey) {
      this.logger.warn(
        `[Resend DEV Fallback] RESEND_API_KEY no configurada. Simulando envío a: ${options.to} | Asunto: "${options.subject}"`,
      );
      return {
        success: true,
        messageId: `mock-email-${Date.now()}`,
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.logger.error(`Error enviando email vía Resend: ${JSON.stringify(errorData)}`);
        return {
          success: false,
          error: `Resend error (${response.status}): ${JSON.stringify(errorData)}`,
        };
      }

      const data = (await response.json()) as { id: string };
      this.logger.log(`Email enviado con éxito vía Resend (ID: ${data.id}) a ${options.to}`);
      return {
        success: true,
        messageId: data.id,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Falla de red enviando email con Resend: ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  /**
   * Genera plantilla HTML responsiva para confirmación formal de cita con desglose financiero.
   */
  generateBookingConfirmationHtml(data: {
    clientName: string;
    appointmentCode: string;
    scheduledDate: string;
    timeSlot: string;
    crewName: string;
    address: string;
    depositPaid: number;
    remainingBalance: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; border: 1px solid #1f2937; padding: 32px; }
          .header { text-align: center; border-bottom: 1px solid #1f2937; padding-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 800; color: #06b6d4; letter-spacing: -0.5px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 12px; }
          .content { margin: 24px 0; font-size: 14px; line-height: 1.6; color: #9ca3af; }
          .detail-box { background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #374151; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
          .row-label { color: #9ca3af; }
          .row-value { color: #ffffff; font-weight: 600; text-align: right; }
          .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 32px; border-top: 1px solid #1f2937; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MITEFREE CLEAN</div>
            <div class="badge">Cita Confirmada #${data.appointmentCode}</div>
          </div>
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Tu servicio de desinfección y limpieza profunda a domicilio ha sido programado en nuestro sistema logístico.</p>
            <div class="detail-box">
              <div class="row"><span class="row-label">Fecha Programada:</span><span class="row-value">${data.scheduledDate}</span></div>
              <div class="row"><span class="row-label">Turno / Horario:</span><span class="row-value">${data.timeSlot}</span></div>
              <div class="row"><span class="row-label">Cuadrilla Asignada:</span><span class="row-value">${data.crewName}</span></div>
              <div class="row"><span class="row-label">Dirección:</span><span class="row-value">${data.address}</span></div>
              <div class="row" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #374151;">
                <span class="row-label">Anticipo Recibido (30%):</span><span class="row-value" style="color: #10b981;">RD$ ${data.depositPaid.toLocaleString('es-DO')}</span>
              </div>
              <div class="row">
                <span class="row-label">Saldo a Liquidar (Post-Inspección):</span><span class="row-value" style="color: #06b6d4;">RD$ ${data.remainingBalance.toLocaleString('es-DO')}</span>
              </div>
            </div>
            <p>Nuestros técnicos llegarán con extractor industrial, vapor a alta temperatura y uniformes de bioseguridad.</p>
          </div>
          <div class="footer">
            MITEFREE — División de Servicios a Domicilio · ALR COMPANY<br>
            Contacto directo: +1 (809) 513-4773 · San Pedro de Macorís / Santo Domingo
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
