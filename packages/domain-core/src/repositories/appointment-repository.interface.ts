import { Appointment } from '../entities/appointment.entity.js';

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByTechnicianAndDate(technicianId: string, date: Date): Promise<Appointment[]>;
  findByTimeSlot(timeSlotId: string, date: Date): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
}
