import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IAppointmentRepository,
  type IQuotationRepository,
  Appointment,
  Quotation,
  QuotationItem,
  FabricType,
  StainSeverity,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { CreateAppointmentDto, AppointmentResponseDto } from '@mitefree/shared-types';
import { SEED_IDS } from '@mitefree/database';
import { IUseCase } from '../common/use-case.interface.js';
import {
  APPOINTMENT_REPOSITORY,
  QUOTATION_REPOSITORY,
} from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class ScheduleAppointmentUseCase implements IUseCase<
  CreateAppointmentDto,
  Result<AppointmentResponseDto, string>
> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepo: IQuotationRepository,
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<Result<AppointmentResponseDto, string>> {
    const resolvedClientId = dto.clientId && dto.clientId.length === 36
      ? dto.clientId
      : SEED_IDS.CLIENT_LAURA;

    let resolvedQuotationId: string;

    if (dto.quotationId) {
      const quotation = await this.quotationRepo.findById(dto.quotationId);
      if (!quotation) {
        return fail(`Quotation with id '${dto.quotationId}' does not exist.`);
      }

      if (quotation.isExpired()) {
        return fail('Cannot schedule appointment for an expired quotation.');
      }
      resolvedQuotationId = quotation.id;
    } else {
      // Reserva directa desde la agenda sin cotización previa: creamos cotización canónica vinculada
      const quoteId = randomUUID();
      const totalAmount = dto.totalAmount ?? 3500;
      const itemResult = QuotationItem.create({
        id: `item-${quoteId.substring(0, 8)}`,
        furnitureType: dto.serviceDescription || 'Servicio Integral de Higienización & Desinfección',
        fabricType: FabricType.Synthetic,
        stainSeverity: StainSeverity.Light,
        basePriceAmount: totalAmount,
      });

      const quoteResult = Quotation.create({
        id: quoteId,
        clientId: resolvedClientId,
        items: itemResult.isSuccess ? [itemResult.value] : [],
        depositRate: 0.3,
      });

      if (quoteResult.isFailure) {
        return fail(quoteResult.error);
      }

      await this.quotationRepo.save(quoteResult.value);
      resolvedQuotationId = quoteId;
    }

    const scheduledDate = new Date(dto.scheduledDate);
    const existingSlotAppointments = await this.appointmentRepo.findByTimeSlot(
      dto.timeSlotId,
      scheduledDate,
    );

    // Guardrail: max 4 appointments per general timeslot
    if (existingSlotAppointments.length >= 4) {
      return fail('The requested time slot is completely booked for this date.');
    }

    const appointment = Appointment.create({
      id: randomUUID(),
      quotationId: resolvedQuotationId,
      clientId: resolvedClientId,
      clientName: dto.clientName || 'Cliente MITEFREE',
      clientPhone: dto.clientPhone || '+1 809-555-0100',
      address: dto.address || 'Dirección de Servicio',
      zoneCode: dto.zoneCode || 'ZONE-SPM',
      serviceDescription: dto.serviceDescription || 'Limpieza y Desinfección Profunda',
      totalAmount: dto.totalAmount || 3500,
      depositAmount: dto.depositAmount || 1050,
      timeSlotId: dto.timeSlotId,
      scheduledDate,
    });

    await this.appointmentRepo.save(appointment);

    return ok({
      id: appointment.id,
      quotationId: appointment.quotationId,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      address: appointment.address,
      zoneCode: appointment.zoneCode,
      serviceDescription: appointment.serviceDescription,
      totalAmount: appointment.totalAmount,
      depositAmount: appointment.depositAmount,
      technicianId: appointment.technicianId,
      timeSlotId: appointment.timeSlotId,
      scheduledDate: appointment.scheduledDate.toISOString(),
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    });
  }
}
