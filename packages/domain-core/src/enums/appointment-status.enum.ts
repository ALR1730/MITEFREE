export enum AppointmentStatus {
  PendingPayment = 'PendingPayment',
  Confirmed = 'Confirmed',
  EnRoute = 'EnRoute',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Rescheduled = 'Rescheduled',
}

export const isValidAppointmentTransition = (
  current: AppointmentStatus,
  next: AppointmentStatus,
): boolean => {
  const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.PendingPayment]: [
      AppointmentStatus.Confirmed,
      AppointmentStatus.Cancelled,
    ],
    [AppointmentStatus.Confirmed]: [
      AppointmentStatus.EnRoute,
      AppointmentStatus.Rescheduled,
      AppointmentStatus.Cancelled,
    ],
    [AppointmentStatus.EnRoute]: [
      AppointmentStatus.InProgress,
      AppointmentStatus.Cancelled,
    ],
    [AppointmentStatus.InProgress]: [
      AppointmentStatus.Completed,
      AppointmentStatus.Cancelled,
    ],
    [AppointmentStatus.Completed]: [],
    [AppointmentStatus.Cancelled]: [],
    [AppointmentStatus.Rescheduled]: [
      AppointmentStatus.Confirmed,
      AppointmentStatus.Cancelled,
    ],
  };

  return allowedTransitions[current].includes(next);
};
