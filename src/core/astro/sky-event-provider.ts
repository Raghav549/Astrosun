/** Provider contract for production sunrise/sunset/moonrise/moonset event generation. */
import type { ObserverSite } from './topocentric';

export type SkyEventKind = 'sunrise' | 'sunset' | 'moonrise' | 'moonset';

export interface SkyEventRequest {
  date: Date;
  observer: ObserverSite;
  kind: SkyEventKind;
}

export interface SkyEventResult {
  kind: SkyEventKind;
  date: Date;
  observer: ObserverSite;
  source: 'kernel-provider' | 'analytical-provider';
  accuracy: 'high-precision' | 'standard' | 'approximate';
  notes: readonly string[];
}

export interface SkyEventProvider {
  event(request: SkyEventRequest): SkyEventResult;
}

export function assertSkyEventResult(result: SkyEventResult): void {
  if (!(result.date instanceof Date) || !Number.isFinite(result.date.getTime())) throw new Error('Sky event provider returned an invalid date.');
  if (result.observer.latitudeDeg < -90 || result.observer.latitudeDeg > 90) throw new RangeError('Invalid observer latitude.');
}
