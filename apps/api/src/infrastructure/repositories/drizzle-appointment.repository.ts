import { Injectable, Inject, Logger } from '@nestjs/common';
import { type IAppointmentRepository, Appointment, AppointmentStatus } from '@mitefree/domain-core';
import { type DatabaseClient, appointments, SEED_DATA, SEED_IDS } from '@mitefree/database';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../database/database.tokens.js';

@Injectable()
export class DrizzleAppointmentRepository implements IAppointmentRepository {
  private readonly logger = new Logger(DrizzleAppointmentRepository.name);
  private readonly memoryStore = new Map<string, Appointment>();

  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DatabaseClient | null,
  ) {
    if (!this.db) {
      const now = new Date();
      for (const apt of SEED_DATA.appointments) {
        this.memoryStore.set(
          apt.id,
          new Appointment({
            id: apt.id,
            quotationId: apt.quotationId,
            clientId: apt.clientId,
            technicianId: apt.technicianId ?? undefined,
            timeSlotId: apt.timeSlotId,
            scheduledDate: apt.scheduledDate,
            status: apt.status as AppointmentStatus,
            createdAt: now,
            updatedAt: now,
          }),
        );
      }
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    if (!this.db) {
      return this.memoryStore.get(id) ?? null;
    }

    try {
      const rows = await this.db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      return new Appointment({
        id: row.id,
        quotationId: row.quotationId,
        clientId: row.clientId,
        clientName: row.clientName ?? undefined,
        clientPhone: row.clientPhone ?? undefined,
        address: row.address ?? undefined,
        zoneCode: row.zoneCode ?? undefined,
        serviceDescription: row.serviceDescription ?? undefined,
        totalAmount: row.totalAmount ? Number(row.totalAmount) : undefined,
        depositAmount: row.depositAmount ? Number(row.depositAmount) : undefined,
        technicianId: row.technicianId ?? undefined,
        timeSlotId: row.timeSlotId,
        scheduledDate: row.scheduledDate,
        status: row.status as AppointmentStatus,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Error finding appointment ${id}, falling back to memory`, error);
      return this.memoryStore.get(id) ?? null;
    }
  }

  async findAll(): Promise<Appointment[]> {
    if (!this.db) {
      return Array.from(this.memoryStore.values());
    }

    try {
      const rows = await this.db.select().from(appointments);
      return rows.map(
        (row) =>
          new Appointment({
            id: row.id,
            quotationId: row.quotationId,
            clientId: row.clientId,
            clientName: row.clientName ?? undefined,
            clientPhone: row.clientPhone ?? undefined,
            address: row.address ?? undefined,
            zoneCode: row.zoneCode ?? undefined,
            serviceDescription: row.serviceDescription ?? undefined,
            totalAmount: row.totalAmount ? Number(row.totalAmount) : undefined,
            depositAmount: row.depositAmount ? Number(row.depositAmount) : undefined,
            technicianId: row.technicianId ?? undefined,
            timeSlotId: row.timeSlotId,
            scheduledDate: row.scheduledDate,
            status: row.status as AppointmentStatus,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          }),
      );
    } catch (error) {
      this.logger.error('Error finding all appointments, falling back to memory', error);
      return Array.from(this.memoryStore.values());
    }
  }

  async findByTechnicianAndDate(technicianId: string, date: Date): Promise<Appointment[]> {
    if (!this.db) {
      return Array.from(this.memoryStore.values()).filter(
        (a) =>
          a.technicianId === technicianId && a.scheduledDate.toDateString() === date.toDateString(),
      );
    }

    try {
      const rows = await this.db
        .select()
        .from(appointments)
        .where(eq(appointments.technicianId, technicianId));

      return rows
        .filter((r) => r.scheduledDate.toDateString() === date.toDateString())
        .map(
          (row) =>
            new Appointment({
              id: row.id,
              quotationId: row.quotationId,
              clientId: row.clientId,
              technicianId: row.technicianId ?? undefined,
              timeSlotId: row.timeSlotId,
              scheduledDate: row.scheduledDate,
              status: row.status as AppointmentStatus,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            }),
        );
    } catch (error) {
      this.logger.error('Error finding appointments by technician and date', error);
      return [];
    }
  }

  async findByTimeSlot(timeSlotId: string, date: Date): Promise<Appointment[]> {
    if (!this.db) {
      return Array.from(this.memoryStore.values()).filter(
        (a) =>
          a.timeSlotId === timeSlotId && a.scheduledDate.toDateString() === date.toDateString(),
      );
    }

    try {
      const rows = await this.db
        .select()
        .from(appointments)
        .where(eq(appointments.timeSlotId, timeSlotId));

      return rows
        .filter((r) => r.scheduledDate.toDateString() === date.toDateString())
        .map(
          (row) =>
            new Appointment({
              id: row.id,
              quotationId: row.quotationId,
              clientId: row.clientId,
              technicianId: row.technicianId ?? undefined,
              timeSlotId: row.timeSlotId,
              scheduledDate: row.scheduledDate,
              status: row.status as AppointmentStatus,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            }),
        );
    } catch (error) {
      this.logger.error('Error finding appointments by timeslot', error);
      return [];
    }
  }

  async save(appointment: Appointment): Promise<void> {
    this.memoryStore.set(appointment.id, appointment);

    if (!this.db) return;

    try {
      const dbSlotId =
        appointment.timeSlotId.length === 36 && appointment.timeSlotId.includes('-')
          ? appointment.timeSlotId
          : appointment.timeSlotId === 'AFTERNOON'
            ? SEED_IDS.SLOT_AFTERNOON_SPM
            : SEED_IDS.SLOT_MORNING_SPM;

      await this.db.insert(appointments).values({
        id: appointment.id,
        quotationId: appointment.quotationId,
        clientId: appointment.clientId,
        clientName: appointment.clientName ?? null,
        clientPhone: appointment.clientPhone ?? null,
        address: appointment.address ?? null,
        zoneCode: appointment.zoneCode ?? null,
        serviceDescription: appointment.serviceDescription ?? null,
        totalAmount: appointment.totalAmount ? appointment.totalAmount.toString() : null,
        depositAmount: appointment.depositAmount ? appointment.depositAmount.toString() : null,
        technicianId: appointment.technicianId ?? null,
        timeSlotId: dbSlotId,
        scheduledDate: appointment.scheduledDate,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      });
    } catch (error) {
      this.logger.error(`Error saving appointment ${appointment.id} to Drizzle`, error);
    }
  }

  async update(appointment: Appointment): Promise<void> {
    this.memoryStore.set(appointment.id, appointment);

    if (!this.db) return;

    try {
      await this.db
        .update(appointments)
        .set({
          technicianId: appointment.technicianId ?? null,
          status: appointment.status,
          updatedAt: appointment.updatedAt,
        })
        .where(eq(appointments.id, appointment.id));
    } catch (error) {
      this.logger.error(`Error updating appointment ${appointment.id}`, error);
    }
  }
}
