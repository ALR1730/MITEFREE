import {
  AppointmentStatus,
  isValidAppointmentTransition,
} from '../enums/appointment-status.enum.js';
import { Result, ok, fail } from '../common/result.js';

export interface AppointmentProps {
  id: string;
  quotationId: string;
  clientId: string;
  technicianId?: string;
  timeSlotId: string;
  scheduledDate: Date;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  readonly id: string;
  readonly quotationId: string;
  readonly clientId: string;
  readonly technicianId?: string;
  readonly timeSlotId: string;
  readonly scheduledDate: Date;
  readonly status: AppointmentStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: AppointmentProps) {
    this.id = props.id;
    this.quotationId = props.quotationId;
    this.clientId = props.clientId;
    this.technicianId = props.technicianId;
    this.timeSlotId = props.timeSlotId;
    this.scheduledDate = props.scheduledDate;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    Object.freeze(this);
  }

  static create(params: {
    id: string;
    quotationId: string;
    clientId: string;
    timeSlotId: string;
    scheduledDate: Date;
    now?: Date;
  }): Appointment {
    const now = params.now ?? new Date();
    return new Appointment({
      id: params.id,
      quotationId: params.quotationId,
      clientId: params.clientId,
      timeSlotId: params.timeSlotId,
      scheduledDate: params.scheduledDate,
      status: AppointmentStatus.PendingPayment,
      createdAt: now,
      updatedAt: now,
    });
  }

  transitionTo(nextStatus: AppointmentStatus, now: Date = new Date()): Result<Appointment, string> {
    if (!isValidAppointmentTransition(this.status, nextStatus)) {
      return fail(
        `Invalid status transition: cannot move appointment from ${this.status} to ${nextStatus}`,
      );
    }

    return ok(
      new Appointment({
        ...this,
        status: nextStatus,
        updatedAt: now,
      }),
    );
  }

  assignTechnician(technicianId: string, now: Date = new Date()): Result<Appointment, string> {
    if (
      this.status === AppointmentStatus.Cancelled ||
      this.status === AppointmentStatus.Completed
    ) {
      return fail(`Cannot assign technician to an appointment with status ${this.status}`);
    }

    return ok(
      new Appointment({
        ...this,
        technicianId,
        updatedAt: now,
      }),
    );
  }
}
