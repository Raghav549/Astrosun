import type { AccuracyClass, EvidenceTier } from './quality';
import type { ValidationRecord } from './validation';

export interface ScientificClaim {
  id: string;
  statement: string;
  evidenceTier: EvidenceTier;
  accuracy: AccuracyClass;
  validation?: ValidationRecord;
}

/** Central registry shape for claims exposed by product surfaces. */
export const approximateCoreClaims: ScientificClaim[] = [
  {
    id: 'sun-moon-analytic-baseline',
    statement: 'Solar and lunar positions are available from deterministic analytical approximations.',
    evidenceTier: 'analytical',
    accuracy: 'approximate',
  },
  {
    id: 'panchanga-geometric-baseline',
    statement: 'Tithi, Nakshatra, Yoga and Karana geometric ingredients can be derived from the baseline model.',
    evidenceTier: 'analytical',
    accuracy: 'approximate',
  },
  {
    id: 'topocentric-boundary',
    statement: 'Observer-site context is modelled explicitly but is not yet a validated high-precision topocentric solution.',
    evidenceTier: 'analytical',
    accuracy: 'approximate',
  },
];
