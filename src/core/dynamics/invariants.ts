import type { MassiveBody } from './nbody';
import { gravitationalAcceleration } from './nbody';
import { vectorMagnitude, type Vector3 } from './state';

export interface DynamicsInvariantResult {
  name: string;
  passed: boolean;
  details: string;
}

export function runDynamicsInvariants(): DynamicsInvariantResult[] {
  const particle: Vector3 = { x: 1, y: 0, z: 0 };
  const sun: MassiveBody = {
    id: 'Sun',
    massSolarMasses: 1,
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
  };
  const a = gravitationalAcceleration(particle, [sun]);
  const expectedMagnitude = 0.00029591220828559104;
  const relativeError = Math.abs(vectorMagnitude(a) - expectedMagnitude) / expectedMagnitude;
  return [
    {
      name: 'inverse-square-one-au',
      passed: relativeError < 1e-12,
      details: `relative error=${relativeError}`,
    },
    {
      name: 'sunward-direction',
      passed: a.x < 0 && Math.abs(a.y) < 1e-15 && Math.abs(a.z) < 1e-15,
      details: `a=(${a.x}, ${a.y}, ${a.z})`,
    },
  ];
}

export function assertDynamicsInvariants(): void {
  const failures = runDynamicsInvariants().filter((result) => !result.passed);
  if (failures.length) throw new Error(failures.map((x) => `${x.name}: ${x.details}`).join('\n'));
}
