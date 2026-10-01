import { Module } from '@nestjs/common';
import { AppointmentsController } from '../presentation/controllers/appointments.controller.js';
import { ScheduleAppointmentUseCase } from '../application/appointments/schedule-appointment.use-case.js';
import { GetAppointmentUseCase } from '../application/appointments/get-appointment.use-case.js';
import { DrizzleAppointmentRepository } from '../infrastructure/repositories/drizzle-appointment.repository.js';
import { APPOINTMENT_REPOSITORY } from '../infrastructure/database/database.tokens.js';
import { QuotationsModule } from './quotations.module.js';

@Module({
  imports: [QuotationsModule],
  controllers: [AppointmentsController],
  providers: [
    ScheduleAppointmentUseCase,
    GetAppointmentUseCase,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: DrizzleAppointmentRepository,
    },
  ],
  exports: [APPOINTMENT_REPOSITORY, ScheduleAppointmentUseCase, GetAppointmentUseCase],
})
export class AppointmentsModule {}
