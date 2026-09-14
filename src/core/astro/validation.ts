import type { EclipticPosition } from './ephemeris';

export type ValidationStatus = 'not-validated' | 'validated';

export interface ValidationRecord {
  provider: string;
  reference: string;
  status: ValidationStatus;
  maxAngularErrorArcsec?: number;
  notes: string[];
}

/**
 * Registry for measured comparison against an authoritative reference.
 * No numerical claim is made unless a reproducible benchmark populates it.
 */
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

export function validateLongitude(
  actual: EclipticPosition,
  expected: EclipticPosition,
): number {
  return angularSeparationArcsec(actual.longitudeDeg, expected.longitudeDeg);
}

export function emptyValidationRecord(provider: string, reference: string): ValidationRecord {
  return {
    provider,
    reference,
    status: 'not-validated',
    notes: ['Populate only from a reproducible benchmark against the named reference.'],
  };
}
