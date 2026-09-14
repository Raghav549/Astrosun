/** Civil-day/Panchanga boundary helpers; exact sunrise requires the registered ephemeris/event provider. */
import type { PanchangaLocation } from './location';

export type BoundaryKind = 'sunrise' | 'sunset' | 'midnight';

export interface BoundaryEvent {
  kind: BoundaryKind;
  utc: Date;
  localDateIso: string;
  source: 'provider' | 'analytical-fallback';
  accuracy: 'provider-defined' | 'approximate';
}

export interface DayBoundaryProvider {
  boundary(date: Date, location: PanchangaLocation, kind: BoundaryKind): BoundaryEvent;
}

export function localDateIso(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function selectBoundary(
  date: Date,
  location: PanchangaLocation,
  kind: BoundaryKind,
  provider?: DayBoundaryProvider,
): BoundaryEvent {
  if (provider) return provider.boundary(date, location, kind);
  if (kind !== 'midnight') throw new Error('Sunrise/sunset boundary requires a registered astronomical event provider.');
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: location.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const localMidnight = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
  return { kind, utc: localMidnight, localDateIso: localDateIso(date, location.timeZone), source: 'analytical-fallback', accuracy: 'approximate' };
}
