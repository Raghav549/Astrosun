import { julianDate } from './ephemeris';

export type PlanetaryBody = 'Mercury' | 'Venus' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune';

export interface SimplePlanetaryElements {
  aAU: number;
  e: number;
  iDeg: number;
  raanDeg: number;
  argPeriDeg: number;
  meanLongitudeDeg: number;
  meanMotionDegPerDay: number;
}

/** Coarse J2000-order element seeds for exploratory orbital visualisation. */
const ELEMENTS: Record<PlanetaryBody, SimplePlanetaryElements> = {
  Mercury: { aAU: 0.3871, e: 0.2056, iDeg: 7.005, raanDeg: 48.331, argPeriDeg: 77.456, meanLongitudeDeg: 252.251, meanMotionDegPerDay: 4.092334 },
  Venus: { aAU: 0.7233, e: 0.0068, iDeg: 3.3946, raanDeg: 76.680, argPeriDeg: 131.532, meanLongitudeDeg: 181.979, meanMotionDegPerDay: 1.602130 },
  Earth: { aAU: 1.0000, e: 0.0167, iDeg: 0.00005, raanDeg: -11.2606, argPeriDeg: 102.947, meanLongitudeDeg: 100.464, meanMotionDegPerDay: 0.9856077 },
  Mars: { aAU: 1.5237, e: 0.0934, iDeg: 1.8506, raanDeg: 49.558, argPeriDeg: 336.041, meanLongitudeDeg: 355.453, meanMotionDegPerDay: 0.5240208 },
  Jupiter: { aAU: 5.2026, e: 0.0485, iDeg: 1.303, raanDeg: 100.454, argPeriDeg: 14.7539, meanLongitudeDeg: 34.404, meanMotionDegPerDay: 0.0830853 },
  Saturn: { aAU: 9.5549, e: 0.0555, iDeg: 2.4886, raanDeg: 113.663, argPeriDeg: 92.4319, meanLongitudeDeg: 49.944, meanMotionDegPerDay: 0.0334442 },
  Uranus: { aAU: 19.1817, e: 0.0473, iDeg: 0.7733, raanDeg: 74.006, argPeriDeg: 170.964, meanLongitudeDeg: 313.232, meanMotionDegPerDay: 0.0117258 },
  Neptune: { aAU: 30.0583, e: 0.0086, iDeg: 1.770, raanDeg: 131.784, argPeriDeg: 44.971, meanLongitudeDeg: -55.120, meanMotionDegPerDay: 0.0059819 },
};

export function simplePlanetaryMeanLongitude(body: PlanetaryBody, date: Date): number {
  const jd = julianDate(date);
  const days = jd - 2451545.0;
  const el = ELEMENTS[body];
  return ((el.meanLongitudeDeg + el.meanMotionDegPerDay * days) % 360 + 360) % 360;
}

export function simplePlanetaryElements(body: PlanetaryBody): SimplePlanetaryElements {
  return { ...ELEMENTS[body] };
}
