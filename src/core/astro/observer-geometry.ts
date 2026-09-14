/** Observer geometry and local sky coordinates. */
import { angularDistance, normalizeDegrees } from './angles';
import type { ObserverSite } from './topocentric';

export interface ObserverGeometry {
  latitudeDeg: number;
  longitudeDeg: number;
  elevationMeters: number;
  geocentricRadiusEarthRadii: number;
  geocentricZEarthRadii: number;
}

export interface HorizontalCoordinates {
  azimuthDeg: number;
  altitudeDeg: number;
}

export function observerGeometry(observer: ObserverSite): ObserverGeometry {
  const lat = observer.latitudeDeg * Math.PI / 180;
  const h = (observer.elevationMeters ?? 0) / 1000;
  const a = 6378.137;
  const f = 1 / 298.257223563;
  const e2 = f * (2 - f);
  const sin = Math.sin(lat);
  const cos = Math.cos(lat);
  const n = a / Math.sqrt(1 - e2 * sin * sin);
  const xKm = (n + h) * cos;
  const zKm = ((1 - e2) * n + h) * sin;
  return { latitudeDeg: observer.latitudeDeg, longitudeDeg: observer.longitudeDeg, elevationMeters: observer.elevationMeters ?? 0, geocentricRadiusEarthRadii: Math.hypot(xKm, 0) / a, geocentricZEarthRadii: zKm / a };
}

export function gmstDegrees(jdUt1: number): number {
  const T = (jdUt1 - 2451545.0) / 36525;
  return normalizeDegrees(280.46061837 + 360.98564736629 * (jdUt1 - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000);
}

export function localSiderealTimeDegrees(jdUt1: number, longitudeDeg: number): number {
  return normalizeDegrees(gmstDegrees(jdUt1) + longitudeDeg);
}

export function equatorialToHorizontal(
  rightAscensionDeg: number,
  declinationDeg: number,
  jdUt1: number,
  observer: ObserverSite,
): HorizontalCoordinates {
  const h = ((localSiderealTimeDegrees(jdUt1, observer.longitudeDeg) - rightAscensionDeg + 540) % 360) - 180;
  const H = h * Math.PI / 180;
  const dec = declinationDeg * Math.PI / 180;
  const lat = observer.latitudeDeg * Math.PI / 180;
  const sinAlt = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const azimuth = Math.atan2(-Math.sin(H) * Math.cos(dec), Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(H));
  return { azimuthDeg: normalizeDegrees(azimuth * 180 / Math.PI), altitudeDeg: altitude * 180 / Math.PI };
}

export function angularDistanceFromHorizon(altitudeDeg: number, thresholdDeg = 0): number {
  return angularDistance(altitudeDeg, thresholdDeg);
}
