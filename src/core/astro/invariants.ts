import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';

const EPS = 1e-9;
const normalize = (x: number) => ((x % 360) + 360) % 360;

export interface InvariantResult {
  name: string;
  passed: boolean;
  details: string;
}

export function runScientificInvariants(date = new Date('2026-01-01T00:00:00Z')): InvariantResult[] {
  const jd = julianDate(date);
  const sun = sunEclipticLongitude(jd);
  const moon = moonEclipticPosition(jd);
  return [
    {
      name: 'julian-date-finite',
      passed: Number.isFinite(jd),
      details: `JD=${jd}`,
    },
    {
      name: 'solar-longitude-normalized',
      passed: sun >= 0 && sun < 360,
      details: `Sun longitude=${sun}°`,
    },
    {
      name: 'lunar-longitude-normalized',
      passed: moon.longitudeDeg >= 0 && moon.longitudeDeg < 360,
      details: `Moon longitude=${moon.longitudeDeg}°`,
    },
    {
      name: 'lunar-distance-positive',
      passed: moon.distanceAU > EPS,
      details: `Moon distance=${moon.distanceAU} AU`,
    },
    {
      name: 'normalizer-wrap',
      passed: normalize(-0.1) > 359 && normalize(360.1) < 1,
      details: '0..360 normalization survives wraparound',
    },
  ];
}

export function assertScientificInvariants(date?: Date): void {
  const failures = runScientificInvariants(date).filter((result) => !result.passed);
  if (failures.length) {
    throw new Error(failures.map((failure) => `${failure.name}: ${failure.details}`).join('\n'));
  }
}
