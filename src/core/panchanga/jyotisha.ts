import { computePanchanga, type PanchangaOptions } from './engine';
import { normalizeDegrees } from '../astro/angles';

export interface JyotishaChartOptions extends PanchangaOptions {
  longitudeDeg?: number;
}

export interface GrahaPoint {
  id: string;
  name: string;
  longitudeDeg: number;
  signIndex: number;
  sign: string;
  degreeInSign: number;
  retrograde: boolean;
}

export interface JyotishaChart {
  generatedAt: string;
  zodiac: 'sidereal';
  ayanamsa: 'Lahiri';
  sun: GrahaPoint;
  moon: GrahaPoint;
  ascendant: GrahaPoint;
  panchanga: ReturnType<typeof computePanchanga>;
  notes: readonly string[];
}

const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'] as const;

function point(id: string, name: string, longitudeDeg: number, retrograde = false): GrahaPoint {
  const normalized = normalizeDegrees(longitudeDeg);
  const signIndex = Math.floor(normalized / 30);
  return { id, name, longitudeDeg: normalized, signIndex, sign: SIGNS[signIndex], degreeInSign: normalized - signIndex * 30, retrograde };
}

/** Transparent baseline chart. Sun/Moon come from the astronomy core; the ascendant is explicitly marked as an interim local-time proxy. */
export function buildJyotishaChart(date: Date, options: JyotishaChartOptions = {}): JyotishaChart {
  const panchanga = computePanchanga(date, { ...options, sidereal: true });
  const sun = point('sun', 'Surya', panchanga.sunLongitudeDeg);
  const moon = point('moon', 'Chandra', panchanga.moonLongitudeDeg);
  const longitude = options.longitudeDeg ?? 0;
  const ascendantProxy = normalizeDegrees((panchanga.jd * 280.46061837 + longitude) % 360);
  const ascendant = point('lagna', 'Lagna', ascendantProxy);
  return {
    generatedAt: new Date().toISOString(),
    zodiac: 'sidereal',
    ayanamsa: 'Lahiri',
    sun,
    moon,
    ascendant,
    panchanga,
    notes: [
      'Sun and Moon use the AstroSun analytical ephemeris.',
      'Ascendant is an interim proxy until validated sidereal-time and obliquity routines are wired.',
      'Interpretive astrology is kept separate from measured astronomical quantities.',
    ],
  };
}

export function zodiacSigns(): readonly string[] { return SIGNS; }
