/** Observer-centric spherical astronomy: hour angle, altitude/azimuth and rise/set geometry. */
import type { ObserverSite } from './topocentric';

export interface HorizontalCoordinates {
  altitudeDeg: number;
  azimuthDeg: number;
  hourAngleDeg: number;
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const normalize = (x: number) => ((x % 360) + 360) % 360;

/** Mean sidereal time at Greenwich, adequate for the site's approximate geometry layer. */
export function meanSiderealTimeDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return normalize(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000);
}

export function hourAngleDeg(rightAscensionDeg: number, jd: number, observer: ObserverSite): number {
  return normalize(meanSiderealTimeDeg(jd) + observer.longitudeDeg - rightAscensionDeg);
}

export function equatorialToHorizontalSpherical(
  rightAscensionDeg: number,
  declinationDeg: number,
  jd: number,
  observer: ObserverSite,
): HorizontalCoordinates {
  const H = hourAngleDeg(rightAscensionDeg, jd, observer) * DEG;
  const lat = observer.latitudeDeg * DEG;
  const dec = declinationDeg * DEG;
  const sinAlt = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H);
  const altitudeDeg = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * RAD;
  const azimuth = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat),
  );
  return { altitudeDeg, azimuthDeg: normalize(azimuth * RAD + 180), hourAngleDeg: normalize(H * RAD) };
}
