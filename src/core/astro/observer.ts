export interface ObserverSite {
  latitudeDeg: number;
  longitudeDeg: number;
  elevationM: number;
  timezone: string;
}

export function validateObserver(site: ObserverSite): void {
  if (!Number.isFinite(site.latitudeDeg) || site.latitudeDeg < -90 || site.latitudeDeg > 90) {
    throw new Error('Observer latitude must be finite and within [-90, 90] degrees.');
  }
  if (!Number.isFinite(site.longitudeDeg) || site.longitudeDeg < -180 || site.longitudeDeg > 180) {
    throw new Error('Observer longitude must be finite and within [-180, 180] degrees.');
  }
  if (!Number.isFinite(site.elevationM)) {
    throw new Error('Observer elevation must be finite.');
  }
  if (!site.timezone.trim()) {
    throw new Error('Observer timezone is required.');
  }
}

/**
 * Topocentric calculations are deliberately not implemented by this baseline
 * contract. Callers must not silently substitute geocentric coordinates where
 * observer-dependent results are required.
 */
export function requireTopocentricModel(): never {
  throw new Error('No authoritative topocentric model is registered.');
}
