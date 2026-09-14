/** Minimal cosmology relations; not a full Boltzmann/structure-formation solver. */

export interface FlatLambdaCDM { H0KmPerSecPerMpc: number; omegaMatter: number; omegaLambda: number; }
const MPC_KM = 3.0856775814913673e19;

export function hubbleSI(model: FlatLambdaCDM): number {
  if (!(model.H0KmPerSecPerMpc > 0)) throw new Error('H0 must be positive.');
  return model.H0KmPerSecPerMpc / MPC_KM;
}

export function criticalDensityKgM3(model: FlatLambdaCDM): number {
  const G = 6.67430e-11;
  const H0 = hubbleSI(model);
  return 3 * H0 * H0 / (8 * Math.PI * G);
}

export function decelerationParameter(model: FlatLambdaCDM): number {
  return 0.5 * model.omegaMatter - model.omegaLambda;
}

export function flatOmegaResidual(model: FlatLambdaCDM): number {
  return model.omegaMatter + model.omegaLambda - 1;
}
