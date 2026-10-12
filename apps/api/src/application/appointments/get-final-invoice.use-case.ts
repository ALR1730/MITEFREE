import { Injectable, Inject } from '@nestjs/common';
import {
  type IAppointmentRepository,
  type IQuotationRepository,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import { IUseCase } from '../common/use-case.interface.js';
import {
  APPOINTMENT_REPOSITORY,
  QUOTATION_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';
import { resolveTechnicianName } from './technician-name.helper.js';
import type { FinalInvoiceData, FinalInvoiceItem } from '../../infrastructure/pdf/final-invoice-pdf.service.js';

@Injectable()
export class GetFinalInvoiceUseCase implements IUseCase<string, Result<FinalInvoiceData, string>> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  async execute(appointmentId: string): Promise<Result<FinalInvoiceData, string>> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      return fail(`Appointment with id '${appointmentId}' not found.`);
    }

    let items: FinalInvoiceItem[] = [];
    let subtotal = Number(appointment.totalAmount) || 2500;
    let discountAmount = 0;
    let currency = 'DOP';

    if (appointment.quotationId) {
      const quotation = await this.quotationRepo.findById(appointment.quotationId);
      if (quotation) {
        subtotal = quotation.subtotal.amount;
        discountAmount = quotation.discountAmount.amount;
        currency = quotation.total.currency || 'DOP';
        if (quotation.items && quotation.items.length > 0) {
          items = quotation.items.map((it) => ({
            furnitureType: it.furnitureType,
            quantity: 1,
            subtotal: it.subtotal.amount,
          }));
        }
      }
    }

    if (items.length === 0) {
      items = [
        {
          furnitureType: appointment.serviceDescription || 'Limpieza Quirúrgica de Muebles',
          quantity: 1,
          subtotal: Number(appointment.totalAmount) || 2500,
        },
      ];
    }

    const total = Number(appointment.totalAmount) || (subtotal - discountAmount);
    const clientName = appointment.clientName || 'Consumidor Final (Sin Registrar)';
    const clientPhone = appointment.clientPhone || 'Vía Web';
    const address = appointment.address || 'Servicio Residencial a Domicilio';
    const technicianName = resolveTechnicianName(appointment.technicianId) || 'Cuadrilla Especializada MITEFREE';

    const invoiceData: FinalInvoiceData = {
      appointmentId: appointment.id,
      quotationId: appointment.quotationId,
      completedAt: appointment.updatedAt || new Date(),
      clientName,
      clientPhone,
      address,
      technicianName,
      items,
      subtotal,
      discountAmount,
      total,
      currency,
      paymentMethod: 'Liquidación Directa (Transferencia / Efectivo)',
    };

    return ok(invoiceData);
  }
}
