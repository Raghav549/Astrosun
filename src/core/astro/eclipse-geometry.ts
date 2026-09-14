/** Eclipse geometry from angular/radial Sun-Moon-Earth constraints. */
import { DEG, angularDistance } from './angles';

export interface EclipseGeometryInput {
  sunAngularRadiusDeg: number;
  moonAngularRadiusDeg: number;
  centerSeparationDeg: number;
  observerDistanceEarthRadii: number;
}

export type EclipseClass = 'none' | 'partial' | 'total-or-annular-candidate';

export interface EclipseGeometryResult {
  class: EclipseClass;
  overlapDeg: number;
  centerlineDistanceDeg: number;
  normalizedOverlap: number;
}

export function classifySolarEclipse(input: EclipseGeometryInput): EclipseGeometryResult {
  const sum = input.sunAngularRadiusDeg + input.moonAngularRadiusDeg;
  const delta = input.sunAngularRadiusDeg - input.moonAngularRadiusDeg;
  const separation = angularDistance(input.centerSeparationDeg, 0);
  if (separation >= sum) return { class: 'none', overlapDeg: 0, centerlineDistanceDeg: separation, normalizedOverlap: 0 };
  const overlap = Math.max(0, sum - separation);
  const normalized = Math.max(0, Math.min(1, overlap / Math.max(sum, Number.EPSILON)));
  return {
    class: separation <= Math.abs(delta) ? 'total-or-annular-candidate' : 'partial',
    overlapDeg: overlap,
    centerlineDistanceDeg: separation,
    normalizedOverlap: normalized,
  };
}

export function angularRadiusDeg(radiusKm: number, distanceKm: number): number {
  if (radiusKm <= 0 || distanceKm <= 0) throw new RangeError('radius and distance must be positive');
  return Math.asin(Math.min(1, radiusKm / distanceKm)) / DEG;
}
