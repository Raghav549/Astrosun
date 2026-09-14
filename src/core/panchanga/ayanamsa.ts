/**
 * Sidereal/Vedic coordinate boundary.
 *
 * This currently implements a clearly-labelled Lahiri-style approximation so
 * consumers can request sidereal output without silently mixing tropical and
 * sidereal longitudes. A future high-precision IAU/empirical ayanamsa provider
 * can replace the approximation behind the same interface.
 */

export type AyanamsaSystem = 'lahiri-approximate';

export interface AyanamsaResult {
  system: AyanamsaSystem;
  jd: number;
  degrees: number;
  accuracy: 'approximate';
}

/** Approximate Lahiri ayanamsa in degrees near modern epochs. */
export function lahiriApproximate(jd: number): AyanamsaResult {
  const T = (jd - 2451545.0) / 36525;
  // Compact polynomial baseline centered at J2000.
  const degrees = 23.85675 + 0.013968055 * T;
  return { system: 'lahiri-approximate', jd, degrees, accuracy: 'approximate' };
}

export function tropicalToSidereal(longitudeDeg: number, jd: number): number {
  const ayanamsa = lahiriApproximate(jd).degrees;
  return ((longitudeDeg - ayanamsa) % 360 + 360) % 360;
}

export function siderealToTropical(longitudeDeg: number, jd: number): number {
  const ayanamsa = lahiriApproximate(jd).degrees;
  return ((longitudeDeg + ayanamsa) % 360 + 360) % 360;
}
