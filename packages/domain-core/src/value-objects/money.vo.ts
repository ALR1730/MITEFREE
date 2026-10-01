import { Result, ok, fail } from '../common/result.js';

export class Money {
  private readonly _cents: number;
  private readonly _currency: string;

  private constructor(cents: number, currency: string = 'USD') {
    this._cents = Math.round(cents);
    this._currency = currency.toUpperCase();
    Object.freeze(this);
  }

  get cents(): number {
    return this._cents;
  }

  get amount(): number {
    return this._cents / 100;
  }

  get currency(): string {
    return this._currency;
  }

  static create(amount: number, currency: string = 'USD'): Result<Money, string> {
    if (isNaN(amount) || !isFinite(amount)) {
      return fail('Money amount must be a finite number');
    }
    if (amount < 0) {
      return fail('Money amount cannot be negative');
    }
    const validCurrencies = ['USD', 'DOP', 'EUR'];
    if (!validCurrencies.includes(currency.toUpperCase())) {
      return fail(`Unsupported currency: ${currency}`);
    }
    return ok(new Money(amount * 100, currency));
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency);
  }

  add(other: Money): Result<Money, string> {
    if (this._currency !== other.currency) {
      return fail(`Currency mismatch: cannot add ${other.currency} to ${this._currency}`);
    }
    return ok(new Money(this._cents + other.cents, this._currency));
  }

  subtract(other: Money): Result<Money, string> {
    if (this._currency !== other.currency) {
      return fail(`Currency mismatch: cannot subtract ${other.currency} from ${this._currency}`);
    }
    const newCents = this._cents - other.cents;
    if (newCents < 0) {
      return fail('Resulting money amount cannot be negative');
    }
    return ok(new Money(newCents, this._currency));
  }

  multiply(factor: number): Result<Money, string> {
    if (factor < 0) {
      return fail('Factor cannot be negative');
    }
    return ok(new Money(this._cents * factor, this._currency));
  }

  percentage(rate: number): Result<Money, string> {
    if (rate < 0 || rate > 1) {
      return fail('Rate must be between 0.0 and 1.0');
    }
    return ok(new Money(this._cents * rate, this._currency));
  }

  equals(other: Money): boolean {
    return this._cents === other.cents && this._currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    return this._cents > other.cents;
  }

  isLessThan(other: Money): boolean {
    return this._cents < other.cents;
  }

  isZero(): boolean {
    return this._cents === 0;
  }

  format(): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: this._currency,
    }).format(this.amount);
  }
}
