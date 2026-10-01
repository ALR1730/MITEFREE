import { Result, ok, fail } from '../common/result.js';

export class PhoneNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  static create(raw: string): Result<PhoneNumber, string> {
    if (!raw) {
      return fail('Phone number cannot be empty');
    }
    // Clean spaces, hyphens and parenthesis
    const cleaned = raw.replace(/[\s\-()]/g, '');
    // Standard E.164 pattern (+ followed by 10-15 digits, or local 10 digits)
    const e164Regex = /^\+?[1-9]\d{9,14}$/;
    if (!e164Regex.test(cleaned)) {
      return fail(`Invalid phone number format: ${raw}. Expected E.164 (e.g. +18095551234)`);
    }
    const formatted = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    return ok(new PhoneNumber(formatted));
  }

  format(): string {
    return this._value;
  }
}
