import { Payment } from '../entities/payment.entity.js';

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null>;
  findByAppointmentId(appointmentId: string): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
}
