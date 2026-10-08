import { Result, ok, fail } from '../common/result.js';
import { ZoneCode } from '../enums/zone-code.enum.js';
import { TimeSlotCode, CANONICAL_TIME_SLOTS } from '../enums/time-slot-code.enum.js';
import { GeoCoordinate } from '../value-objects/geo-coordinate.vo.js';

export interface ExistingAppointmentBooking {
  id: string;
  technicianId?: string;
  zoneCode: ZoneCode;
  timeSlotCode: TimeSlotCode;
  scheduledDate: Date; // día
  status: string; // PendingPayment, Confirmed, EnRoute, InProgress, Completed, Cancelled
  coordinate?: GeoCoordinate;
}

export interface ProposedBooking {
  technicianId?: string;
  zoneCode: ZoneCode;
  timeSlotCode: TimeSlotCode;
  scheduledDate: Date;
  coordinate?: GeoCoordinate;
}

export interface RoutePromotionEvaluation {
  hasRoutePromotion: boolean;
  discountRate: number; // 0.15 (15%) si aplica, 0.0 de lo contrario
  matchedTechnicianId?: string;
  zoneCode: ZoneCode;
  dateKey: string;
}

export interface CommuteFeasibility {
  distanceKm: number;
  isFeasible: boolean;
  estimatedTransitMinutes: number;
}

export interface AvailableSlotEvaluation {
  timeSlotCode: TimeSlotCode;
  startTime: string;
  endTime: string;
  label: string;
  isAvailable: boolean;
  hasRoutePromotion: boolean;
  promotionDiscountRate: number;
  matchedTechnicianId?: string;
}

/**
 * RouteOptimizationEngine — Motor Algorítmico Puro de Agenda, Logística y Rutas
 *
 * Reglas de Negocio Inmutables:
 * 1. Anti-Double Booking: Un técnico no puede tener 2 citas activas en el mismo timeSlot y fecha.
 * 2. Citas canceladas no bloquean horarios.
 * 3. Promoción de Ruta (15% OFF): Si un técnico tiene una cita en la zona Z en la fecha D,
 *    los otros bloques libres en esa misma zona/fecha reciben 15% de descuento por agrupamiento.
 * 4. Umbral de Factibilidad Geoespacial: Máximo 25km de desplazamiento entre citas continuas.
 */
export class RouteOptimizationEngine {
  public static readonly CANONICAL_ROUTE_DISCOUNT = 0.15; // 15%
  public static readonly MAX_COMMUTE_DISTANCE_KM = 25.0; // 25 km
  public static readonly AVERAGE_SPEED_KMH = 30.0; // 30 km/h en tráfico urbano

  /**
   * Normaliza una fecha a formato YYYY-MM-DD para comparaciones de día calendario
   */
  public static toDateKey(date: Date): string {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Valida invariante Anti-Double Booking para una propuesta de cita
   */
  public static validateBookingConflict(
    proposed: ProposedBooking,
    existingList: ExistingAppointmentBooking[],
  ): Result<boolean, string> {
    const proposedDateKey = this.toDateKey(proposed.scheduledDate);

    for (const existing of existingList) {
      // Ignorar citas canceladas
      if (existing.status.toLowerCase() === 'cancelled') {
        continue;
      }

      const existingDateKey = this.toDateKey(existing.scheduledDate);
      if (existingDateKey !== proposedDateKey) {
        continue;
      }

      if (existing.timeSlotCode !== proposed.timeSlotCode) {
        continue;
      }

      // Si ambos tienen el mismo técnico asignado en el mismo bloque y fecha -> Conflicto estricto
      if (
        proposed.technicianId &&
        existing.technicianId &&
        proposed.technicianId === existing.technicianId
      ) {
        return fail(
          `Technician ${proposed.technicianId} already has an active appointment in slot ${proposed.timeSlotCode} on date ${proposedDateKey}`,
        );
      }
    }

    return ok(true);
  }

  /**
   * Evalúa si una zona y fecha califican para Promoción de Ruta (15% OFF)
   */
  public static evaluateRoutePromotion(
    targetZone: ZoneCode,
    targetDate: Date,
    activeBookings: ExistingAppointmentBooking[],
  ): RoutePromotionEvaluation {
    const targetDateKey = this.toDateKey(targetDate);

    // Buscar si algún técnico ya tiene cita confirmada en esta misma zona y fecha
    const clusterMatch = activeBookings.find((b) => {
      const isDateMatch = this.toDateKey(b.scheduledDate) === targetDateKey;
      const isZoneMatch = b.zoneCode === targetZone;
      const isActive =
        b.status.toLowerCase() !== 'cancelled' && b.status.toLowerCase() !== 'pendingpayment';
      return isDateMatch && isZoneMatch && isActive && Boolean(b.technicianId);
    });

    if (clusterMatch) {
      return {
        hasRoutePromotion: true,
        discountRate: this.CANONICAL_ROUTE_DISCOUNT,
        matchedTechnicianId: clusterMatch.technicianId,
        zoneCode: targetZone,
        dateKey: targetDateKey,
      };
    }

    return {
      hasRoutePromotion: false,
      discountRate: 0.0,
      zoneCode: targetZone,
      dateKey: targetDateKey,
    };
  }

  /**
   * Evalúa la factibilidad de tránsito y distancia entre dos servicios
   */
  public static evaluateCommute(
    fromCoord: GeoCoordinate,
    toCoord: GeoCoordinate,
    maxDistanceKm: number = this.MAX_COMMUTE_DISTANCE_KM,
  ): CommuteFeasibility {
    const distanceKm = Math.round(fromCoord.distanceToInKm(toCoord) * 100) / 100;
    const isFeasible = distanceKm <= maxDistanceKm;
    const transitHours = distanceKm / this.AVERAGE_SPEED_KMH;
    const estimatedTransitMinutes = Math.round(transitHours * 60);

    return {
      distanceKm,
      isFeasible,
      estimatedTransitMinutes,
    };
  }

  /**
   * Evalúa la disponibilidad de los bloques horarios para una zona y fecha,
   * calculando automáticamente promociones de ruta
   */
  public static evaluateDailySlots(
    zoneCode: ZoneCode,
    date: Date,
    existingBookings: ExistingAppointmentBooking[],
    fleetCapacityPerSlot: number = 2, // Número de cuadrillas disponibles por bloque
  ): AvailableSlotEvaluation[] {
    const dateKey = this.toDateKey(date);
    const promo = this.evaluateRoutePromotion(zoneCode, date, existingBookings);

    const slotCodes: TimeSlotCode[] = [
      TimeSlotCode.Morning,
      TimeSlotCode.Afternoon,
      TimeSlotCode.Evening,
    ];

    return slotCodes.map((code) => {
      const window = CANONICAL_TIME_SLOTS[code];

      // Contar citas activas en este slot y fecha
      const activeInSlot = existingBookings.filter((b) => {
        return (
          this.toDateKey(b.scheduledDate) === dateKey &&
          b.timeSlotCode === code &&
          b.status.toLowerCase() !== 'cancelled'
        );
      });

      const isAvailable = activeInSlot.length < fleetCapacityPerSlot;

      return {
        timeSlotCode: code,
        startTime: window.startTime,
        endTime: window.endTime,
        label: window.label,
        isAvailable,
        hasRoutePromotion: isAvailable && promo.hasRoutePromotion,
        promotionDiscountRate: isAvailable && promo.hasRoutePromotion ? promo.discountRate : 0.0,
        matchedTechnicianId: promo.matchedTechnicianId,
      };
    });
  }
}
