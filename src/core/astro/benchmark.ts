import { angularSeparationArcsec, summarizeLongitudeErrors, type EphemerisBenchmarkCase } from './validation';

export interface BenchmarkThresholds {
  maxArcsec: number;
  meanArcsec: number;
}

export interface BenchmarkReport {
  provider: string;
  reference: string;
  summary: ReturnType<typeof summarizeLongitudeErrors>;
  passed: boolean;
  thresholds: BenchmarkThresholds;
}

/** Evaluate a provider against immutable/versioned reference cases supplied by the caller. */
export function benchmarkEphemeris(
  provider: string,
  reference: string,
  cases: readonly EphemerisBenchmarkCase[],
  thresholds: BenchmarkThresholds,
): BenchmarkReport {
  const summary = summarizeLongitudeErrors(cases);
  return {
    provider,
    reference,
    summary,
    thresholds,
    passed: summary.maxArcsec <= thresholds.maxArcsec && summary.meanArcsec <= thresholds.meanArcsec,
  };
}

export function compareLongitudeArcsec(actualDeg: number, expectedDeg: number): number {
  return angularSeparationArcsec(actualDeg, expectedDeg);
}
