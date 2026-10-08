import { z } from 'zod';

export const ZoneCodeEnum = z.enum([
  'ZONE-DN',
  'ZONE-SDE',
  'ZONE-SDO',
  'ZONE-SDN',
  'ZONE-SPM',
  'ZONE-LR',
  'ZONE-C',
]);

export const TimeSlotCodeEnum = z.enum(['MORNING', 'AFTERNOON', 'EVENING']);

export const AppointmentStatusEnum = z.enum([
  'PendingPayment',
  'Confirmed',
  'EnRoute',
  'InProgress',
  'Completed',
  'Cancelled',
]);

export const GetAvailableSlotsQuerySchema = z.object({
  zoneCode: ZoneCodeEnum,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const TimeSlotAvailabilitySchema = z.object({
  timeSlotCode: TimeSlotCodeEnum,
  startTime: z.string(),
  endTime: z.string(),
  label: z.string(),
  isAvailable: z.boolean(),
  hasRoutePromotion: z.boolean(),
  promotionDiscountRate: z.number(),
  matchedTechnicianId: z.string().optional(),
});

export const ScheduleAppointmentRequestSchema = z.object({
  quotationId: z.string().uuid('Quotation ID must be a valid UUID'),
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  timeSlotCode: TimeSlotCodeEnum,
  zoneCode: ZoneCodeEnum,
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientPhone: z.string().min(8, 'Phone number must be at least 8 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  applyRouteDiscount: z.boolean().optional().default(false),
});

export const ScheduleAppointmentResponseSchema = z.object({
  id: z.string().uuid(),
  quotationId: z.string().uuid(),
  clientId: z.string().uuid(),
  technicianId: z.string().optional(),
  timeSlotCode: TimeSlotCodeEnum,
  zoneCode: ZoneCodeEnum,
  scheduledDate: z.string(),
  status: AppointmentStatusEnum,
  hasRouteDiscountApplied: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TransitionAppointmentStatusSchema = z.object({
  nextStatus: AppointmentStatusEnum,
});

export const AssignTechnicianSchema = z.object({
  technicianId: z.string().uuid('Technician ID must be a valid UUID'),
});

export type ZoneCodeType = z.infer<typeof ZoneCodeEnum>;
export type TimeSlotCodeType = z.infer<typeof TimeSlotCodeEnum>;
export type AppointmentStatusType = z.infer<typeof AppointmentStatusEnum>;
export type GetAvailableSlotsQueryDto = z.infer<typeof GetAvailableSlotsQuerySchema>;
export type TimeSlotAvailabilityDto = z.infer<typeof TimeSlotAvailabilitySchema>;
export type ScheduleAppointmentRequestDto = z.infer<typeof ScheduleAppointmentRequestSchema>;
export type ScheduleAppointmentResponseDto = z.infer<typeof ScheduleAppointmentResponseSchema>;
export type TransitionAppointmentStatusDto = z.infer<typeof TransitionAppointmentStatusSchema>;
export type AssignTechnicianDto = z.infer<typeof AssignTechnicianSchema>;
