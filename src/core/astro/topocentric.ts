import { eclipticToEquatorial } from './frames';
import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';

const DEG = Math.PI / 180;

export interface ObserverSite {
  latitudeDeg: number;
  longitudeDeg: number;
  elevationMeters?: number;
}

export interface TopocentricEquatorial {
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceAU: number;
  accuracy: 'approximate';
}

export type ObservableBody = 'Sun' | 'Moon';

/**
 * First-order observer geometry boundary. This is intentionally approximate;
 * production astrometry needs Earth orientation, geodetic/geocentric conversion,
 * parallax/refraction policy, and a validated high-precision ephemeris provider.
 */
export function approximateTopocentric(
  body: ObservableBody,
  date: Date,
  observer: ObserverSite,
): TopocentricEquatorial {
  if (observer.latitudeDeg < -90 || observer.latitudeDeg > 90) {
    throw new RangeError('observer latitude must be within [-90, 90] degrees');
  }
  if (observer.longitudeDeg < -180 || observer.longitudeDeg > 180) {
    throw new RangeError('observer longitude must be within [-180, 180] degrees');
  }

  const jd = julianDate(date);
  const longitude = body === 'Sun' ? sunEclipticLongitude(jd) : moonEclipticPosition(jd).longitudeDeg;
  const latitude = body === 'Sun' ? 0 : moonEclipticPosition(jd).latitudeDeg;
  const distanceAU = body === 'Sun' ? 1 : moonEclipticPosition(jd).distanceAU;
  const equatorial = eclipticToEquatorial(longitude, latitude, jd);

  // This layer records observer context but deliberately avoids claiming a
  // full Earth-rotation/parallax solution. The returned coordinates therefore
  // remain geocentric-equatorial approximations pending the precision provider.
  void observer.longitudeDeg;
  void observer.latitudeDeg;
  void observer.elevationMeters;
  return { ...equatorial, distanceAU, accuracy: 'approximate' };
}
