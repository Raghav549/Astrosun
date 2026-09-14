/** SI constants retained in one module so physical formulas share exact sources. */
export const SPEED_OF_LIGHT_MPS = 299_792_458;
export const GRAVITATIONAL_CONSTANT_SI = 6.67430e-11;
export const ASTRONOMICAL_UNIT_M = 149_597_870_700;
export const JULIAN_DAY_SECONDS = 86_400;
export const SOLAR_MASS_KG = 1.98847e30;
export const EARTH_MASS_KG = 5.9722e24;
export const MOON_MASS_KG = 7.342e22;

export const secondsToDays = (seconds: number): number => seconds / JULIAN_DAY_SECONDS;
export const daysToSeconds = (days: number): number => days * JULIAN_DAY_SECONDS;
