import { describe, it, expect } from 'vitest';
import {
  RouteOptimizationEngine,
  type ExistingAppointmentBooking,
  type ProposedBooking,
} from '../src/engines/route-optimization.engine.js';
import { ZoneCode } from '../src/enums/zone-code.enum.js';
import { TimeSlotCode } from '../src/enums/time-slot-code.enum.js';
import { GeoCoordinate } from '../src/value-objects/geo-coordinate.vo.js';

describe('RouteOptimizationEngine — TDD Suite (≥95% Cobertura)', () => {
  const sampleDate = new Date('2026-10-15T10:00:00Z');
  const otherDate = new Date('2026-10-16T10:00:00Z');

  // 1. Invariante Anti-Double Booking
  it('01: GivenSameTechnicianAndSameSlotAndSameDate_WhenValidated_ThenDetectsConflict', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const proposed: ProposedBooking = {
      technicianId: 'tech-101',
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Morning,
      scheduledDate: sampleDate,
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('already has an active appointment');
  });

  it('02: GivenSameTechnicianDifferentSlot_WhenValidated_ThenAllowsBooking', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const proposed: ProposedBooking = {
      technicianId: 'tech-101',
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Afternoon, // Diferente bloque
      scheduledDate: sampleDate,
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isSuccess).toBe(true);
  });

  it('03: GivenSameTechnicianDifferentDate_WhenValidated_ThenAllowsBooking', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const proposed: ProposedBooking = {
      technicianId: 'tech-101',
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Morning,
      scheduledDate: otherDate, // Diferente fecha
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isSuccess).toBe(true);
  });

  it('04: GivenDifferentTechnicianSameSlotAndDate_WhenValidated_ThenAllowsBooking', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const proposed: ProposedBooking = {
      technicianId: 'tech-202', // Cuadrilla distinta
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Morning,
      scheduledDate: sampleDate,
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isSuccess).toBe(true);
  });

  it('05: GivenExistingCancelledAppointment_WhenValidated_ThenDoesNotBlockSlot', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Cancelled', // Cancelada
      },
    ];

    const proposed: ProposedBooking = {
      technicianId: 'tech-101',
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Morning,
      scheduledDate: sampleDate,
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isSuccess).toBe(true);
  });

  it('06: GivenProposedWithoutTechnician_WhenValidated_ThenAllowsBooking', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const proposed: ProposedBooking = {
      zoneCode: ZoneCode.DistritoNacional,
      timeSlotCode: TimeSlotCode.Morning,
      scheduledDate: sampleDate,
    };

    const result = RouteOptimizationEngine.validateBookingConflict(proposed, existing);
    expect(result.isSuccess).toBe(true);
  });

  // 2. Detección de Descuento de Ruta (15% Route Promotion)
  it('07: GivenTechnicianConfirmedInZoneOnSameDate_WhenEvaluated_ThenApplies15PercentRouteDiscount', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.SantoDomingoEste,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const promo = RouteOptimizationEngine.evaluateRoutePromotion(
      ZoneCode.SantoDomingoEste,
      sampleDate,
      existing,
    );

    expect(promo.hasRoutePromotion).toBe(true);
    expect(promo.discountRate).toBe(0.15);
    expect(promo.matchedTechnicianId).toBe('tech-101');
    expect(promo.zoneCode).toBe(ZoneCode.SantoDomingoEste);
  });

  it('08: GivenTechnicianInDifferentZone_WhenEvaluated_ThenDoesNotApplyRouteDiscount', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.DistritoNacional, // Zona distinta
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const promo = RouteOptimizationEngine.evaluateRoutePromotion(
      ZoneCode.SantoDomingoEste,
      sampleDate,
      existing,
    );

    expect(promo.hasRoutePromotion).toBe(false);
    expect(promo.discountRate).toBe(0.0);
  });

  it('09: GivenTechnicianInSameZoneDifferentDate_WhenEvaluated_ThenDoesNotApplyRouteDiscount', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.SantoDomingoEste,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: otherDate, // Fecha distinta
        status: 'Confirmed',
      },
    ];

    const promo = RouteOptimizationEngine.evaluateRoutePromotion(
      ZoneCode.SantoDomingoEste,
      sampleDate,
      existing,
    );

    expect(promo.hasRoutePromotion).toBe(false);
    expect(promo.discountRate).toBe(0.0);
  });

  it('10: GivenOnlyPendingPaymentAppointment_WhenEvaluated_ThenDoesNotTriggerRouteDiscount', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-101',
        zoneCode: ZoneCode.SantoDomingoEste,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'PendingPayment', // No confirmada aún
      },
    ];

    const promo = RouteOptimizationEngine.evaluateRoutePromotion(
      ZoneCode.SantoDomingoEste,
      sampleDate,
      existing,
    );

    expect(promo.hasRoutePromotion).toBe(false);
  });

  // 3. Factibilidad Geoespacial de Desplazamiento
  it('11: GivenCoordinatesWithin25Km_WhenEvaluatingCommute_ThenMarksFeasible', () => {
    // Piantini (DN) -> Naco (DN) aprox ~1.5 km
    const piantini = GeoCoordinate.create(18.4721, -69.9324, 'ZONE-DN').unwrap();
    const naco = GeoCoordinate.create(18.4756, -69.9238, 'ZONE-DN').unwrap();

    const feasibility = RouteOptimizationEngine.evaluateCommute(piantini, naco);

    expect(feasibility.isFeasible).toBe(true);
    expect(feasibility.distanceKm).toBeLessThan(5);
    expect(feasibility.estimatedTransitMinutes).toBeGreaterThan(0);
  });

  it('12: GivenCoordinatesExceedingMaxDistance_WhenEvaluatingCommute_ThenMarksNotFeasible', () => {
    // Santo Domingo -> San Cristóbal aprox ~30 km
    const sd = GeoCoordinate.create(18.4861, -69.9312, 'ZONE-DN').unwrap();
    const sc = GeoCoordinate.create(18.4167, -70.1064, 'ZONE-SC').unwrap();

    const feasibility = RouteOptimizationEngine.evaluateCommute(sd, sc, 20); // max 20km

    expect(feasibility.isFeasible).toBe(false);
    expect(feasibility.distanceKm).toBeGreaterThan(20);
  });

  // 4. Evaluación de Disponibilidad de Bloques Diarios (Fleet Slots)
  it('13: GivenEmptyFleetBookings_WhenEvaluatingDailySlots_ThenAllSlotsAvailableWithoutPromo', () => {
    const slots = RouteOptimizationEngine.evaluateDailySlots(
      ZoneCode.DistritoNacional,
      sampleDate,
      [],
      2,
    );

    expect(slots.length).toBe(3);
    expect(slots.every((s) => s.isAvailable)).toBe(true);
    expect(slots.every((s) => !s.hasRoutePromotion)).toBe(true);
  });

  it('14: GivenFullCapacityInMorningSlot_WhenEvaluatingDailySlots_ThenMorningIsUnavailable', () => {
    const existing: ExistingAppointmentBooking[] = [
      {
        id: 'apt-1',
        technicianId: 'tech-1',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
      {
        id: 'apt-2',
        technicianId: 'tech-2',
        zoneCode: ZoneCode.DistritoNacional,
        timeSlotCode: TimeSlotCode.Morning,
        scheduledDate: sampleDate,
        status: 'Confirmed',
      },
    ];

    const slots = RouteOptimizationEngine.evaluateDailySlots(
      ZoneCode.DistritoNacional,
      sampleDate,
      existing,
      2, // Capacidad = 2
    );

    const morning = slots.find((s) => s.timeSlotCode === TimeSlotCode.Morning)!;
    const afternoon = slots.find((s) => s.timeSlotCode === TimeSlotCode.Afternoon)!;

    expect(morning.isAvailable).toBe(false);
    expect(afternoon.isAvailable).toBe(true);
    // Como hay técnicos confirmados en la misma zona y fecha, la tarde tiene promoción de ruta
    expect(afternoon.hasRoutePromotion).toBe(true);
    expect(afternoon.promotionDiscountRate).toBe(0.15);
  });

  it('15: GivenDateKeyNormalization_WhenEvaluatingDateStrings_ThenFormatsCorrectly', () => {
    const d = new Date(Date.UTC(2026, 9, 15, 12, 0, 0)); // Octubre 15, 2026
    const key = RouteOptimizationEngine.toDateKey(d);
    expect(key).toBe('2026-10-15');
  });
});
