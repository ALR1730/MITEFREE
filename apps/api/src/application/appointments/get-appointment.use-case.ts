import { Injectable, Inject } from '@nestjs/common';
import { type IAppointmentRepository, Result, ok, fail } from '@mitefree/domain-core';
import type { AppointmentResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class GetAppointmentUseCase implements IUseCase<
  string,
  Result<AppointmentResponseDto, string>
> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(id: string): Promise<Result<AppointmentResponseDto, string>> {
    const appointment = await this.appointmentRepo.findById(id);

    if (!appointment) {
      return fail(`Appointment with id '${id}' was not found.`);
    }

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
