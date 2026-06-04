import type { CategoryDefinition } from './types';

export function convertValue(category: CategoryDefinition, from: string, to: string, value: number): number {
  const fromDef = category.units[from];
  const toDef = category.units[to];

  if (!fromDef || !toDef || !Number.isFinite(value)) {
    return Number.NaN;
  }

  return toDef.fromBase(fromDef.toBase(value));
}

export function formatNumber(value: number, decimals: number, scientific: boolean): string {
  if (!Number.isFinite(value)) {
    return '-';
  }

  if (scientific) {
    return value.toExponential(Math.max(0, decimals));
  }

  return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function decimalHoursToClock(decimalHours: number): string {
  if (!Number.isFinite(decimalHours)) {
    return '-';
  }

  const sign = decimalHours < 0 ? '-' : '';
  let totalSeconds = Math.round(Math.abs(decimalHours) * 3600);
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds -= days * 86400;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds -= hours * 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return days > 0 ? `${sign}${days}d ${hh}:${mm}:${ss}` : `${sign}${hh}:${mm}:${ss}`;
}

export function clockToDecimalHours(input: string): number {
  const trimmed = input.trim();
  const sign = trimmed.startsWith('-') ? -1 : 1;
  const clean = trimmed.replace(/^[+-]/, '');

  const dayMatch = clean.match(/^(\d+)d\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/i);
  if (dayMatch) {
    const days = Number(dayMatch[1]);
    const h = Number(dayMatch[2]);
    const m = Number(dayMatch[3]);
    const s = Number(dayMatch[4] ?? '0');
    return sign * (days * 24 + h + m / 60 + s / 3600);
  }

  const match = clean.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (!match) {
    return Number.NaN;
  }

  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3] ?? '0');

  return sign * (h + m / 60 + s / 3600);
}

export function parseNaturalQuery(input: string): { value: number; from: string; to: string } | null {
  const normalized = input.toLowerCase().trim();
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s+([a-z/]+)\s+(?:in|to)\s+([a-z/]+)$/i);
  if (!match) {
    return null;
  }

  return {
    value: Number(match[1]),
    from: match[2],
    to: match[3]
  };
}
