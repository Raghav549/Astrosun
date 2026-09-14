import { angularSeparationDeg } from './angles';
import { eclipticPositions } from './ephemeris';

export type EclipseKind = 'solar-candidate' | 'lunar-candidate';

export interface EclipseCandidate {
  kind: EclipseKind;
  date: Date;
  separationDeg: number;
  accuracy: 'approximate';
}

/**
 * Finds a close Sun/Moon angular approach. This is a candidate detector only:
 * true eclipse contact, magnitude and local visibility require higher-fidelity
 * ephemerides, lunar latitude and observer-specific geometry.
 */
export function eclipseCandidate(date: Date, thresholdDeg = 1.5): EclipseCandidate | null {
  const positions = eclipticPositions(date);
  const separation = angularSeparationDeg(positions.sun.longitudeDeg, positions.moon.longitudeDeg);
  if (separation > thresholdDeg) return null;
  const kind: EclipseKind = separation < 0.5 ? 'solar-candidate' : 'lunar-candidate';
  return { kind, date: new Date(date), separationDeg: separation, accuracy: 'approximate' };
}
