/** Machine-readable benchmark cases and acceptance gates. */
import { angularDistance } from './angles';

export interface AngularBenchmarkCase {
  id: string;
  dateIso: string;
  actualDeg: number;
  referenceDeg: number;
  toleranceArcsec: number;
}

export interface BenchmarkReport {
  passed: boolean;
  samples: number;
  maxErrorArcsec: number;
  meanErrorArcsec: number;
  failures: string[];
}

export function evaluateAngularBenchmarks(cases: readonly AngularBenchmarkCase[]): BenchmarkReport {
  if (!cases.length) throw new Error('Benchmark suite requires at least one case.');
  const errors = cases.map((c) => ({ id: c.id, errorArcsec: angularDistance(c.actualDeg, c.referenceDeg) * 3600, toleranceArcsec: c.toleranceArcsec }));
  const failures = errors.filter((x) => x.errorArcsec > x.toleranceArcsec).map((x) => `${x.id}: ${x.errorArcsec} arcsec > ${x.toleranceArcsec} arcsec`);
  return {
    passed: failures.length === 0,
    samples: errors.length,
    maxErrorArcsec: Math.max(...errors.map((x) => x.errorArcsec)),
    meanErrorArcsec: errors.reduce((sum, x) => sum + x.errorArcsec, 0) / errors.length,
    failures,
  };
}
