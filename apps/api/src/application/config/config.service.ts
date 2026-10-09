import { Injectable } from '@nestjs/common';
import {
  DEFAULT_DISCOUNT_POLICY,
  type DiscountPolicyConfig,
} from '@mitefree/shared-types';

@Injectable()
export class ConfigService {
  private currentPolicy: DiscountPolicyConfig = JSON.parse(
    JSON.stringify(DEFAULT_DISCOUNT_POLICY),
  );

  getDiscountPolicy(): DiscountPolicyConfig {
    return this.currentPolicy;
  }

  updateDiscountPolicy(policy: DiscountPolicyConfig): DiscountPolicyConfig {
    this.currentPolicy = policy;
    return this.currentPolicy;
  }
}
