/** State propagation contracts supporting kernel-driven and numerical propagators. */
import type { CoordinateFrame, ProviderState, TimeScale } from './provider-contracts';

export interface PropagationRequest {
  body: string;
  start: ProviderState;
  targetEpochJd: number;
  stepDays: number;
  scale: TimeScale;
  frame: CoordinateFrame;
}

export interface PropagationResult {
  states: readonly ProviderState[];
  method: 'provider' | 'numerical';
  accuracy: 'high-precision' | 'standard' | 'approximate';
  steps: number;
}

export interface StatePropagator {
  propagate(request: PropagationRequest): PropagationResult;
}

export function validatePropagationRequest(request: PropagationRequest): void {
  if (!Number.isFinite(request.targetEpochJd) || !Number.isFinite(request.start.epochJd)) throw new Error('Propagation epochs must be finite.');
  if (!(request.stepDays > 0)) throw new RangeError('stepDays must be positive.');
  if (request.start.timeScale !== request.scale) throw new Error('Start state and propagation scale must match.');
  if (request.start.frame !== request.frame) throw new Error('Start state and propagation frame must match.');
}
