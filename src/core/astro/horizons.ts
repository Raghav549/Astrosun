import { eclipticToEquatorial } from './frames';
import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';
import type { ObserverSite } from './topocentric';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const norm = (x: number) => ((x % 360) + 360) % 360;

export interface HorizontalCoordinates {
  azimuthDeg: number;
  altitudeDeg: number;
  hourAngleDeg: number;
  accuracy: 'approximate';
}

/**
 * Approximate local horizontal coordinates using geocentric RA/Dec and a
 * compact sidereal-time model. This is an explicit observational baseline,
 * not a replacement for a full IAU/IERS apparent-place pipeline.
 */
export function approximateHorizontal(
  body: 'Sun' | 'Moon',
  date: Date,
  observer: ObserverSite,
): HorizontalCoordinates {
  const jd = julianDate(date);
  const lon = body === 'Sun' ? sunEclipticLongitude(jd) : moonEclipticPosition(jd).longitudeDeg;
  const lat = body === 'Sun' ? 0 : moonEclipticPosition(jd).latitudeDeg;
  const { rightAscensionDeg, declinationDeg } = eclipticToEquatorial(lon, lat, jd);

  const T = (jd - 2451545.0) / 36525;
  const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000);
  const localSidereal = norm(gmst + observer.longitudeDeg);
  const hourAngle = norm(localSidereal - rightAscensionDeg);
  const H = (hourAngle > 180 ? hourAngle - 360 : hourAngle) * DEG;
  const phi = observer.latitudeDeg * DEG;
  const dec = declinationDeg * DEG;

  const sinAlt = Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * RAD;
  const azimuth = norm(Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(H)) * RAD);

  return { azimuthDeg: azimuth, altitudeDeg: altitude, hourAngleDeg: hourAngle, accuracy: 'approximate' };
}
