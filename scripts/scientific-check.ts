import { assertScientificInvariants } from '../src/core/astro/invariants.ts';
import { assertDynamicsInvariants } from '../src/core/dynamics/invariants.ts';
import { classifySolarEclipse } from '../src/core/astro/eclipse-geometry.ts';
import { observerGeometry, equatorialToHorizontal } from '../src/core/astro/observer-geometry.ts';
import { atmosphericRefractionDeg } from '../src/core/astro/refraction.ts';
import { schwarzschildRadiusKm } from '../src/core/physics/astro-formulas.ts';
import { gravitationalTimeDilationFactor } from '../src/core/physics/relativistic.ts';
import { flatOmegaResidual } from '../src/core/physics/cosmology.ts';
import { computePanchanga } from '../src/core/panchanga/engine.ts';

const date = new Date('2026-01-01T00:00:00Z');
assertScientificInvariants(date);
assertDynamicsInvariants();

const p = computePanchanga(date, { sidereal: true, location: { latitudeDeg: 25.5941, longitudeDeg: 85.1376, elevationMeters: 53, timeZone: 'Asia/Kolkata' }, ruleSet: 'generic-lunisolar-v1' });
if (!p.localDate || !p.timeZone || p.nakshatra.pada < 1 || p.nakshatra.pada > 4) throw new Error('Panchanga location invariant failed.');

const site = observerGeometry({ latitudeDeg: 25.5941, longitudeDeg: 85.1376, elevationMeters: 53 });
if (!Number.isFinite(site.geocentricRadiusEarthRadii) || !Number.isFinite(site.geocentricZEarthRadii)) throw new Error('Observer geometry invariant failed.');
const horizontal = equatorialToHorizontal(120, 20, p.jd, { latitudeDeg: 25.5941, longitudeDeg: 85.1376 });
if (horizontal.altitudeDeg < -90 || horizontal.altitudeDeg > 90) throw new Error('Horizontal altitude invariant failed.');
if (!(atmosphericRefractionDeg(30) > 0)) throw new Error('Refraction invariant failed.');

const eclipse = classifySolarEclipse({ sunAngularRadiusDeg: 0.2666, moonAngularRadiusDeg: 0.2725, centerSeparationDeg: 0.05, observerDistanceEarthRadii: 1 });
if (eclipse.class === 'none') throw new Error('Eclipse geometry invariant failed.');

const rs = schwarzschildRadiusKm({ massSolar: 1 });
if (!(rs > 2 && rs < 4)) throw new Error('Schwarzschild radius invariant failed.');
if (!(gravitationalTimeDilationFactor(5.9722e24, 6371) > 0 && gravitationalTimeDilationFactor(5.9722e24, 6371) < 1)) throw new Error('Relativistic factor invariant failed.');
if (Math.abs(flatOmegaResidual({ H0KmPerSecPerMpc: 70, omegaMatter: 0.3, omegaLambda: 0.7 })) > 1e-12) throw new Error('Cosmology flatness invariant failed.');

console.log('AstroSun scientific invariants: PASS');
