import { Injectable, Inject } from '@nestjs/common';
import {
  type IAppointmentRepository,
  RouteOptimizationEngine,
  ZoneCode,
  TimeSlotCode,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { AppointmentResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

export interface AssignTechnicianInput {
  appointmentId: string;
  technicianId: string;
}

@Injectable()
export class AssignTechnicianUseCase implements IUseCase<
  AssignTechnicianInput,
  Result<AppointmentResponseDto, string>
> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(input: AssignTechnicianInput): Promise<Result<AppointmentResponseDto, string>> {
    const appointment = await this.appointmentRepo.findById(input.appointmentId);
    if (!appointment) {
      return fail(`Appointment with id '${input.appointmentId}' not found.`);
    }

    // Verificar colisión horaria del técnico para esa fecha y bloque
    const techAppointments = await this.appointmentRepo.findByTechnicianAndDate(
      input.technicianId,
      appointment.scheduledDate,
    );

    const conflictResult = RouteOptimizationEngine.validateBookingConflict(
      {
        technicianId: input.technicianId,
        zoneCode: ZoneCode.DistritoNacional, // default zone
        timeSlotCode: appointment.timeSlotId as TimeSlotCode,
        scheduledDate: appointment.scheduledDate,
      },
      techAppointments.map((a) => ({
        id: a.id,
        technicianId: a.technicianId,
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: a.timeSlotId as TimeSlotCode,
        scheduledDate: a.scheduledDate,
        status: a.status,
      })),
    );

    if (conflictResult.isFailure) {
      return fail(conflictResult.error);
    }

    const assignResult = appointment.assignTechnician(input.technicianId);
    if (assignResult.isFailure) {
      return fail(assignResult.error);
    }

    const updated = assignResult.value;
    await this.appointmentRepo.update(updated);

    return ok({
      id: updated.id,
      quotationId: updated.quotationId,
      clientId: updated.clientId,
      technicianId: updated.technicianId,
      timeSlotId: updated.timeSlotId,
      scheduledDate: updated.scheduledDate.toISOString(),
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  }
}
