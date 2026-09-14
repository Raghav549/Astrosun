import { julianDate, moonEclipticPosition, sunEclipticLongitude } from '../astro/ephemeris';
import { tropicalToSidereal } from './ayanamsa';
import { karanaName, yogaName } from './names';
import { civilDateParts, validatePanchangaLocation, type PanchangaLocation } from './location';
import { getRegionalPolicy, validateRegionalContext } from './regional';
import type { Nakshatra, PanchangaSnapshot, Tithi } from './types';

const norm = (x: number) => ((x % 360) + 360) % 360;
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];

export interface PanchangaOptions {
  sidereal?: boolean;
  ruleSet?: string;
  location?: PanchangaLocation;
}

/** Deterministic Panchanga baseline with explicit civil location and regional-policy validation. */
export function computePanchanga(date: Date, options: PanchangaOptions = {}): PanchangaSnapshot {
  if (options.location) validatePanchangaLocation(options.location);
  if (options.ruleSet?.startsWith('regional:') && options.location) {
    validateRegionalContext(getRegionalPolicy(options.ruleSet.slice('regional:'.length)), options.location);
  }
  const jd = julianDate(date);
  const tropicalSun = sunEclipticLongitude(jd);
  const tropicalMoon = moonEclipticPosition(jd).longitudeDeg;
  const sun = options.sidereal ? tropicalToSidereal(tropicalSun, jd) : tropicalSun;
  const moon = options.sidereal ? tropicalToSidereal(tropicalMoon, jd) : tropicalMoon;
  const phase = norm(tropicalMoon - tropicalSun);
  const tithiNumber = Math.min(30, Math.floor(phase / 12) + 1) as Tithi['number'];
  const tithi: Tithi = { number: tithiNumber, paksha: tithiNumber <= 15 ? 'Shukla' : 'Krishna', phaseAngleDeg: phase };
  const segment = 360 / 27;
  const nakIndex = Math.min(26, Math.floor(moon / segment));
  const local = moon - nakIndex * segment;
  const yogaDeg = norm(sun + moon);
  const nakshatra: Nakshatra = { number: nakIndex + 1, name: NAKSHATRAS[nakIndex], longitudeStartDeg: nakIndex * segment, longitudeEndDeg: (nakIndex + 1) * segment, pada: Math.min(4, Math.floor(local / (segment / 4)) + 1) };
  const halfTithiIndex = Math.floor(phase / 6) + 1;
  const localParts = options.location ? civilDateParts(date, options.location.timeZone) : undefined;
  return {
    jd,
    localDate: localParts ? `${localParts.year}-${String(localParts.month).padStart(2, '0')}-${String(localParts.day).padStart(2, '0')}` : date.toISOString().slice(0, 10),
    timeZone: options.location?.timeZone,
    location: options.location ? { latitudeDeg: options.location.latitudeDeg, longitudeDeg: options.location.longitudeDeg, elevationMeters: options.location.elevationMeters ?? 0 } : undefined,
    tithi,
    nakshatra,
    yogaDeg,
    yogaName: yogaName(yogaDeg),
    karanaIndex: halfTithiIndex,
    karanaName: karanaName(halfTithiIndex),
    sunLongitudeDeg: sun,
    moonLongitudeDeg: moon,
    accuracy: 'approximate',
    ruleSet: options.ruleSet,
  };
}
