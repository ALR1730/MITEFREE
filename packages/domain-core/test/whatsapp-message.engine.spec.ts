import { describe, it, expect } from 'bun:test';
import {
  WhatsAppMessageEngine,
  type QuotationWhatsAppPayload,
  type BookingConfirmationWhatsAppPayload,
  type CrewDispatchWhatsAppPayload,
  type Reminder24hWhatsAppPayload,
  type PaymentProofWhatsAppPayload,
} from '../src/engines/whatsapp-message.engine.js';

describe('WhatsAppMessageEngine — TDD Suite (≥95% Cobertura) (ALR COMPANY)', () => {
  const engine = new WhatsAppMessageEngine();

  describe('01: Cotizaciones (QUOTATION_PROPOSAL)', () => {
    it('debe construir un mensaje formateado con ítems, anticipo del 30% y desglose formal', () => {
      const payload: QuotationWhatsAppPayload = {
        quotationCode: 'COT-8942',
        clientName: 'Lic. Angel Rosario',
        items: [
          { name: 'Sofá 3 Plazas (Lino)', quantity: 1, totalAmountDop: 4500 },
          { name: 'Silla Comedor', quantity: 4, totalAmountDop: 2400 },
        ],
        fabricName: 'Lino Premium',
        stainSeverityName: 'Manchas Moderadas',
        totalDop: 6900,
        deposit30PercentDop: 2070,
        quotationUrl: 'https://mitefree.com.do/cotizar/COT-8942',
      };

      const message = engine.buildQuotationProposal(payload);

      expect(message).toContain('¡Hola MITEFREE! 👋');
      expect(message).toContain('COT-8942');
      expect(message).toContain('Lic. Angel Rosario');
      expect(message).toContain('• 1x Sofá 3 Plazas (Lino)');
      expect(message).toContain('• 4x Silla Comedor');
      expect(message).toContain('RD$ 6,900');
      expect(message).toContain('*Anticipo 30% Sugerido:* RD$ 2,070');
      expect(message).toContain('https://mitefree.com.do/cotizar/COT-8942');
    });
  });

  describe('02: Confirmación de Cita al Cliente (BOOKING_CONFIRMATION)', () => {
    it('debe construir confirmación con fecha, cuadrilla, anticipo recibido y saldo pendiente', () => {
      const payload: BookingConfirmationWhatsAppPayload = {
        appointmentCode: 'APT-1049',
        clientName: 'Carla Mendoza',
        scheduledDate: 'Miércoles 14 de Octubre',
        timeSlotLabel: 'Mañana (08:30 AM - 11:30 AM)',
        crewName: 'Los Titanes de Piantini',
        address: 'C/ Federico Geraldino #45, Apt 5B',
        zoneName: 'Piantini (Polígono Central)',
        depositPaidDop: 1500,
        remainingBalanceDop: 3500,
        supportPhone: '+18095134773',
      };

      const message = engine.buildBookingConfirmation(payload);

      expect(message).toContain('¡Hola Carla Mendoza! ✅ Tu cita de desinfección MITEFREE está CONFIRMADA');
      expect(message).toContain('APT-1049');
      expect(message).toContain('Los Titanes de Piantini');
      expect(message).toContain('Miércoles 14 de Octubre');
      expect(message).toContain('*Anticipo Recibido:* RD$ 1,500');
      expect(message).toContain('*Saldo a Liquidar Post-Servicio:* RD$ 3,500');
      expect(message).toContain('Piantini (Polígono Central)');
    });
  });

  describe('03: Despacho de Ruta al Técnico / Cuadrilla (CREW_DISPATCH)', () => {
    it('debe generar la hoja de ruta con enlace directo a Google Maps y tareas detalladas', () => {
      const payload: CrewDispatchWhatsAppPayload = {
        appointmentCode: 'APT-1049',
        crewName: 'Escuadrón Bella Vista',
        clientName: 'Eduardo Gómez',
        clientPhone: '+18295551234',
        address: 'Av. Sarasota #12, Torre Alborada',
        zoneName: 'Bella Vista Sur',
        timeSlotLabel: 'Tarde (12:00 PM - 03:00 PM)',
        taskSummary: '1 Sofá Seccional 5 Plazas (Terciopelo) + 1 Colchón Queen',
        mapsQuery: 'Av. Sarasota 12, Bella Vista, Santo Domingo',
      };

      const message = engine.buildCrewDispatch(payload);

      expect(message).toContain('🚨 NUEVO DESPACHO ASIGNADO — CUADRILLA: Escuadrón Bella Vista');
      expect(message).toContain('APT-1049');
      expect(message).toContain('Eduardo Gómez');
      expect(message).toContain('+18295551234');
      expect(message).toContain('https://www.google.com/maps/search/?api=1&query=');
      expect(message).toContain('1 Sofá Seccional 5 Plazas');
    });
  });

  describe('04: Recordatorio 24 Horas Antes (REMINDER_24H)', () => {
    it('debe generar recordatorio con instrucciones de preparación del área', () => {
      const payload: Reminder24hWhatsAppPayload = {
        clientName: 'Ing. Leonardo Martínez',
        scheduledDate: 'Mañana Jueves 15 de Octubre',
        timeSlotLabel: '08:30 AM - 11:30 AM',
        crewName: 'Fuerza Naco',
        supportPhone: '+18095134773',
      };

      const message = engine.buildReminder24h(payload);

      expect(message).toContain('⏰ ¡Hola Ing. Leonardo Martínez!');
      expect(message).toContain('recordamos que MAÑANA tenemos programado tu servicio');
      expect(message).toContain('Mañana Jueves 15 de Octubre');
      expect(message).toContain('Fuerza Naco');
      expect(message).toContain('despejar objetos personales');
    });
  });

  describe('05: Envío de Comprobante Bancario (PAYMENT_PROOF_SUBMISSION)', () => {
    it('debe generar mensaje prellenado para adjuntar comprobante del Banco Popular/BHD', () => {
      const payload: PaymentProofWhatsAppPayload = {
        appointmentCode: 'APT-2030',
        clientName: 'Mariana Ortiz',
        bankName: 'Banco Popular Dominicano',
        depositAmountDop: 1350,
      };

      const message = engine.buildPaymentProofSubmission(payload);

      expect(message).toContain('👋 ¡Hola equipo de MITEFREE!');
      expect(message).toContain('APT-2030');
      expect(message).toContain('Banco Popular Dominicano');
      expect(message).toContain('RD$ 1,350');
      expect(message).toContain('Adjunto el comprobante');
    });
  });

  describe('06: Generación de Deep-Link canónico (wa.me)', () => {
    it('debe sanitizar número dominicano con guiones y paréntesis a formato wa.me', () => {
      const result = engine.generateDeepLink('(809) 513-4773', 'Hola Mite Free');
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.targetPhone).toBe('18095134773');
        expect(result.value.url).toBe('https://wa.me/18095134773?text=Hola%20Mite%20Free');
      }
    });

    it('debe manejar número con prefijo internacional +1', () => {
      const result = engine.generateDeepLink('+1 829 999 8888', 'Confirmación');
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.targetPhone).toBe('18299998888');
        expect(result.value.url).toContain('https://wa.me/18299998888?text=');
      }
    });

    it('debe rechazar número inválido con longitud incorrecta', () => {
      const result = engine.generateDeepLink('123', 'Texto');
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Número de teléfono inválido');
    });
  });
});
