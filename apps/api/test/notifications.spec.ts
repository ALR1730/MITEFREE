import { describe, it, expect } from 'bun:test';
import { WhatsAppNotificationAdapter } from '../src/infrastructure/notifications/whatsapp-notification.adapter';
import { ResendEmailAdapter } from '../src/infrastructure/notifications/resend-email.adapter';

describe('Notifications Infrastructure & WhatsApp Sin API — TDD Suite (ALR COMPANY)', () => {
  const whatsappAdapter = new WhatsAppNotificationAdapter();
  const emailAdapter = new ResendEmailAdapter();

  describe('WhatsAppNotificationAdapter (Deep-Link Generation)', () => {
    it('debe generar deep link oficial wa.me para cotización con número dominicano', () => {
      const link = whatsappAdapter.generateQuotationDeepLink(
        {
          quotationCode: 'COT-7788',
          items: [{ name: 'Sofá 3 Plazas', quantity: 1, totalAmountDop: 3500 }],
          totalDop: 3500,
          deposit30PercentDop: 1050,
        },
        '(809) 513-4773',
      );

      expect(link.targetPhone).toBe('18095134773');
      expect(link.url).toContain('https://wa.me/18095134773?text=');
      expect(link.rawText).toContain('COT-7788');
      expect(link.rawText).toContain('RD$ 3,500');
    });

    it('debe generar deep link de confirmación para cliente con desglose del 30%', () => {
      const link = whatsappAdapter.generateBookingConfirmationDeepLink(
        {
          appointmentCode: 'APT-9921',
          clientName: 'Angel Rosario',
          scheduledDate: 'Viernes 16 de Octubre',
          timeSlotLabel: '08:30 AM - 11:30 AM',
          crewName: 'Los Titanes de Piantini',
          address: 'C/ Sarasota #12',
          zoneName: 'Bella Vista',
          depositPaidDop: 1050,
          remainingBalanceDop: 2450,
        },
        '8295551234',
      );

      expect(link.targetPhone).toBe('18295551234');
      expect(link.url).toContain('https://wa.me/18295551234?text=');
      expect(link.rawText).toContain('APT-9921');
      expect(link.rawText).toContain('Los Titanes de Piantini');
    });

    it('debe generar despacho de ruta con enlace a Google Maps para la cuadrilla', () => {
      const link = whatsappAdapter.generateCrewDispatchDeepLink(
        {
          appointmentCode: 'APT-9921',
          crewName: 'Fuerza Naco',
          clientName: 'María Pérez',
          clientPhone: '8095554321',
          address: 'Av. Tiradentes #8',
          zoneName: 'Naco',
          timeSlotLabel: '12:00 PM - 03:00 PM',
          taskSummary: '2 Muebles Lino',
        },
        '8095134773',
      );

      expect(link.rawText).toContain('Fuerza Naco');
      expect(link.rawText).toContain('maps/search/?api=1&query=');
    });
  });

  describe('ResendEmailAdapter (HTML & Fallback Mode)', () => {
    it('debe generar HTML responsivo de confirmación de cita con branding de MITEFREE', () => {
      const html = emailAdapter.generateBookingConfirmationHtml({
        clientName: 'Angel Luis Rosario',
        appointmentCode: 'APT-001',
        scheduledDate: 'Lunes 19 de Octubre',
        timeSlot: '08:30 AM - 11:30 AM',
        crewName: 'Escuadrón SPM',
        address: 'Barrio Lindo #14, San Pedro de Macorís',
        depositPaid: 1200,
        remainingBalance: 2800,
      });

      expect(html).toContain('MITEFREE CLEAN');
      expect(html).toContain('APT-001');
      expect(html).toContain('Angel Luis Rosario');
      expect(html).toContain('Escuadrón SPM');
      expect(html).toContain('RD$ 1,200');
    });

    it('debe operar con éxito en modo fallback de desarrollo cuando no hay RESEND_API_KEY', async () => {
      const result = await emailAdapter.sendEmail({
        to: 'founder@alrcompany.do',
        subject: 'Prueba de Entrega',
        html: '<p>Hola</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toContain('mock-email-');
    });
  });
});
