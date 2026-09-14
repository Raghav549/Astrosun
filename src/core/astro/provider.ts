import type { CelestialBody, EclipticPosition } from './ephemeris';

export type EphemerisAccuracy = 'high-precision' | 'standard' | 'approximate';

export interface EphemerisProvider {
  readonly id: string;
  readonly version: string;
  readonly accuracy: EphemerisAccuracy;
  position(body: CelestialBody, date: Date): EclipticPosition;
  positions(bodies: readonly CelestialBody[], date: Date): EclipticPosition[];
}

/** Provider-selection contract: consumers depend on this interface, not a specific model. */
export function requireAccuracy(provider: EphemerisProvider, requested: EphemerisAccuracy): void {
  const rank: Record<EphemerisAccuracy, number> = {
    approximate: 1,
    standard: 2,
    'high-precision': 3,
  };
  if (rank[provider.accuracy] < rank[requested]) {
    throw new Error(`Ephemeris provider ${provider.id}@${provider.version} is ${provider.accuracy}; requested ${requested}.`);
  }
}
