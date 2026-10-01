import { Result, ok, fail } from '../common/result.js';

export class EmailAddress {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  static create(raw: string): Result<EmailAddress, string> {
    if (!raw) {
      return fail('Email address cannot be empty');
    }
    const trimmed = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return fail(`Invalid email address: ${raw}`);
    }
    return ok(new EmailAddress(trimmed));
  }
}
