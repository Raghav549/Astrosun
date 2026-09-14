import type { Vector3 } from './state';

export interface MassiveBody {
  id: string;
  massSolarMasses: number;
  position: Vector3;
  velocity: Vector3;
}

export interface ParticleState {
  position: Vector3;
  velocity: Vector3;
}

export const G_AU3_MASS_DAY2 = 0.00029591220828559104;

const sub = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const add = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const scale = (a: Vector3, k: number): Vector3 => ({ x: a.x * k, y: a.y * k, z: a.z * k });

/** Newtonian point-mass acceleration in AU/day². */
export function gravitationalAcceleration(particle: Vector3, bodies: readonly MassiveBody[]): Vector3 {
  let result: Vector3 = { x: 0, y: 0, z: 0 };
  for (const body of bodies) {
    const r = sub(body.position, particle);
    const r2 = r.x * r.x + r.y * r.y + r.z * r.z;
    const r3 = Math.pow(Math.max(r2, Number.EPSILON), 1.5);
    result = add(result, scale(r, G_AU3_MASS_DAY2 * body.massSolarMasses / r3));
  }
  return result;
}

/** One explicit velocity-Verlet step for an N-body/particle baseline. */
export function velocityVerletStep(
  state: ParticleState,
  dtDays: number,
  bodiesAtStart: readonly MassiveBody[],
  bodiesAtEnd: readonly MassiveBody[],
): ParticleState {
  const a0 = gravitationalAcceleration(state.position, bodiesAtStart);
  const halfVelocity = add(state.velocity, scale(a0, 0.5 * dtDays));
  const position = add(state.position, scale(halfVelocity, dtDays));
  const a1 = gravitationalAcceleration(position, bodiesAtEnd);
  const velocity = add(halfVelocity, scale(a1, 0.5 * dtDays));
  return { position, velocity };
}
