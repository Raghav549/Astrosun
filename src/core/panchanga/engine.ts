import { julianDate, moonEclipticPosition, sunEclipticLongitude } from '../astro/ephemeris';
import { tropicalToSidereal } from './ayanamsa';
import type { Nakshatra, PanchangaSnapshot, Tithi } from './types';

const norm = (x: number) => ((x % 360) + 360) % 360;
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

export interface PanchangaOptions {
  sidereal?: boolean;
  /** Optional calendar-rule identifier; calculation remains observational/astronomical. */
  ruleSet?: string;
}

/**
 * Deterministic Panchanga baseline from the selected longitude convention.
 *
 * Important boundary: this function computes geometric ingredients only. It
 * must not be treated as an authoritative regional Panchanga without a
 * validated ephemeris, observer/location policy, ayanamsa, sunrise/day-boundary
 * convention, and named calendar rule set.
 */
export function computePanchanga(date: Date, options: PanchangaOptions = {}): PanchangaSnapshot {
  const jd = julianDate(date);
  const tropicalSun = sunEclipticLongitude(jd);
  const tropicalMoon = moonEclipticPosition(jd).longitudeDeg;
  const sun = options.sidereal ? tropicalToSidereal(tropicalSun, jd) : tropicalSun;
  const moon = options.sidereal ? tropicalToSidereal(tropicalMoon, jd) : tropicalMoon;

  // Tithi is defined by the 12° geocentric Sun-Moon elongation; using the
  // unsimplified tropical elongation keeps the phase geometry convention clear.
  const phase = norm(tropicalMoon - tropicalSun);
  const tithiNumber = Math.min(30, Math.floor(phase / 12) + 1) as Tithi['number'];
  const tithi: Tithi = {
    number: tithiNumber,
    paksha: tithiNumber <= 15 ? 'Shukla' : 'Krishna',
    phaseAngleDeg: phase,
  };

  const segment = 360 / 27;
  const nakIndex = Math.min(26, Math.floor(moon / segment));
  const local = moon - nakIndex * segment;
  const nakshatra: Nakshatra = {
    number: nakIndex + 1,
    name: NAKSHATRAS[nakIndex],
    longitudeStartDeg: nakIndex * segment,
    longitudeEndDeg: (nakIndex + 1) * segment,
    pada: Math.min(4, Math.floor(local / (segment / 4)) + 1),
  };

  return {
    jd,
    tithi,
    nakshatra,
    yogaDeg: norm(sun + moon),
    karanaIndex: Math.floor(phase / 6) + 1,
    sunLongitudeDeg: sun,
    moonLongitudeDeg: moon,
    accuracy: 'approximate',
  };
}
