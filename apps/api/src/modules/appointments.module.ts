import { Module } from '@nestjs/common';
import { AppointmentsController } from '../presentation/controllers/appointments.controller.js';
import { ScheduleAppointmentUseCase } from '../application/appointments/schedule-appointment.use-case.js';
import { GetAppointmentUseCase } from '../application/appointments/get-appointment.use-case.js';
import { GetAvailableSlotsUseCase } from '../application/appointments/get-available-slots.use-case.js';
import { TransitionAppointmentStatusUseCase } from '../application/appointments/transition-status.use-case.js';
import { AssignTechnicianUseCase } from '../application/appointments/assign-technician.use-case.js';
import { DrizzleAppointmentRepository } from '../infrastructure/repositories/drizzle-appointment.repository.js';
import { APPOINTMENT_REPOSITORY } from '../infrastructure/database/database.tokens.js';
import { QuotationsModule } from './quotations.module.js';

@Module({
  imports: [QuotationsModule],
  controllers: [AppointmentsController],
  providers: [
    ScheduleAppointmentUseCase,
    GetAppointmentUseCase,
    GetAvailableSlotsUseCase,
    TransitionAppointmentStatusUseCase,
    AssignTechnicianUseCase,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: DrizzleAppointmentRepository,
    },
  ],
  exports: [
    APPOINTMENT_REPOSITORY,
    ScheduleAppointmentUseCase,
    GetAppointmentUseCase,
    GetAvailableSlotsUseCase,
    TransitionAppointmentStatusUseCase,
    AssignTechnicianUseCase,
  ],
})
export class AppointmentsModule {}
