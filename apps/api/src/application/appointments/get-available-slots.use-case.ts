import { Injectable, Inject } from '@nestjs/common';
import {
  RouteOptimizationEngine,
  ZoneCode,
  TimeSlotCode,
  type IAppointmentRepository,
  type ExistingAppointmentBooking,
  Result,
  ok,
} from '@mitefree/domain-core';
import type { GetAvailableSlotsQueryDto, TimeSlotAvailabilityDto } from '@mitefree/shared-types';
import { IUseCase } from '../common/use-case.interface.js';
import { APPOINTMENT_REPOSITORY } from '../../infrastructure/database/database.tokens.js';

@Injectable()
export class GetAvailableSlotsUseCase implements IUseCase<
  GetAvailableSlotsQueryDto,
  Result<TimeSlotAvailabilityDto[], string>
> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(
    dto: GetAvailableSlotsQueryDto,
  ): Promise<Result<TimeSlotAvailabilityDto[], string>> {
    const targetDate = new Date(`${dto.date}T00:00:00Z`);

    // Recuperar citas existentes para evaluar conflicto y clustering
    // Consultamos las citas del día para la zona
    const allSlotBookings: ExistingAppointmentBooking[] = [];
    const slotCodes = [TimeSlotCode.Morning, TimeSlotCode.Afternoon, TimeSlotCode.Evening];

    for (const code of slotCodes) {
      const appointments = await this.appointmentRepo.findByTimeSlot(code, targetDate);
      for (const apt of appointments) {
        allSlotBookings.push({
          id: apt.id,
          technicianId: apt.technicianId,
          zoneCode: dto.zoneCode as ZoneCode,
          timeSlotCode: code,
          scheduledDate: apt.scheduledDate,
          status: apt.status,
        });
      }
    }

    const evaluations = RouteOptimizationEngine.evaluateDailySlots(
      dto.zoneCode as ZoneCode,
      targetDate,
      allSlotBookings,
      3, // Capacidad canónica de flota: 3 cuadrillas por bloque
    );

    const resultDtos: TimeSlotAvailabilityDto[] = evaluations.map((e) => ({
      timeSlotCode: e.timeSlotCode,
      startTime: e.startTime,
      endTime: e.endTime,
      label: e.label,
      isAvailable: e.isAvailable,
      hasRoutePromotion: e.hasRoutePromotion,
      promotionDiscountRate: e.promotionDiscountRate,
      matchedTechnicianId: e.matchedTechnicianId,
    }));

    return ok(resultDtos);
  }
}
