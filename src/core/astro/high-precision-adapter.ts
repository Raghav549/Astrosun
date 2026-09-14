/**
 * External high-precision ephemeris adapter boundary.
 *
 * AstroSun never pretends that an analytical fallback is DE/SPICE precision.
 * An application can inject a real kernel-backed provider (DE440/DE441/SPICE)
 * while keeping all consumers provider-agnostic.
 */
import type { CoordinateFrame, ProviderState, SolarSystemStateProvider, TimeScale } from './provider-contracts';
import { assertFiniteState, assertProviderAccuracy } from './provider-contracts';

export interface HighPrecisionEphemerisBackend {
  state(body: string, epochJd: number, scale: TimeScale, frame: CoordinateFrame): ProviderState;
}

export class HighPrecisionEphemerisAdapter implements SolarSystemStateProvider {
  readonly accuracy = 'high-precision' as const;
  constructor(
    public readonly id: string,
    public readonly version: string,
    private readonly backend: HighPrecisionEphemerisBackend,
  ) {}

  state(body: string, jd: number, scale: TimeScale, frame: CoordinateFrame): ProviderState {
    const result = this.backend.state(body, jd, scale, frame);
    assertFiniteState(result);
    assertProviderAccuracy(result.accuracy, 'high-precision');
    return result;
  }
}

/** Simple in-memory provider useful for deterministic tests and fixture-backed adapters. */
export function fixtureHighPrecisionBackend(fixtures: readonly ProviderState[]): HighPrecisionEphemerisBackend {
  return {
    state(body, epochJd, scale, frame) {
      const found = fixtures.find((x) => x.id === body && x.epochJd === epochJd && x.timeScale === scale && x.frame === frame);
      if (!found) throw new Error(`No high-precision fixture for ${body}@${epochJd} ${scale}/${frame}.`);
      return { ...found, state: { positionKm: [...found.state.positionKm] as [number, number, number], velocityKmPerSec: [...found.state.velocityKmPerSec] as [number, number, number] } };
    },
  };
}
