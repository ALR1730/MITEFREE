import { describe, it, expect, beforeEach } from 'bun:test';
import { FinalInvoicePdfService } from '../src/infrastructure/pdf/final-invoice-pdf.service.js';
import { GetFinalInvoiceUseCase } from '../src/application/appointments/get-final-invoice.use-case.js';
import type { IAppointmentRepository, IQuotationRepository } from '@mitefree/domain-core';

describe('Factura Final de Servicio Completado — TDD & QA Suite (ALR COMPANY)', () => {
  let pdfService: FinalInvoicePdfService;

  beforeEach(() => {
    pdfService = new FinalInvoicePdfService();
  });

  describe('FinalInvoicePdfService (Formato Térmico POS 80mm)', () => {
    it('GivenCompletedAppointmentData_WhenGeneratingPdf_ThenReturnsValidPdf14BufferWithThermalWidth', async () => {
      const sampleData = {
        appointmentId: 'c1111111-2222-3333-4444-555555555555',
        quotationId: 'q9999999-8888-7777-6666-555555555555',
        completedAt: new Date('2026-10-12T16:00:00Z'),
        clientName: 'Angel Luis Rosario',
        clientPhone: '(829) 555-0199',
        address: 'Torre Empresarial Bella Vista, Apto 5B, D.N.',
        technicianName: 'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)',
        items: [
          { furnitureType: 'Sofá en L (3 a 5 Plazas) - Terciopelo', quantity: 1, subtotal: 3500 },
          { furnitureType: 'Sillón Reclinable Individual', quantity: 1, subtotal: 1200 },
        ],
        subtotal: 4700,
        discountAmount: 500,
        total: 4200,
        currency: 'DOP',
        paymentMethod: 'Liquidación Directa (Transferencia / Efectivo)',
      };

      const buffer = await pdfService.generateFinalInvoicePdf(sampleData);

      expect(buffer).toBeInstanceOf(Buffer);
      const pdfText = buffer.toString('utf8');

      // Validar estándar PDF 1.4
      expect(pdfText).toContain('%PDF-1.4');

      // Validar dimensiones térmicas 80mm (226.0 pt de ancho)
      expect(pdfText).toContain('226.0');

      // Validar marca MITEFREE
      expect(pdfText).toContain('MITEFREE');

      // Validar número de factura y estado de liquidación
      expect(pdfText).toContain('FACTURA FINAL DE SERVICIO COMPLETADO');
      expect(pdfText).toContain('TOTAL LIQUIDADO');
      expect(pdfText).toContain('$4200.00 DOP');
      expect(pdfText).toContain('100% PAGADO / CANCELADO');

      // Validar certificación de garantía de 48 horas
      expect(pdfText).toContain('GARANTIA DE SATISFACCION 48H ACTIVA');
    });

    it('GivenGuestClient_WhenGeneratingPdf_ThenRendersConsumidorFinalFallback', async () => {
      const guestData = {
        appointmentId: 'c2222222-3333-4444-5555-666666666666',
        completedAt: new Date(),
        clientName: 'Consumidor Final (Sin Registrar)',
        clientPhone: 'Vía Web',
        address: 'Av. Winston Churchill #1099',
        technicianName: 'Cuadrilla Especializada MITEFREE',
        items: [
          { furnitureType: 'Colchón King Size - Desinfección UV-C', quantity: 1, subtotal: 2800 },
        ],
        subtotal: 2800,
        discountAmount: 0,
        total: 2800,
        currency: 'DOP',
      };

      const buffer = await pdfService.generateFinalInvoicePdf(guestData);
      const pdfText = buffer.toString('utf8');

      expect(pdfText).toContain('Consumidor Final');
      expect(pdfText).toContain('$2800.00 DOP');
    });
  });

  describe('GetFinalInvoiceUseCase (Orquestación & Repositorios)', () => {
    it('GivenCompletedAppointment_WhenExecuted_ThenResolvesQuotationItemsAndTechnician', async () => {
      const mockAppointment = {
        id: 'c1111111-2222-3333-4444-555555555555',
        quotationId: 'q9999999-8888-7777-6666-555555555555',
        clientName: 'Angel Luis Rosario',
        clientPhone: '809-555-1234',
        address: 'Piantini, Santo Domingo',
        technicianId: '11111111-0000-0000-0000-000000000001',
        totalAmount: 3500,
        status: 'Completed',
        updatedAt: new Date('2026-10-12T17:00:00Z'),
      };

      const mockQuotation = {
        id: 'q9999999-8888-7777-6666-555555555555',
        subtotal: { amount: 3500 },
        discountAmount: { amount: 0 },
        total: { amount: 3500, currency: 'DOP' },
        items: [
          { furnitureType: 'Juego de Sala Modular', subtotal: { amount: 3500 } },
        ],
      };

      const mockAppointmentRepo: Partial<IAppointmentRepository> = {
        findById: async (id: string) => (id === mockAppointment.id ? (mockAppointment as any) : null),
      };

      const mockQuotationRepo: Partial<IQuotationRepository> = {
        findById: async (id: string) => (id === mockQuotation.id ? (mockQuotation as any) : null),
      };

      const useCase = new GetFinalInvoiceUseCase(
        mockAppointmentRepo as IAppointmentRepository,
        mockQuotationRepo as IQuotationRepository,
      );

      const result = await useCase.execute(mockAppointment.id);

      expect(result.isSuccess).toBe(true);
      const invoice = result.value;
      expect(invoice.appointmentId).toBe(mockAppointment.id);
      expect(invoice.clientName).toBe('Angel Luis Rosario');
      expect(invoice.technicianName).toContain('Kelvin Rosario');
      expect(invoice.items.length).toBe(1);
      expect(invoice.items[0].furnitureType).toBe('Juego de Sala Modular');
      expect(invoice.total).toBe(3500);
      expect(invoice.currency).toBe('DOP');
    });

    it('GivenUnregisteredGuestAppointmentWithoutQuotation_WhenExecuted_ThenFallsBackGracefully', async () => {
      const mockAppointment = {
        id: 'c3333333-0000-0000-0000-000000000000',
        quotationId: undefined,
        clientName: undefined,
        clientPhone: undefined,
        address: undefined,
        technicianId: undefined,
        serviceDescription: 'Limpieza Integral Profunda',
        totalAmount: 2200,
        status: 'Completed',
        updatedAt: new Date(),
      };

      const mockAppointmentRepo: Partial<IAppointmentRepository> = {
        findById: async (id: string) => (id === mockAppointment.id ? (mockAppointment as any) : null),
      };

      const mockQuotationRepo: Partial<IQuotationRepository> = {
        findById: async () => null,
      };

      const useCase = new GetFinalInvoiceUseCase(
        mockAppointmentRepo as IAppointmentRepository,
        mockQuotationRepo as IQuotationRepository,
      );

      const result = await useCase.execute(mockAppointment.id);

      expect(result.isSuccess).toBe(true);
      const invoice = result.value;
      expect(invoice.clientName).toBe('Consumidor Final (Sin Registrar)');
      expect(invoice.address).toBe('Servicio Residencial a Domicilio');
      expect(invoice.technicianName).toBe('Cuadrilla Especializada MITEFREE');
      expect(invoice.items[0].furnitureType).toBe('Limpieza Integral Profunda');
      expect(invoice.total).toBe(2200);
    });

    it('GivenNonExistentAppointment_WhenExecuted_ThenReturnsFailureResult', async () => {
      const mockAppointmentRepo: Partial<IAppointmentRepository> = {
        findById: async () => null,
      };
      const mockQuotationRepo: Partial<IQuotationRepository> = {
        findById: async () => null,
      };

      const useCase = new GetFinalInvoiceUseCase(
        mockAppointmentRepo as IAppointmentRepository,
        mockQuotationRepo as IQuotationRepository,
      );

      const result = await useCase.execute('invalid-id');
      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
