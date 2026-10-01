import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockNotificationService {
  private readonly logger = new Logger(MockNotificationService.name);

  async sendAppointmentConfirmation(to: string, appointmentDetails: Record<string, unknown>): Promise<boolean> {
    this.logger.log(`Mock notification: Sent appointment confirmation to ${to}: ${JSON.stringify(appointmentDetails)}`);
    return true;
  }

  async sendQuotationEstimate(to: string, quotationDetails: Record<string, unknown>): Promise<boolean> {
    this.logger.log(`Mock notification: Sent quotation estimate to ${to}: ${JSON.stringify(quotationDetails)}`);
    return true;
  }
}
