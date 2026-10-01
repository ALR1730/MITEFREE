import { describe, it, expect } from 'vitest';
import { HealthController } from '../src/presentation/controllers/health.controller.js';

describe('HealthController (Unit Tests)', () => {
  it('WhenCallingCheck_ThenReturnsHealthyStatusAndMetadata', () => {
    const controller = new HealthController();
    const response = controller.check();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('MITEFREE Core API');
    expect(response.version).toBe('1.0.0');
    expect(response.organization).toBe('ALR COMPANY');
    expect(typeof response.timestamp).toBe('string');
    expect(typeof response.uptimeSeconds).toBe('number');
  });
});
