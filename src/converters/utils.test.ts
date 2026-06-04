import { describe, expect, it } from 'vitest';
import { clockToDecimalHours, decimalHoursToClock } from './utils';
import { converterCatalog } from './catalog';
import { convertValue } from './utils';

describe('time helpers', () => {
  it('converts decimal hours to clock', () => {
    expect(decimalHoursToClock(1.5)).toBe('01:30:00');
  });

  it('converts clock to decimal hours', () => {
    expect(clockToDecimalHours('02:30:00')).toBeCloseTo(2.5, 6);
  });
});

describe('conversion engine', () => {
  it('handles weight conversion', () => {
    const value = convertValue(converterCatalog.weight, 'lb', 'kg', 10);
    expect(value).toBeCloseTo(4.5359237, 6);
  });

  it('keeps round-trip close for linear units', () => {
    const toMetric = convertValue(converterCatalog.length, 'mi', 'km', 4.2);
    const back = convertValue(converterCatalog.length, 'km', 'mi', toMetric);
    expect(back).toBeCloseTo(4.2, 6);
  });
});
