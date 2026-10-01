import { describe, it, expect } from 'vitest';
import { Money } from '../src/value-objects/money.vo.js';

describe('Money Value Object', () => {
  it('GivenValidAmount_WhenCreated_ThenContainsCorrectCentsAndCurrency', () => {
    const moneyRes = Money.create(150.5, 'USD');
    expect(moneyRes.isSuccess).toBe(true);
    if (moneyRes.isSuccess) {
      expect(moneyRes.value.cents).toBe(15050);
      expect(moneyRes.value.amount).toBe(150.5);
      expect(moneyRes.value.currency).toBe('USD');
    }
  });

  it('GivenNegativeAmount_WhenCreated_ThenReturnsFailure', () => {
    const moneyRes = Money.create(-10, 'USD');
    expect(moneyRes.isFailure).toBe(true);
  });

  it('GivenTwoMoneyObjects_WhenAdded_ThenReturnsExactSum', () => {
    const m1 = Money.create(100.25).unwrap();
    const m2 = Money.create(50.75).unwrap();
    const sum = m1.add(m2).unwrap();
    expect(sum.amount).toBe(151);
  });

  it('GivenTwoDifferentCurrencies_WhenAdded_ThenReturnsFailure', () => {
    const m1 = Money.create(100, 'USD').unwrap();
    const m2 = Money.create(100, 'DOP').unwrap();
    const sumRes = m1.add(m2);
    expect(sumRes.isFailure).toBe(true);
  });

  it('GivenMoneyAmount_WhenPercentageCalculated_ThenReturnsPreciseDeposit', () => {
    const total = Money.create(300).unwrap();
    const deposit = total.percentage(0.3).unwrap(); // 30% anticipo
    expect(deposit.amount).toBe(90);
  });
});
