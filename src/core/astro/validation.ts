import type { EclipticPosition } from './ephemeris';

export type ValidationStatus = 'not-validated' | 'validated';

export interface ValidationRecord {
  provider: string;
  reference: string;
  status: ValidationStatus;
  maxAngularErrorArcsec?: number;
  notes: string[];
}

export interface EphemerisBenchmarkCase {
  date: string;
  expected: EclipticPosition;
  actual: EclipticPosition;
}

export function angularSeparationArcsec(aDeg: number, bDeg: number): number {
  let delta = Math.abs(aDeg - bDeg) % 360;
  if (delta > 180) delta = 360 - delta;
  return delta * 3600;
}

export function validateLongitude(actual: EclipticPosition, expected: EclipticPosition): number {
  if (actual.body !== expected.body) throw new Error(`Cannot compare ${actual.body} with ${expected.body}.`);
  return angularSeparationArcsec(actual.longitudeDeg, expected.longitudeDeg);
}

export function summarizeLongitudeErrors(cases: readonly EphemerisBenchmarkCase[]) {
  if (!cases.length) throw new Error('At least one benchmark case is required.');
  const errors = cases.map((item) => validateLongitude(item.actual, item.expected));
  return {
    samples: errors.length,
    meanArcsec: errors.reduce((sum, value) => sum + value, 0) / errors.length,
    maxArcsec: Math.max(...errors),
  };
}

export function emptyValidationRecord(provider: string, reference: string): ValidationRecord {
  return {
    provider,
    reference,
    status: 'not-validated',
    notes: ['Populate only from a reproducible benchmark against the named reference.'],
  };
}
