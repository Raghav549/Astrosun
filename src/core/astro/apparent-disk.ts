/** Apparent solar/lunar disk geometry for observational rise/set calculations. */

export interface ApparentDiskPolicy {
  semidiameterArcmin: number;
  horizonDipArcmin: number;
  refractionDegrees: number;
}

export const STANDARD_SUN_RISE_SET_POLICY: ApparentDiskPolicy = {
  semidiameterArcmin: 16,
  horizonDipArcmin: 0,
  refractionDegrees: 0.5667,
};

export const STANDARD_MOON_RISE_SET_POLICY: ApparentDiskPolicy = {
  semidiameterArcmin: 16,
  horizonDipArcmin: 0,
  refractionDegrees: 0.5667,
};

export function geometricRiseSetAltitudeDeg(policy: ApparentDiskPolicy): number {
  return -(policy.semidiameterArcmin / 60) - policy.horizonDipArcmin / 60 - policy.refractionDegrees;
}
