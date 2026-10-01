import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  quotationId: z.string().uuid('Quotation ID must be a valid UUID'),
  clientId: z.string().uuid('Client ID must be a valid UUID'),
  timeSlotId: z.string().uuid('TimeSlot ID must be a valid UUID'),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Scheduled date must be a valid ISO date string',
  }),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;

export interface TimeSlotDto {
  id: string;
  code: string;
  startTime: string;
  endTime: string;
  zoneCode: string;
}

export interface AppointmentResponseDto {
  id: string;
  quotationId: string;
  clientId: string;
  technicianId?: string | null;
  timeSlotId: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
