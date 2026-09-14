/**
 * Deterministic solar/lunar ephemeris primitives.
 *
 * Accuracy is explicit: this file is an approximate fallback provider.
 * High-precision providers can implement the same result shape and replace it
 * without changing callers.
 */
export type CelestialBody = 'Sun' | 'Moon';
export type EphemerisAccuracy = 'approximate';

export interface EclipticPosition {
  body: CelestialBody;
  jd: number;
  longitudeDeg: number;
  latitudeDeg: number;
  distanceAU: number;
  accuracy: EphemerisAccuracy;
}

export interface EphemerisProvider {
  name: string;
  accuracy: string;
  position(body: CelestialBody, date: Date): EclipticPosition;
}

const RAD = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;

/** Julian Date from a UTC Date. */
export function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Approximate apparent geocentric solar ecliptic longitude.
 * Intended as a deterministic baseline, not a sub-arcsecond ephemeris.
 */
export function sunEclipticLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = norm(280.460 + 0.9856474 * n);
  const g = (357.528 + 0.9856003 * n) * RAD;
  return norm(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
}

/** Approximate geocentric lunar ecliptic longitude/latitude/distance. */
export function moonEclipticPosition(jd: number): Omit<EclipticPosition, 'body' | 'jd' | 'accuracy'> {
  const d = jd - 2451543.5;
  const N = (125.1228 - 0.0529538083 * d) * RAD;
  const i = 5.1454 * RAD;
  const w = (318.0634 + 0.1643573223 * d) * RAD;
  const a = 60.2666;
  const e = 0.054;
  const M = (115.3654 + 13.0649929509 * d) * RAD;
  const E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i));
  const yh = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i));
  const zh = r * Math.sin(v + w) * Math.sin(i);
  return {
    longitudeDeg: norm(Math.atan2(yh, xh) / RAD),
    latitudeDeg: Math.atan2(zh, Math.hypot(xh, yh)) / RAD,
    distanceAU: (r * 6378.14) / 149597870.7,
  };
}

export const approximateEphemerisProvider: EphemerisProvider = {
  name: 'astrosun-analytical-baseline',
  accuracy: 'approximate',
  position(body, date) {
    const jd = julianDate(date);
    if (body === 'Sun') {
      return { body, jd, longitudeDeg: sunEclipticLongitude(jd), latitudeDeg: 0, distanceAU: 1, accuracy: 'approximate' };
    }
    return { body, jd, ...moonEclipticPosition(jd), accuracy: 'approximate' };
  },
};

export function eclipticPositions(date: Date, provider: EphemerisProvider = approximateEphemerisProvider): EclipticPosition[] {
  return [provider.position('Sun', date), provider.position('Moon', date)];
}
