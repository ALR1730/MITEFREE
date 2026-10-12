import { Injectable, Inject } from '@nestjs/common';
import { type IAppointmentRepository, Result, ok } from '@mitefree/domain-core';
import type { AppointmentResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

import { resolveTechnicianName } from './technician-name.helper.js';

@Injectable()
export class ListAppointmentsUseCase
  implements IUseCase<void, Result<AppointmentResponseDto[], string>>
{
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(): Promise<Result<AppointmentResponseDto[], string>> {
    const list = await this.appointmentRepo.findAll();

    const dtos: AppointmentResponseDto[] = list.map((apt) => ({
      id: apt.id,
      quotationId: apt.quotationId,
      clientId: apt.clientId,
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      address: apt.address,
      zoneCode: apt.zoneCode,
      serviceDescription: apt.serviceDescription,
      totalAmount: apt.totalAmount,
      depositAmount: apt.depositAmount,
      technicianId: apt.technicianId,
      technicianName: resolveTechnicianName(apt.technicianId),
      timeSlotId: apt.timeSlotId,
      scheduledDate: apt.scheduledDate.toISOString().split('T')[0]!,
      status: apt.status,
      createdAt: apt.createdAt.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
    }));

    return ok(dtos);
  }
}
