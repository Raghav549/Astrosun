/** Angle utilities shared by astronomical and calendar engines. */
export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

export function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function signedDegrees(value: number): number {
  const n = normalizeDegrees(value);
  return n > 180 ? n - 360 : n;
}

export function angularDistance(a: number, b: number): number {
  return Math.abs(signedDegrees(a - b));
}

/** Alias kept for event/eclipses code: scalar angular separation in degrees. */
export function angularSeparationDeg(a: number, b: number): number {
  return angularDistance(a, b);
}

/** Linear interpolation on a circular angle domain. */
export function interpolateAngle(a: number, b: number, fraction: number): number {
  return normalizeDegrees(a + signedDegrees(b - a) * fraction);
}
