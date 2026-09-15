import { computePanchanga, type PanchangaOptions } from './panchanga/engine';
import { normalizeDegrees } from './astro/angles';

export interface JyotishaChartOptions extends PanchangaOptions {
  latitudeDeg?: number;
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

export function buildJyotishaChart(date: Date, options: JyotishaChartOptions = {}): JyotishaChart {
  const panchanga = computePanchanga(date, { ...options, sidereal: true });
  const sun = point('sun', 'Surya', panchanga.sunLongitudeDeg);
  const moon = point('moon', 'Chandra', panchanga.moonLongitudeDeg);
  const longitude = options.location?.longitudeDeg ?? options.longitudeDeg ?? 0;
  const jd = panchanga.jd;
  const localSidereal = normalizeDegrees(280.46061837 + 360.98564736629 * (jd - 2451545.0) + longitude);
  const ascendant = point('lagna', 'Lagna', localSidereal);
  return {
    generatedAt: new Date().toISOString(),
    zodiac: 'sidereal',
    ayanamsa: 'Lahiri',
    sun,
    moon,
    ascendant,
    panchanga,
    notes: [
      'Sun and Moon use the AstroSun analytical ephemeris baseline.',
      'Ascendant uses explicit local-sidereal baseline geometry; higher-precision house/obliquity providers remain an upgrade boundary.',
      'Interpretive Jyotisha claims are separated from astronomical measurement.',
    ],
  };
}

export function zodiacSigns(): readonly string[] { return SIGNS; }
