export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface StateVector {
  position: Vector3;
  velocity: Vector3;
  epochJd: number;
  frame: string;
  centralBody: string;
  accuracy: 'numerical-model' | 'approximate';
}

export const vectorMagnitude = (v: Vector3): number => Math.hypot(v.x, v.y, v.z);

export const vectorAdd = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const vectorSubtract = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const vectorScale = (v: Vector3, k: number): Vector3 => ({ x: v.x * k, y: v.y * k, z: v.z * k });
