/** Apparent-altitude refraction model. Inputs/outputs are degrees. */
export type RefractionModel = 'none' | 'bennett-1982';

export interface AtmosphericConditions {
  pressureHpa: number;
  temperatureC: number;
}

export function atmosphericRefractionDeg(altitudeDeg: number, model: RefractionModel = 'bennett-1982', conditions: AtmosphericConditions = { pressureHpa: 1010, temperatureC: 10 }): number {
  if (model === 'none' || altitudeDeg < -1) return 0;
  const safe = Math.min(89.9, Math.max(-1, altitudeDeg));
  const rArcmin = (1.02 / Math.tan((safe + 10.3 / (safe + 5.11)) * Math.PI / 180));
  const scale = (conditions.pressureHpa / 1010) * (283 / (273 + conditions.temperatureC));
  return (rArcmin * scale) / 60;
}

export function apparentAltitudeDeg(geometricAltitudeDeg: number, model: RefractionModel = 'bennett-1982', conditions?: AtmosphericConditions): number {
  return geometricAltitudeDeg + atmosphericRefractionDeg(geometricAltitudeDeg, model, conditions);
}
