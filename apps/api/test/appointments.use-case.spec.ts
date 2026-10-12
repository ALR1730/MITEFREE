import { describe, it, expect, beforeEach } from 'vitest';
import { ScheduleAppointmentUseCase } from '../src/application/appointments/schedule-appointment.use-case.js';
import { GetAppointmentUseCase } from '../src/application/appointments/get-appointment.use-case.js';
import { GetAvailableSlotsUseCase } from '../src/application/appointments/get-available-slots.use-case.js';
import { TransitionAppointmentStatusUseCase } from '../src/application/appointments/transition-status.use-case.js';
import { AssignTechnicianUseCase } from '../src/application/appointments/assign-technician.use-case.js';
import { LookupAppointmentsUseCase } from '../src/application/appointments/lookup-appointments.use-case.js';
import { DrizzleAppointmentRepository } from '../src/infrastructure/repositories/drizzle-appointment.repository.js';
import { DrizzleQuotationRepository } from '../src/infrastructure/repositories/drizzle-quotation.repository.js';
import {
  Quotation,
  QuotationItem,
  FabricType,
  StainSeverity,
  AppointmentStatus,
} from '@mitefree/domain-core';

describe('Appointments Use Cases (Unit Tests & Phase 3 Services)', () => {
  let appointmentRepo: DrizzleAppointmentRepository;
  let quotationRepo: DrizzleQuotationRepository;
  let scheduleUseCase: ScheduleAppointmentUseCase;
  let getAppointmentUseCase: GetAppointmentUseCase;
  let getSlotsUseCase: GetAvailableSlotsUseCase;
  let transitionUseCase: TransitionAppointmentStatusUseCase;
  let assignTechnicianUseCase: AssignTechnicianUseCase;
  let lookupUseCase: LookupAppointmentsUseCase;

  const validQuoteId = '11111111-1111-1111-1111-111111111111';
  const clientId = '22222222-2222-2222-2222-222222222222';

  beforeEach(async () => {
    appointmentRepo = new DrizzleAppointmentRepository(null);
    quotationRepo = new DrizzleQuotationRepository(null);

    // Guardar una cotización activa válida en memoria
    const item = QuotationItem.create({
      id: 'item-1',
      furnitureType: 'Sofá 3 Puestos',
      fabricType: FabricType.Synthetic,
      stainSeverity: StainSeverity.Light,
      basePriceAmount: 100,
    }).unwrap();

    const quotation = Quotation.create({
      id: validQuoteId,
      clientId,
      items: [item],
    }).unwrap();

    await quotationRepo.save(quotation);

    scheduleUseCase = new ScheduleAppointmentUseCase(appointmentRepo, quotationRepo);
    getAppointmentUseCase = new GetAppointmentUseCase(appointmentRepo);
    getSlotsUseCase = new GetAvailableSlotsUseCase(appointmentRepo);
    transitionUseCase = new TransitionAppointmentStatusUseCase(appointmentRepo);
    assignTechnicianUseCase = new AssignTechnicianUseCase(appointmentRepo);
    lookupUseCase = new LookupAppointmentsUseCase(appointmentRepo);
  });

  it('GivenValidQuotation_WhenSchedulingAppointment_ThenSucceedsAndSetsPendingPayment', async () => {
    const result = await scheduleUseCase.execute({
      quotationId: validQuoteId,
      clientId,
      timeSlotId: 'MORNING',
      scheduledDate: '2026-10-20T10:00:00Z',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.status).toBe(AppointmentStatus.PendingPayment);
    expect(result.value.timeSlotId).toBe('MORNING');
  });

  it('GivenNonExistentQuotation_WhenScheduling_ThenReturnsFailure', async () => {
    const result = await scheduleUseCase.execute({
      quotationId: '99999999-9999-9999-9999-999999999999',
      clientId,
      timeSlotId: 'MORNING',
      scheduledDate: '2026-10-20T10:00:00Z',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('does not exist');
  });

  it('GivenAvailableSlotsQuery_WhenNoBookings_ThenReturnsAll3SlotsAvailable', async () => {
    const result = await getSlotsUseCase.execute({
      zoneCode: 'ZONE-DN',
      date: '2026-10-20',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.length).toBe(3);
    expect(result.value.every((s) => s.isAvailable)).toBe(true);
    expect(result.value.every((s) => !s.hasRoutePromotion)).toBe(true);
  });

  it('GivenScheduledAppointment_WhenTransitioningToConfirmed_ThenUpdatesState', async () => {
    const created = (
      await scheduleUseCase.execute({
        quotationId: validQuoteId,
        clientId,
        timeSlotId: 'MORNING',
        scheduledDate: '2026-10-20T10:00:00Z',
      })
    ).value;

    const transitionResult = await transitionUseCase.execute({
      appointmentId: created.id,
      nextStatus: AppointmentStatus.Confirmed,
    });

    expect(transitionResult.isSuccess).toBe(true);
    expect(transitionResult.value.status).toBe(AppointmentStatus.Confirmed);
  });

  it('GivenConfirmedAppointment_WhenAssigningTechnician_ThenAssignsSuccessfully', async () => {
    const created = (
      await scheduleUseCase.execute({
        quotationId: validQuoteId,
        clientId,
        timeSlotId: 'MORNING',
        scheduledDate: '2026-10-20T10:00:00Z',
      })
    ).value;

    // Avanzamos a confirmado primero
    await transitionUseCase.execute({
      appointmentId: created.id,
      nextStatus: AppointmentStatus.Confirmed,
    });

    const assignResult = await assignTechnicianUseCase.execute({
      appointmentId: created.id,
      technicianId: '33333333-3333-3333-3333-333333333333',
    });

    expect(assignResult.isSuccess).toBe(true);
    expect(assignResult.value.technicianId).toBe('33333333-3333-3333-3333-333333333333');
  });

  it('GivenExistingAppointment_WhenRetrievingById_ThenReturnsDetails', async () => {
    const created = (
      await scheduleUseCase.execute({
        quotationId: validQuoteId,
        clientId,
        timeSlotId: 'AFTERNOON',
        scheduledDate: '2026-10-21T14:00:00Z',
      })
    ).value;

    const found = await getAppointmentUseCase.execute(created.id);
    expect(found.isSuccess).toBe(true);
    expect(found.value.id).toBe(created.id);
    expect(found.value.timeSlotId).toBe('AFTERNOON');
  });

  describe('LookupAppointmentsUseCase (Guest Tracking & Security)', () => {
    it('GivenDominicanPhone_WhenLookingUp_ThenNormalizesAndReturnsAppointments', async () => {
      // Creamos dos citas con teléfono dominicano con y sin prefijo internacional
      await scheduleUseCase.execute({
        quotationId: validQuoteId,
        clientId,
        timeSlotId: 'MORNING',
        scheduledDate: '2026-10-22T09:00:00Z',
        clientPhone: '+1 809-555-0188',
        clientName: 'Angel Rosario',
      });

      // Consultar sin prefijo +1 y con guiones
      const lookupResult = await lookupUseCase.execute({
        phone: '809-555-0188',
      });

      expect(lookupResult.isSuccess).toBe(true);
      expect(lookupResult.value.length).toBeGreaterThanOrEqual(1);
      expect(lookupResult.value[0].clientPhone).toContain('809-555-0188');
    });

    it('GivenAppointmentCodeWithHash_WhenLookingUp_ThenNormalizesAndFindsMatch', async () => {
      const created = (
        await scheduleUseCase.execute({
          quotationId: validQuoteId,
          clientId,
          timeSlotId: 'AFTERNOON',
          scheduledDate: '2026-10-23T14:00:00Z',
          clientPhone: '829-444-1234',
        })
      ).value;

      // Buscar por código con prefijo '#' y substring de 8 caracteres
      const shortCode = `#${created.id.substring(0, 8)}`;
      const result = await lookupUseCase.execute({ code: shortCode });

      expect(result.isSuccess).toBe(true);
      expect(result.value.length).toBe(1);
      expect(result.value[0].id).toBe(created.id);
    });

    it('GivenShortPhone_WhenLookingUp_ThenFailsValidation', async () => {
      const result = await lookupUseCase.execute({ phone: '123' });
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('al menos 7 dígitos');
    });

    it('GivenEmptyQuery_WhenLookingUp_ThenFailsValidation', async () => {
      const result = await lookupUseCase.execute({});
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('número de teléfono o código');
    });
  });
});
