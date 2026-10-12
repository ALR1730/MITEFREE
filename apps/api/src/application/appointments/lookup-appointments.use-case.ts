import { Injectable, Inject } from '@nestjs/common';
import { type IAppointmentRepository, Result, ok, fail } from '@mitefree/domain-core';
import type { AppointmentResponseDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';
import { resolveTechnicianName } from './technician-name.helper.js';

export interface LookupAppointmentsQuery {
  phone?: string;
  code?: string;
}

function normalizePhone(raw: string): string {
  // Eliminar caracteres no numéricos
  let digits = raw.replace(/\D/g, '');
  // Si inicia con código internacional 1 (ej: 18095550188), removerlo
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.substring(1);
  }
  return digits;
}

@Injectable()
export class LookupAppointmentsUseCase
  implements IUseCase<LookupAppointmentsQuery, Result<AppointmentResponseDto[], string>>
{
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(
    query: LookupAppointmentsQuery,
  ): Promise<Result<AppointmentResponseDto[], string>> {
    const rawPhone = query.phone?.trim();
    const rawCode = query.code?.trim().toUpperCase().replace('#', '');

    if (!rawPhone && !rawCode) {
      return fail('Debe proporcionar un número de teléfono o código de cita para consultar.');
    }

    const all = await this.appointmentRepo.findAll();

    let matched = all;

    if (rawPhone) {
      const cleanSearchPhone = normalizePhone(rawPhone);
      if (cleanSearchPhone.length < 7) {
        return fail('El número telefónico debe contener al menos 7 dígitos.');
      }
      matched = matched.filter((apt) => {
        if (!apt.clientPhone) return false;
        const cleanAptPhone = normalizePhone(apt.clientPhone);
        return (
          cleanAptPhone.includes(cleanSearchPhone) ||
          cleanSearchPhone.includes(cleanAptPhone)
        );
      });
    }

    if (rawCode) {
      matched = matched.filter((apt) => {
        const idUpper = apt.id.toUpperCase();
        return idUpper.includes(rawCode) || idUpper.startsWith(rawCode);
      });
    }

    // Ordenar de más reciente a más antigua
    matched.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());

    const dtos: AppointmentResponseDto[] = matched.map((apt) => ({
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
      scheduledDate: apt.scheduledDate.toISOString(),
      status: apt.status,
      createdAt: apt.createdAt.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
    }));

    return ok(dtos);
  }
}
