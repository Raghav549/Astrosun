/** Location/time-zone inputs used to make Panchanga boundaries explicit. */
export interface PanchangaLocation {
  latitudeDeg: number;
  longitudeDeg: number;
  elevationMeters?: number;
  timeZone: string;
}

export function validatePanchangaLocation(location: PanchangaLocation): void {
  if (location.latitudeDeg < -90 || location.latitudeDeg > 90) throw new RangeError('latitude must be within [-90, 90]');
  if (location.longitudeDeg < -180 || location.longitudeDeg > 180) throw new RangeError('longitude must be within [-180, 180]');
  if (!location.timeZone.trim()) throw new Error('timeZone is required');
}

/** Resolve a civil-local date to UTC without silently assuming the machine timezone. */
export function civilDateParts(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (type: string) => Number(parts.find((x) => x.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}
