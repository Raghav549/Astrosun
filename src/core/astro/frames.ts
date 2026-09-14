/** Explicit astronomical frame transforms used by the computation layer. */

export interface EclipticCoordinate {
  longitudeDeg: number;
  latitudeDeg: number;
  distanceAU: number;
}

const DEG = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;

/**
 * Mean obliquity of the ecliptic, sufficient for the approximate provider.
 * The high-precision provider boundary can replace this with IAU/IERS models.
 */
export function meanObliquityDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.439291111 - 0.0130041667 * T - 1.6389e-7 * T * T + 5.0361e-7 * T * T * T;
}

/** Convert ecliptic longitude/latitude to equatorial RA/Dec. */
export function eclipticToEquatorial(
  longitudeDeg: number,
  latitudeDeg: number,
  jd: number,
): { rightAscensionDeg: number; declinationDeg: number } {
  const l = longitudeDeg * DEG;
  const b = latitudeDeg * DEG;
  const e = meanObliquityDeg(jd) * DEG;
  const sinDec = Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l);
  const ra = Math.atan2(
    Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e),
    Math.cos(l),
  );
  return {
    rightAscensionDeg: norm(ra / DEG),
    declinationDeg: Math.asin(sinDec) / DEG,
  };
}
