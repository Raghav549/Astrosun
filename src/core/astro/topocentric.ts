import { eclipticToEquatorial } from './frames';
import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';

export interface ObserverSite {
  latitudeDeg: number;
  longitudeDeg: number;
  elevationMeters?: number;
}

export interface ObserverEquatorialBaseline {
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceAU: number;
  accuracy: 'approximate';
  geometry: 'geocentric-baseline-with-observer-context';
}

export type ObservableBody = 'Sun' | 'Moon';

/**
 * Approximate geocentric equatorial baseline with explicit observer context.
 *
 * This function intentionally does NOT claim topocentric parallax correction.
 * A production topocentric implementation needs Earth orientation, a validated
 * observer geodetic/geocentric model, parallax, refraction policy, and a
 * high-precision ephemeris provider.
 */
export function approximateObserverEquatorial(
  body: ObservableBody,
  date: Date,
  observer: ObserverSite,
): ObserverEquatorialBaseline {
  if (observer.latitudeDeg < -90 || observer.latitudeDeg > 90) {
    throw new RangeError('observer latitude must be within [-90, 90] degrees');
  }
  if (observer.longitudeDeg < -180 || observer.longitudeDeg > 180) {
    throw new RangeError('observer longitude must be within [-180, 180] degrees');
  }

  const jd = julianDate(date);
  const moon = body === 'Moon' ? moonEclipticPosition(jd) : null;
  const longitude = body === 'Sun' ? sunEclipticLongitude(jd) : moon!.longitudeDeg;
  const latitude = body === 'Sun' ? 0 : moon!.latitudeDeg;
  const distanceAU = body === 'Sun' ? 1 : moon!.distanceAU;
  const equatorial = eclipticToEquatorial(longitude, latitude, jd);

  // Observer parameters are validated and carried as call context, but are
  // deliberately not applied to the apparent coordinates in this baseline.
  void observer.elevationMeters;
  return {
    ...equatorial,
    distanceAU,
    accuracy: 'approximate',
    geometry: 'geocentric-baseline-with-observer-context',
  };
}
