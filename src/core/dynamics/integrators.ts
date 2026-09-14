import type { Vector3 } from './state';
import type { MassiveBody, ParticleState } from './nbody';
import { gravitationalAcceleration } from './nbody';

export type AccelerationModel = (position: Vector3, timeDays: number) => Vector3;

export interface PropagationStep {
  timeDays: number;
  state: ParticleState;
}

function add(a: Vector3, b: Vector3): Vector3 { return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }; }
function scale(a: Vector3, k: number): Vector3 { return { x: a.x * k, y: a.y * k, z: a.z * k }; }

/** Fourth-order Runge-Kutta particle propagator for pluggable accelerations. */
export function rk4Step(state: ParticleState, timeDays: number, dtDays: number, acceleration: AccelerationModel): ParticleState {
  const f = (s: ParticleState, t: number) => ({ position: s.velocity, velocity: acceleration(s.position, t) });
  const k1 = f(state, timeDays);
  const s2 = { position: add(state.position, scale(k1.position, dtDays / 2)), velocity: add(state.velocity, scale(k1.velocity, dtDays / 2)) };
  const k2 = f(s2, timeDays + dtDays / 2);
  const s3 = { position: add(state.position, scale(k2.position, dtDays / 2)), velocity: add(state.velocity, scale(k2.velocity, dtDays / 2)) };
  const k3 = f(s3, timeDays + dtDays / 2);
  const s4 = { position: add(state.position, scale(k3.position, dtDays)), velocity: add(state.velocity, scale(k3.velocity, dtDays)) };
  const k4 = f(s4, timeDays + dtDays);
  const weightedPosition = add(add(k1.position, scale(add(k2.position, k3.position), 2)), k4.position);
  const weightedVelocity = add(add(k1.velocity, scale(add(k2.velocity, k3.velocity), 2)), k4.velocity);
  return {
    position: add(state.position, scale(weightedPosition, dtDays / 6)),
    velocity: add(state.velocity, scale(weightedVelocity, dtDays / 6)),
  };
}

/** Convenience wrapper for a fixed-mass Newtonian body field. */
export function rk4MassFieldStep(
  state: ParticleState,
  timeDays: number,
  dtDays: number,
  bodies: readonly MassiveBody[],
): ParticleState {
  return rk4Step(state, timeDays, dtDays, (position) => gravitationalAcceleration(position, bodies));
}

export function propagateFixedStep(
  initial: ParticleState,
  startDays: number,
  steps: number,
  dtDays: number,
  acceleration: AccelerationModel,
): PropagationStep[] {
  if (!Number.isInteger(steps) || steps < 0 || !Number.isFinite(dtDays) || dtDays === 0) throw new Error('Invalid propagation grid.');
  const output: PropagationStep[] = [{ timeDays: startDays, state: initial }];
  let state = initial;
  for (let i = 1; i <= steps; i += 1) {
    state = rk4Step(state, startDays + (i - 1) * dtDays, dtDays, acceleration);
    output.push({ timeDays: startDays + i * dtDays, state });
  }
  return output;
}
