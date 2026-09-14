/** Linearized covariance propagation for state-space uncertainty. */
import type { StateVector } from './state';
import { linearizedSigma1D } from '../astro/uncertainty';

export interface StateCovariance6x6 { data: readonly number[]; }

export function validateStateCovariance6x6(cov: StateCovariance6x6): void {
  if (cov.data.length !== 36 || !cov.data.every(Number.isFinite)) throw new Error('6x6 covariance must contain 36 finite values.');
}

export function scalarUncertaintyFromStateGradient(
  gradient: readonly number[],
  covariance: StateCovariance6x6,
): number {
  validateStateCovariance6x6(covariance);
  return linearizedSigma1D(gradient, Array.from({ length: 6 }, (_, i) => covariance.data.slice(i * 6, i * 6 + 6))).sigma;
}

export function stateFinite(state: StateVector): boolean {
  return [state.position.x, state.position.y, state.position.z, state.velocity.x, state.velocity.y, state.velocity.z, state.epochJd].every(Number.isFinite);
}
