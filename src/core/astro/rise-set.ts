import { approximateHorizontal, type HorizontalCoordinates } from './horizons';
import type { ObserverSite } from './topocentric';

export interface HorizonEvent {
  body: 'Sun' | 'Moon';
  type: 'rise' | 'set';
  date: Date;
  altitudeDeg: number;
  method: 'coarse-bracket-refined';
  accuracy: 'approximate';
}

function altitude(body: 'Sun' | 'Moon', t: number, observer: ObserverSite): number {
  return approximateHorizontal(body, new Date(t), observer).altitudeDeg;
}

/**
 * Finds the first rise/set crossing in a UTC window using 10-minute sampling
 * and bisection. Horizon depression, refraction, semidiameter and terrain are
 * intentionally not applied by this approximate baseline.
 */
export function nearestHorizonEvent(
  body: 'Sun' | 'Moon',
  start: Date,
  end: Date,
  observer: ObserverSite,
  target: 'rise' | 'set',
): HorizonEvent {
  if (start >= end) throw new Error('start must be earlier than end');
  const step = 10 * 60 * 1000;
  let left = start.getTime();
  let leftAlt = altitude(body, left, observer);
  const crossing = (a: number, b: number) => target === 'rise' ? a < 0 && b >= 0 : a >= 0 && b < 0;

  for (let right = left + step; right <= end.getTime(); right += step) {
    const rightAlt = altitude(body, right, observer);
    if (crossing(leftAlt, rightAlt)) {
      let a = left;
      let b = right;
      for (let i = 0; i < 35; i += 1) {
        const mid = Math.floor((a + b) / 2);
        const midAlt = altitude(body, mid, observer);
        if (crossing(leftAlt, midAlt)) {
          b = mid;
        } else {
          a = mid;
          leftAlt = midAlt;
        }
      }
      const eventDate = new Date(Math.floor((a + b) / 2));
      return {
        body,
        type: target,
        date: eventDate,
        altitudeDeg: altitude(body, eventDate.getTime(), observer),
        method: 'coarse-bracket-refined',
        accuracy: 'approximate',
      };
    }
    left = right;
    leftAlt = rightAlt;
  }

  throw new RangeError(`No ${body} ${target} crossing found in the supplied window.`);
}

export function horizonCoordinates(body: 'Sun' | 'Moon', date: Date, observer: ObserverSite): HorizontalCoordinates {
  return approximateHorizontal(body, date, observer);
}
