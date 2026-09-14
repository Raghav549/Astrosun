/** Provider-grade state contracts for astronomy/astrodynamics. */
export type ProviderAccuracy = 'approximate' | 'standard' | 'high-precision';
export type CoordinateFrame = 'ecliptic-of-date' | 'equatorial-of-date' | 'icrf' | 'barycentric-icrf';
export type TimeScale = 'UTC' | 'TAI' | 'TT' | 'TDB' | 'TCB' | 'TCL';

export interface CartesianState {
  positionKm: readonly [number, number, number];
  velocityKmPerSec: readonly [number, number, number];
}

export interface ProviderState {
  id: string;
  version: string;
  accuracy: ProviderAccuracy;
  epochJd: number;
  timeScale: TimeScale;
  frame: CoordinateFrame;
  state: CartesianState;
  notes: readonly string[];
}

export interface SolarSystemStateProvider {
  readonly id: string;
  readonly version: string;
  readonly accuracy: ProviderAccuracy;
  state(body: string, jd: number, scale: TimeScale, frame: CoordinateFrame): ProviderState;
}

export function assertFiniteState(result: ProviderState): void {
  const values = [...result.state.positionKm, ...result.state.velocityKmPerSec];
  if (!values.every(Number.isFinite)) throw new Error(`Provider ${result.id}@${result.version} returned a non-finite state.`);
  if (Number.isNaN(result.epochJd)) throw new Error('Provider state epoch is NaN.');
}

export function assertProviderAccuracy(actual: ProviderAccuracy, requested: ProviderAccuracy): void {
  const rank: Record<ProviderAccuracy, number> = { approximate: 1, standard: 2, 'high-precision': 3 };
  if (rank[actual] < rank[requested]) throw new Error(`Provider accuracy ${actual} is below requested ${requested}.`);
}
