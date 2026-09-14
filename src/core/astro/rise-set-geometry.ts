/** Geometric rise/set event solver with explicit horizon and refraction policy. */
import { apparentAltitudeDeg, type AtmosphericConditions, type RefractionModel } from './refraction';
import { equatorialToHorizontal } from './observer-geometry';
import type { ObserverSite } from './topocentric';

export interface EquatorialProvider {
  rightAscensionDeg: number;
  declinationDeg: number;
}

export interface RiseSetPolicy {
  horizonAltitudeDeg: number;
  refraction: RefractionModel;
  atmosphere?: AtmosphericConditions;
}

export interface RiseSetEvent {
  kind: 'rise' | 'set';
  date: Date;
  altitudeDeg: number;
  iterations: number;
}

export function altitudeAt(date: Date, observer: ObserverSite, equatorial: EquatorialProvider, policy: RiseSetPolicy): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const horizontal = equatorialToHorizontal(equatorial.rightAscensionDeg, equatorial.declinationDeg, jd, observer);
  return apparentAltitudeDeg(horizontal.altitudeDeg, policy.refraction, policy.atmosphere);
}

export function refineRiseSet(
  left: Date,
  right: Date,
  observer: ObserverSite,
  sample: (date: Date) => EquatorialProvider,
  kind: 'rise' | 'set',
  policy: RiseSetPolicy,
): RiseSetEvent {
  if (left >= right) throw new Error('left must be earlier than right');
  const target = policy.horizonAltitudeDeg;
  let a = left.getTime();
  let b = right.getTime();
  let fa = altitudeAt(new Date(a), observer, sample(new Date(a)), policy) - target;
  let fb = altitudeAt(new Date(b), observer, sample(new Date(b)), policy) - target;
  if (fa * fb > 0) throw new Error('rise/set interval does not bracket the horizon crossing');
  let iterations = 0;
  for (; iterations < 50; iterations += 1) {
    const mid = Math.floor((a + b) / 2);
    const fm = altitudeAt(new Date(mid), observer, sample(new Date(mid)), policy) - target;
    if (Math.abs(fm) < 1e-5) { a = b = mid; break; }
    if ((fa <= 0 && fm >= 0) || (fa >= 0 && fm <= 0)) { b = mid; fb = fm; } else { a = mid; fa = fm; }
  }
  const date = new Date(Math.floor((a + b) / 2));
  return { kind, date, altitudeDeg: altitudeAt(date, observer, sample(date), policy), iterations };
}
