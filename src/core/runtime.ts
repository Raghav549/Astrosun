import { computePanchanga } from './panchanga/engine';
import { eclipticPositions } from './astro/ephemeris';
import { provenance } from './astro/quality';
import { runScientificInvariants } from './astro/invariants';

export interface RuntimeSnapshot {
  generatedAt: string;
  panchanga: ReturnType<typeof computePanchanga>;
  positions: ReturnType<typeof eclipticPositions>;
  invariants: ReturnType<typeof runScientificInvariants>;
}

/** Single runtime assembly point for product surfaces. */
export function buildRuntimeSnapshot(date = new Date()): RuntimeSnapshot {
  const panchanga = computePanchanga(date, { sidereal: true });
  const positions = eclipticPositions(date);
  const invariants = runScientificInvariants(date);
  void provenance('astrosun-runtime', '0.1', { date: date.toISOString() }, 'analytical', 'approximate');
  return { generatedAt: new Date().toISOString(), panchanga, positions, invariants };
}
