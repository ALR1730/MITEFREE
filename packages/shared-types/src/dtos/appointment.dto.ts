import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  quotationId: z.string().uuid('Quotation ID must be a valid UUID').optional().nullable(),
  clientId: z.string().uuid('Client ID must be a valid UUID').optional().nullable(),
  timeSlotId: z.string().min(1, 'TimeSlot is required'),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Scheduled date must be a valid ISO date string',
  }),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  address: z.string().optional(),
  zoneCode: z.string().optional(),
  serviceDescription: z.string().optional(),
  totalAmount: z.number().optional(),
  depositAmount: z.number().optional(),
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
  clientName?: string;
  clientPhone?: string;
  address?: string;
  zoneCode?: string;
  serviceDescription?: string;
  totalAmount?: number;
  depositAmount?: number;
  technicianId?: string | null;
  technicianName?: string | null;
  timeSlotId: string;
  timeSlotLabel?: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
