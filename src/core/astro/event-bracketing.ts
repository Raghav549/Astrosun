import { normalizeDegrees, signedDegrees } from './angles';

export type RootFunction = (jd: number) => number;

export interface RootBracket {
  leftJd: number;
  rightJd: number;
  leftValue: number;
  rightValue: number;
}

export interface RootSolveResult {
  jd: number;
  residual: number;
  iterations: number;
}

/** Find the first sign-changing bracket in a uniformly sampled JD interval. */
export function bracketFirstRoot(
  fn: RootFunction,
  startJd: number,
  endJd: number,
  stepDays: number,
): RootBracket | null {
  if (!(startJd < endJd) || !(stepDays > 0)) throw new Error('Invalid root-bracketing interval.');
  let leftJd = startJd;
  let leftValue = fn(leftJd);
  for (let rightJd = Math.min(startJd + stepDays, endJd); rightJd <= endJd + 1e-12; rightJd = Math.min(rightJd + stepDays, endJd)) {
    const rightValue = fn(rightJd);
    if (leftValue === 0 || rightValue === 0 || Math.sign(leftValue) !== Math.sign(rightValue)) {
      return { leftJd, rightJd, leftValue, rightValue };
    }
    if (rightJd >= endJd) break;
    leftJd = rightJd;
    leftValue = rightValue;
  }
  return null;
}

/** Bisection root solve for a continuous scalar event function. */
export function solveBracketedRoot(fn: RootFunction, bracket: RootBracket, tolerance = 1e-10, maxIterations = 80): RootSolveResult {
  let a = bracket.leftJd;
  let b = bracket.rightJd;
  let fa = bracket.leftValue;
  let fb = bracket.rightValue;
  if (fa === 0) return { jd: a, residual: 0, iterations: 0 };
  if (fb === 0) return { jd: b, residual: 0, iterations: 0 };
  if (Math.sign(fa) === Math.sign(fb)) throw new Error('Root bracket does not straddle zero.');

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const mid = (a + b) / 2;
    const fm = fn(mid);
    if (Math.abs(fm) <= tolerance || Math.abs(b - a) <= tolerance) {
      return { jd: mid, residual: fm, iterations: iteration };
    }
    if (Math.sign(fa) !== Math.sign(fm)) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
  }
  const jd = (a + b) / 2;
  return { jd, residual: fn(jd), iterations: maxIterations };
}

/** Circular angular root function: signed difference from a target angle. */
export function angularRoot(valueDeg: number, targetDeg: number): number {
  return signedDegrees(normalizeDegrees(valueDeg) - normalizeDegrees(targetDeg));
}
