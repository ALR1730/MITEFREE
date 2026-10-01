import { describe, it, expect } from 'vitest';
import { Appointment } from '../src/entities/appointment.entity.js';
import { AppointmentStatus } from '../src/enums/appointment-status.enum.js';

describe('Appointment Entity (Unit Tests)', () => {
  const sampleAppointment = Appointment.create({
    id: 'apt-001',
    quotationId: 'quot-001',
    clientId: 'client-001',
    timeSlotId: 'slot-morning',
    scheduledDate: new Date('2026-10-05T08:30:00Z'),
  });

  it('GivenNewAppointment_WhenCreated_ThenInitializesWithPendingPaymentStatus', () => {
    expect(sampleAppointment.status).toBe(AppointmentStatus.PendingPayment);
    expect(sampleAppointment.id).toBe('apt-001');
    expect(sampleAppointment.technicianId).toBeUndefined();
  });

  it('GivenPendingPaymentAppointment_WhenTransitioningToConfirmed_ThenSucceeds', () => {
    const confirmedRes = sampleAppointment.transitionTo(AppointmentStatus.Confirmed);
    expect(confirmedRes.isSuccess).toBe(true);
    expect(confirmedRes.value.status).toBe(AppointmentStatus.Confirmed);
  });

  it('GivenPendingPaymentAppointment_WhenTransitioningDirectlyToCompleted_ThenFailsWithInvalidTransition', () => {
    const invalidRes = sampleAppointment.transitionTo(AppointmentStatus.Completed);
    expect(invalidRes.isFailure).toBe(true);
    expect(invalidRes.error).toContain('Invalid status transition');
  });

  it('GivenConfirmedAppointment_WhenAssigningTechnician_ThenUpdatesTechnicianId', () => {
    const confirmed = sampleAppointment.transitionTo(AppointmentStatus.Confirmed).value;
    const assignedRes = confirmed.assignTechnician('tech-kelvin-rosario');

    expect(assignedRes.isSuccess).toBe(true);
    expect(assignedRes.value.technicianId).toBe('tech-kelvin-rosario');
  });

  it('GivenCancelledAppointment_WhenAssigningTechnician_ThenRejectsAssignment', () => {
    const cancelled = sampleAppointment.transitionTo(AppointmentStatus.Cancelled).value;
    const assignedRes = cancelled.assignTechnician('tech-kelvin-rosario');

    expect(assignedRes.isFailure).toBe(true);
    expect(assignedRes.error).toContain(
      'Cannot assign technician to an appointment with status Cancelled',
    );
  });
});
