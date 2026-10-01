import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  type IAppointmentRepository,
  type IQuotationRepository,
  Appointment,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { CreateAppointmentDto, AppointmentResponseDto } from '@mitefree/shared-types';
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
    const quotation = await this.quotationRepo.findById(dto.quotationId);
    if (!quotation) {
      return fail(`Quotation with id '${dto.quotationId}' does not exist.`);
    }

    if (quotation.isExpired()) {
      return fail('Cannot schedule appointment for an expired quotation.');
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
      quotationId: dto.quotationId,
      clientId: dto.clientId,
      timeSlotId: dto.timeSlotId,
      scheduledDate,
    });

    await this.appointmentRepo.save(appointment);

    return ok({
      id: appointment.id,
      quotationId: appointment.quotationId,
      clientId: appointment.clientId,
      technicianId: appointment.technicianId,
      timeSlotId: appointment.timeSlotId,
      scheduledDate: appointment.scheduledDate.toISOString(),
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    });
  }
}
