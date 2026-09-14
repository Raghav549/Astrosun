export interface EarthOrientationSample {
  utcIso: string;
  dut1Seconds: number;
  xpArcsec: number;
  ypArcsec: number;
  source: string;
  version: string;
}

/** Versioned Earth-orientation boundary; callers must supply authoritative IERS/EOP data. */
export interface EarthOrientationProvider {
  readonly id: string;
  readonly version: string;
  sample(utcIso: string): EarthOrientationSample;
}

export function validateEarthOrientation(sample: EarthOrientationSample): void {
  if (!Number.isFinite(sample.dut1Seconds) || !Number.isFinite(sample.xpArcsec) || !Number.isFinite(sample.ypArcsec)) {
    throw new Error(`Invalid Earth-orientation sample from ${sample.source}@${sample.version}.`);
  }
  if (!sample.utcIso.includes('T')) throw new Error('Earth-orientation sample requires an ISO timestamp.');
}
