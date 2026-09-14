/** Small, deterministic uncertainty primitives for state/observable propagation. */
export interface Sigma2D {
  xx: number;
  xy: number;
  yy: number;
}

export interface Sigma3D {
  xx: number;
  xy: number;
  xz: number;
  yy: number;
  yz: number;
  zz: number;
}

export interface UncertaintySummary {
  sigma: number;
  variance: number;
  confidence: '1-sigma';
}

export function validateSigma2D(cov: Sigma2D): void {
  if (![cov.xx, cov.xy, cov.yy].every(Number.isFinite)) throw new Error('2D covariance contains non-finite values.');
  if (cov.xx < 0 || cov.yy < 0 || cov.xx * cov.yy - cov.xy * cov.xy < -1e-15) throw new Error('2D covariance is not positive semidefinite.');
}

export function principalSigma2D(cov: Sigma2D): { major: number; minor: number; angleDeg: number } {
  validateSigma2D(cov);
  const trace = cov.xx + cov.yy;
  const delta = Math.hypot(cov.xx - cov.yy, 2 * cov.xy);
  const lambdaMajor = Math.max(0, (trace + delta) / 2);
  const lambdaMinor = Math.max(0, (trace - delta) / 2);
  return {
    major: Math.sqrt(lambdaMajor),
    minor: Math.sqrt(lambdaMinor),
    angleDeg: Math.atan2(2 * cov.xy, cov.xx - cov.yy) * 90 / Math.PI,
  };
}

export function linearizedSigma1D(gradient: readonly number[], covariance: readonly (readonly number[])[]): UncertaintySummary {
  if (!gradient.length || covariance.length !== gradient.length || covariance.some((row) => row.length !== gradient.length)) throw new Error('Gradient/covariance dimensions do not match.');
  let variance = 0;
  for (let i = 0; i < gradient.length; i += 1) for (let j = 0; j < gradient.length; j += 1) variance += gradient[i] * covariance[i][j] * gradient[j];
  if (variance < -1e-12) throw new Error('Linearized variance is negative.');
  return { variance: Math.max(0, variance), sigma: Math.sqrt(Math.max(0, variance)), confidence: '1-sigma' };
}
