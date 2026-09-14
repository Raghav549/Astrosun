/** Relativistic/compact-object baseline formulas with explicit domain assumptions. */
import { SPEED_OF_LIGHT_MPS, GRAVITATIONAL_CONSTANT_SI } from './constants';

export interface CompactObject { massKg: number; radiusKm: number; }

export function gravitationalTimeDilationFactor(massKg: number, radiusKm: number): number {
  if (!(massKg > 0) || !(radiusKm > 0)) throw new Error('Mass and radius must be positive.');
  const rM = radiusKm * 1000;
  const rs = 2 * GRAVITATIONAL_CONSTANT_SI * massKg / (SPEED_OF_LIGHT_MPS ** 2);
  if (rM <= rs) throw new Error('Schwarzschild exterior factor is undefined at or inside the event horizon.');
  return Math.sqrt(1 - rs / rM);
}

export function escapeVelocityMps(massKg: number, radiusKm: number): number {
  if (!(massKg > 0) || !(radiusKm > 0)) throw new Error('Mass and radius must be positive.');
  return Math.sqrt(2 * GRAVITATIONAL_CONSTANT_SI * massKg / (radiusKm * 1000));
}

export function compactness(massKg: number, radiusKm: number): number {
  if (!(massKg > 0) || !(radiusKm > 0)) throw new Error('Mass and radius must be positive.');
  return (2 * GRAVITATIONAL_CONSTANT_SI * massKg) / ((radiusKm * 1000) * SPEED_OF_LIGHT_MPS ** 2);
}
