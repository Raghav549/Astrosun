import { computePanchanga } from './panchanga/engine';
import { eclipticPositions } from './astro/ephemeris';
import { provenance, type Provenance } from './astro/quality';
import { runScientificInvariants } from './astro/invariants';

export interface RuntimeSnapshot {
  generatedAt: string;
  panchanga: ReturnType<typeof computePanchanga>;
  positions: ReturnType<typeof eclipticPositions>;
  invariants: ReturnType<typeof runScientificInvariants>;
  provenance: Provenance;
  capability: {
    ephemeris: 'analytical-fallback';
    highPrecisionKernel: 'external-provider-required';
    observerGeometry: 'available';
    eclipseGeometry: 'available';
    uncertainty: 'available';
  };
}

/** Single runtime assembly point for product surfaces. */
export function buildRuntimeSnapshot(date = new Date()): RuntimeSnapshot {
  const panchanga = computePanchanga(date, { sidereal: true });
  const positions = eclipticPositions(date);
  const invariants = runScientificInvariants(date);
  const runtimeProvenance = provenance(
    'astrosun-runtime',
    '0.1',
    { date: date.toISOString() },
    'analytical',
    'approximate',
    ['High-precision DE/SPICE/CALCEPH provider must be injected externally.'],
  );
  return {
    generatedAt: new Date().toISOString(),
    panchanga,
    positions,
    invariants,
    provenance: runtimeProvenance,
    capability: {
      ephemeris: 'analytical-fallback',
      highPrecisionKernel: 'external-provider-required',
      observerGeometry: 'available',
      eclipseGeometry: 'available',
      uncertainty: 'available',
    },
  };
}
