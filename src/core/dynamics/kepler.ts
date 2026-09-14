import type { StateVector, Vector3 } from './state';

const DEG = Math.PI / 180;

export interface KeplerElements {
  semiMajorAxisAU: number;
  eccentricity: number;
  inclinationDeg: number;
  raanDeg: number;
  argumentOfPeriapsisDeg: number;
  meanAnomalyDeg: number;
  epochJd: number;
}

const solveKepler = (M: number, e: number): number => {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 20; i += 1) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    const d = f / fp;
    E -= d;
    if (Math.abs(d) < 1e-13) break;
  }
  return E;
};

/** Two-body Kepler propagation helper; not a perturbation-inclusive ephemeris. */
export function propagateKepler(
  elements: KeplerElements,
  epochJd: number,
  muAU3PerDay2: number,
): StateVector {
  if (elements.eccentricity < 0 || elements.eccentricity >= 1) throw new RangeError('elliptic propagation requires 0 <= e < 1');
  if (elements.semiMajorAxisAU <= 0) throw new RangeError('semi-major axis must be positive');

  const a = elements.semiMajorAxisAU;
  const e = elements.eccentricity;
  const dt = epochJd - elements.epochJd;
  const n = Math.sqrt(muAU3PerDay2 / (a * a * a));
  const M = ((elements.meanAnomalyDeg * DEG) + n * dt) % (2 * Math.PI);
  const E = solveKepler((M + 2 * Math.PI) % (2 * Math.PI), e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const r = a * (1 - e * cosE);
  const xOrb = a * (cosE - e);
  const yOrb = a * Math.sqrt(1 - e * e) * sinE;
  const fac = Math.sqrt(muAU3PerDay2 * a) / r;
  const vxOrb = -fac * sinE;
  const vyOrb = fac * Math.sqrt(1 - e * e) * cosE;

  const O = elements.raanDeg * DEG;
  const i = elements.inclinationDeg * DEG;
  const w = elements.argumentOfPeriapsisDeg * DEG;
  const cO = Math.cos(O); const sO = Math.sin(O);
  const ci = Math.cos(i); const si = Math.sin(i);
  const cw = Math.cos(w); const sw = Math.sin(w);
  const R11 = cO * cw - sO * sw * ci;
  const R12 = -cO * sw - sO * cw * ci;
  const R21 = sO * cw + cO * sw * ci;
  const R22 = -sO * sw + cO * cw * ci;
  const R31 = sw * si;
  const R32 = cw * si;
  const position: Vector3 = { x: R11 * xOrb + R12 * yOrb, y: R21 * xOrb + R22 * yOrb, z: R31 * xOrb + R32 * yOrb };
  const velocity: Vector3 = { x: R11 * vxOrb + R12 * vyOrb, y: R21 * vxOrb + R22 * vyOrb, z: R31 * vxOrb + R32 * vyOrb };

  return { position, velocity, epochJd, frame: 'heliocentric-ecliptic-J2000-baseline', centralBody: 'Sun', accuracy: 'approximate' };
}
