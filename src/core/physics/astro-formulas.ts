/** Dimensionally explicit baseline astrophysics formulas. */

export interface StellarLuminosityInput { radiusSolar: number; temperatureK: number; }
export interface BlackHoleRadiusInput { massSolar: number; }

const PI4 = 4 * Math.PI;
const SIGMA_SB_W_M2_K4 = 5.670374419e-8;
const SOLAR_RADIUS_M = 6.957e8;
const C_M_S = 299_792_458;
const G_SI = 6.67430e-11;
const SOLAR_MASS_KG = 1.98847e30;

export function stefanBoltzmannLuminosityWatts(input: StellarLuminosityInput): number {
  if (!(input.radiusSolar > 0) || !(input.temperatureK > 0)) throw new Error('Radius and temperature must be positive.');
  const radiusM = input.radiusSolar * SOLAR_RADIUS_M;
  return PI4 * radiusM * radiusM * SIGMA_SB_W_M2_K4 * input.temperatureK ** 4;
}

/** Schwarzschild radius for an isolated, non-rotating black hole. */
export function schwarzschildRadiusKm(input: BlackHoleRadiusInput): number {
  if (!(input.massSolar > 0)) throw new Error('Mass must be positive.');
  const radiusM = (2 * G_SI * input.massSolar * SOLAR_MASS_KG) / (C_M_S * C_M_S);
  return radiusM / 1000;
}
