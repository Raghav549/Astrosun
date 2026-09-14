/** Dimensionally explicit flat-LambdaCDM relations plus a numerical lookback/age integrator. */

export interface FlatLambdaCDM { H0KmPerSecPerMpc: number; omegaMatter: number; omegaLambda: number; }
const MPC_KM = 3.0856775814913673e19;
const G = 6.67430e-11;
const SEC_PER_GYR = 365.25 * 86400 * 1e9;

export function hubbleSI(model: FlatLambdaCDM): number {
  if (!(model.H0KmPerSecPerMpc > 0)) throw new Error('H0 must be positive.');
  return model.H0KmPerSecPerMpc / MPC_KM;
}

export function criticalDensityKgM3(model: FlatLambdaCDM): number {
  const H0 = hubbleSI(model);
  return 3 * H0 * H0 / (8 * Math.PI * G);
}

export function decelerationParameter(model: FlatLambdaCDM): number {
  return 0.5 * model.omegaMatter - model.omegaLambda;
}

export function flatOmegaResidual(model: FlatLambdaCDM): number {
  return model.omegaMatter + model.omegaLambda - 1;
}

function e(a: number, model: FlatLambdaCDM): number {
  const omegaK = 1 - model.omegaMatter - model.omegaLambda;
  return Math.sqrt(model.omegaMatter / (a ** 3) + omegaK / (a ** 2) + model.omegaLambda);
}

/** Cosmic age for a flat Lambda-CDM model in Gyr, numerically integrated from a≈0 to 1. */
export function cosmicAgeGyr(model: FlatLambdaCDM, steps = 20000): number {
  if (!(steps > 100)) throw new RangeError('steps must be > 100');
  if (steps % 2 !== 0) throw new RangeError('steps must be even for Simpson integration');
  const minA = 1e-8;
  const h = (1 - minA) / steps;
  let sum = 0;
  const integrand = (a: number) => 1 / (a * e(a, model));
  for (let i = 0; i <= steps; i += 1) {
    const a = minA + i * h;
    const w = i === 0 || i === steps ? 1 : (i % 2 === 0 ? 2 : 4);
    sum += w * integrand(a);
  }
  return (sum * h / 3) / hubbleSI(model) / SEC_PER_GYR;
}

/** Lookback time to redshift z using the same dimensionless expansion model. */
export function lookbackTimeGyr(model: FlatLambdaCDM, z: number, steps = 20000): number {
  if (!(z >= 0) || !Number.isFinite(z)) throw new RangeError('z must be finite and >= 0');
  if (steps % 2 !== 0) throw new RangeError('steps must be even for Simpson integration');
  const aMin = 1 / (1 + z);
  const h = (1 - aMin) / steps;
  const integrand = (a: number) => 1 / (a * e(a, model));
  let sum = 0;
  for (let i = 0; i <= steps; i += 1) {
    const a = aMin + i * h;
    const w = i === 0 || i === steps ? 1 : (i % 2 === 0 ? 2 : 4);
    sum += w * integrand(a);
  }
  return (sum * h / 3) / hubbleSI(model) / SEC_PER_GYR;
}
