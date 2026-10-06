export enum TimeSlotCode {
  Morning = 'MORNING',
  Afternoon = 'AFTERNOON',
  Evening = 'EVENING',
}

export interface TimeSlotWindow {
  code: TimeSlotCode;
  startTime: string; // '08:30'
  endTime: string; // '11:30'
  label: string;
  durationHours: number;
}

export const CANONICAL_TIME_SLOTS: Record<TimeSlotCode, TimeSlotWindow> = {
  [TimeSlotCode.Morning]: {
    code: TimeSlotCode.Morning,
    startTime: '08:30',
    endTime: '11:30',
    label: 'Bloque Mañana (08:30 AM – 11:30 AM)',
    durationHours: 3,
  },
  [TimeSlotCode.Afternoon]: {
    code: TimeSlotCode.Afternoon,
    startTime: '13:00',
    endTime: '16:00',
    label: 'Bloque Tarde (01:00 PM – 04:00 PM)',
    durationHours: 3,
  },
  [TimeSlotCode.Evening]: {
    code: TimeSlotCode.Evening,
    startTime: '16:30',
    endTime: '19:30',
    label: 'Bloque Vespertino (04:30 PM – 07:30 PM)',
    durationHours: 3,
  },
};
