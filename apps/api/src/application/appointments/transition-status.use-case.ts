import { Injectable, Inject } from '@nestjs/common';
import {
  type IAppointmentRepository,
  AppointmentStatus,
  Result,
  ok,
  fail,
} from '@mitefree/domain-core';
import type { AppointmentResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

export interface TransitionStatusInput {
  appointmentId: string;
  nextStatus: AppointmentStatus;
}

@Injectable()
export class TransitionAppointmentStatusUseCase
  implements IUseCase<TransitionStatusInput, Result<AppointmentResponseDto, string>>
{
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(input: TransitionStatusInput): Promise<Result<AppointmentResponseDto, string>> {
    const appointment = await this.appointmentRepo.findById(input.appointmentId);
    if (!appointment) {
      return fail(`Appointment with id '${input.appointmentId}' not found.`);
    }

    const transitionResult = appointment.transitionTo(input.nextStatus);
    if (transitionResult.isFailure) {
      return fail(transitionResult.error);
    }

    const updated = transitionResult.value;
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
