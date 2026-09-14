import { angularSeparationDeg } from './angles';
import { eclipticPositions } from './ephemeris';

export type EclipseKind = 'solar-candidate' | 'lunar-candidate';

export interface EclipseCandidate {
  kind: EclipseKind;
  date: Date;
  phaseSeparationDeg: number;
  accuracy: 'approximate';
}

/**
 * Candidate detector only. A solar candidate is near new moon (0° elongation);
 * a lunar candidate is near full moon (180° elongation). True eclipse contact,
 * magnitude and local visibility require lunar latitude, shadow geometry,
 * higher-fidelity ephemerides and an observer model.
 */
export function eclipseCandidate(date: Date, thresholdDeg = 1.5): EclipseCandidate | null {
  const positions = eclipticPositions(date);
  const raw = ((positions.moon.longitudeDeg - positions.sun.longitudeDeg) % 360 + 360) % 360;
  const distanceFromNew = angularSeparationDeg(positions.sun.longitudeDeg, positions.moon.longitudeDeg);
  const distanceFromFull = Math.abs(raw - 180);
  if (Math.min(distanceFromNew, distanceFromFull) > thresholdDeg) return null;
  const kind: EclipseKind = distanceFromNew <= distanceFromFull ? 'solar-candidate' : 'lunar-candidate';
  return { kind, date: new Date(date), phaseSeparationDeg: kind === 'solar-candidate' ? distanceFromNew : distanceFromFull, accuracy: 'approximate' };
}
