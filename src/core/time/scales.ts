/** Explicit astronomical time-scale types and conversion boundaries. */
export type AstronomicalTimeScale = 'UTC' | 'TAI' | 'TT' | 'TDB' | 'TCB' | 'TCL';

export interface TimeInstant {
  jd: number;
  scale: AstronomicalTimeScale;
}

export interface TimeConversionResult {
  input: TimeInstant;
  output: TimeInstant;
  method: string;
  accuracy: 'approximate' | 'provider-defined';
  notes: string[];
}

/** Fixed TT−TAI offset defined by convention: 32.184 s. */
export const TT_MINUS_TAI_SECONDS = 32.184;

/**
 * UTC↔TAI cannot be reduced to one permanent constant because leap seconds
 * change the relationship. Keep this function intentionally explicit until a
 * versioned IERS/official leap-second table is connected.
 */
export function requireUtcTaiTable(): never {
  throw new Error('UTC↔TAI conversion requires a versioned leap-second table/provider.');
}

export function taiToTt(jdTai: number): number {
  return jdTai + TT_MINUS_TAI_SECONDS / 86400;
}

export function ttToTai(jdTt: number): number {
  return jdTt - TT_MINUS_TAI_SECONDS / 86400;
}

export function unsupportedConversion(from: AstronomicalTimeScale, to: AstronomicalTimeScale): never {
  throw new Error(`No authoritative ${from}→${to} conversion provider is registered.`);
}
