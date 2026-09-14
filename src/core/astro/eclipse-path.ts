/** Local solar-eclipse path geometry from a validated apparent Sun/Moon state provider. */
import { angularDistance } from './angles';
import { angularRadiusDeg } from './eclipse-geometry';

export interface ApparentLimbState {
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceKm: number;
  radiusKm: number;
}

export interface EclipseContactSet {
  candidate: boolean;
  class: 'none' | 'partial' | 'total' | 'annular';
  centerSeparationDeg: number;
  sunAngularRadiusDeg: number;
  moonAngularRadiusDeg: number;
  contacts?: readonly ['C1', 'C2', 'C3', 'C4'];
  pathWidthKm?: number;
}

/**
 * Classifies the apparent disk overlap. Full global path requires a time-varying
 * observer grid plus Earth orientation; this module exposes the reusable local
 * limb geometry without pretending it is a Besselian-elements implementation.
 */
export function solarEclipseContacts(sun: ApparentLimbState, moon: ApparentLimbState): EclipseContactSet {
  const separation = angularDistance(sun.rightAscensionDeg, moon.rightAscensionDeg);
  const sunRadius = angularRadiusDeg(sun.radiusKm, sun.distanceKm);
  const moonRadius = angularRadiusDeg(moon.radiusKm, moon.distanceKm);
  const sum = sunRadius + moonRadius;
  const difference = Math.abs(sunRadius - moonRadius);
  if (separation >= sum) return { candidate: false, class: 'none', centerSeparationDeg: separation, sunAngularRadiusDeg: sunRadius, moonAngularRadiusDeg: moonRadius };
  const cls = separation > difference ? 'partial' : (moonRadius >= sunRadius ? 'total' : 'annular');
  return {
    candidate: true,
    class: cls,
    centerSeparationDeg: separation,
    sunAngularRadiusDeg: sunRadius,
    moonAngularRadiusDeg: moonRadius,
    contacts: ['C1', 'C2', 'C3', 'C4'],
  };
}
