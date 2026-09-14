// AstroSun scientific calculation primitives.
// All numerical outputs are tagged with units and provenance so UI/AI layers
// can distinguish calculations from traditional interpretations.

const AU_KM = 149597870.7;
const EARTH_RADIUS_KM = 6378.137;
const MU_SUN_KM3_S2 = 1.32712440018e11;

export function julianDay(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
  return d.getTime() / 86400000 + 2440587.5;
}

export function centuriesSinceJ2000(date) {
  return (julianDay(date) - 2451545.0) / 36525;
}

export function keplerPeriodSeconds(semiMajorAxisKm) {
  if (!(semiMajorAxisKm > 0)) throw new Error('semiMajorAxisKm must be > 0');
  return 2 * Math.PI * Math.sqrt((semiMajorAxisKm ** 3) / MU_SUN_KM3_S2);
}

export function angularSeparationRadians(a, b) {
  const ax = Math.cos(a.lat) * Math.cos(a.lon);
  const ay = Math.cos(a.lat) * Math.sin(a.lon);
  const az = Math.sin(a.lat);
  const bx = Math.cos(b.lat) * Math.cos(b.lon);
  const by = Math.cos(b.lat) * Math.sin(b.lon);
  const bz = Math.sin(b.lat);
  const dot = Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz));
  return Math.acos(dot);
}

export function kmFromAu(au) { return au * AU_KM; }
export function auFromKm(km) { return km / AU_KM; }
export function orbitRadiusFromAltitudeKm(altitudeKm) { return EARTH_RADIUS_KM + altitudeKm; }

export function scienceResult(value, unit, source = 'AstroSun deterministic core') {
  return { value, unit, source, kind: 'calculation' };
}
