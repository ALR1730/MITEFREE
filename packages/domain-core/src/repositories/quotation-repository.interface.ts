import { Quotation } from '../entities/quotation.entity.js';

export interface IQuotationRepository {
  findById(id: string): Promise<Quotation | null>;
  findByClientId(clientId: string): Promise<Quotation[]>;
  save(quotation: Quotation): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
}
