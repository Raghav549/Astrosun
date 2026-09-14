import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';

const norm = (x: number) => ((x % 360) + 360) % 360;
const signed = (x: number) => ((x + 180) % 360 + 360) % 360 - 180;

export interface AngularEvent { type: 'conjunction' | 'opposition'; date: Date; separationDeg: number; method: 'coarse-search'; }

function separationAt(date: Date): number {
  const jd = julianDate(date);
  return Math.abs(signed(moonEclipticPosition(jd).longitudeDeg - sunEclipticLongitude(jd)));
}

/** Find the nearest approximate Sun-Moon conjunction/opposition in a time window. */
export function nearestSolarLunarEvent(start: Date, end: Date, target: 0 | 180): AngularEvent {
  const stepMs = 6 * 3600 * 1000;
  let bestDate = start;
  let bestError = Infinity;
  for (let t = start.getTime(); t <= end.getTime(); t += stepMs) {
    const d = new Date(t);
    const sep = separationAt(d);
    const err = Math.abs(signed(sep - target));
    if (err < bestError) { bestError = err; bestDate = d; }
  }
  return { type: target === 0 ? 'conjunction' : 'opposition', date: bestDate, separationDeg: separationAt(bestDate), method: 'coarse-search' };
}

export function lunarPhaseAngle(date: Date): number {
  const jd = julianDate(date);
  return norm(moonEclipticPosition(jd).longitudeDeg - sunEclipticLongitude(jd));
}
