import { assertScientificInvariants } from '../src/core/astro/invariants.ts';
import { assertDynamicsInvariants } from '../src/core/dynamics/invariants.ts';
import { classifySolarEclipse } from '../src/core/astro/eclipse-geometry.ts';
import { solarEclipseContacts } from '../src/core/astro/eclipse-path.ts';
import { observerGeometry, equatorialToHorizontal } from '../src/core/astro/observer-geometry.ts';
import { atmosphericRefractionDeg } from '../src/core/astro/refraction.ts';
import { schwarzschildRadiusKm, stefanBoltzmannLuminosityWatts } from '../src/core/physics/astro-formulas.ts';
import { gravitationalTimeDilationFactor } from '../src/core/physics/relativistic.ts';
import { flatOmegaResidual, cosmicAgeGyr, lookbackTimeGyr } from '../src/core/physics/cosmology.ts';
import { computePanchanga } from '../src/core/panchanga/engine.ts';
import { getRegionalPolicy, validateRegionalContext } from '../src/core/panchanga/regional.ts';
import { REGIONAL_PANCHANGA_POLICIES } from '../src/core/panchanga/regional.ts';
import { selectBoundary } from '../src/core/panchanga/day-boundary.ts';
import { buildJyotishaChart } from '../src/core/panchanga/jyotisha.ts';
import { getJyotishaWorkspace, JYOTISHA_WORKSPACES } from '../src/core/jyotisha-workspaces.ts';
import { principalSigma2D } from '../src/core/astro/uncertainty.ts';
import { evaluateAngularBenchmarks } from '../src/core/astro/benchmark-suite.ts';
import { validatePropagationRequest } from '../src/core/astro/state-propagation.ts';
import { ProviderRegistry } from '../src/core/astro/provider-registry.ts';

const date = new Date('2026-01-01T00:00:00Z');
assertScientificInvariants(date);
assertDynamicsInvariants();

const location = { latitudeDeg: 25.5941, longitudeDeg: 85.1376, elevationMeters: 53, timeZone: 'Asia/Kolkata' };
const p = computePanchanga(date, { sidereal: true, location, ruleSet: 'regional:north-india' });
if (!p.localDate || !p.timeZone || p.nakshatra.pada < 1 || p.nakshatra.pada > 4) throw new Error('Panchanga location invariant failed.');

const site = observerGeometry(location);
if (!Number.isFinite(site.geocentricRadiusEarthRadii) || !Number.isFinite(site.geocentricZEarthRadii)) throw new Error('Observer geometry invariant failed.');
const horizontal = equatorialToHorizontal(120, 20, p.jd, location);
if (horizontal.altitudeDeg < -90 || horizontal.altitudeDeg > 90) throw new Error('Horizontal altitude invariant failed.');
if (!(atmosphericRefractionDeg(30) > 0)) throw new Error('Refraction invariant failed.');

const eclipse = classifySolarEclipse({ sunAngularRadiusDeg: 0.2666, moonAngularRadiusDeg: 0.2725, centerSeparationDeg: 0.05, observerDistanceEarthRadii: 1 });
if (eclipse.class === 'none') throw new Error('Eclipse geometry invariant failed.');
const contacts = solarEclipseContacts(
  { rightAscensionDeg: 10, declinationDeg: 5, distanceKm: 149_597_870, radiusKm: 695_700 },
  { rightAscensionDeg: 10.01, declinationDeg: 5.01, distanceKm: 384_400, radiusKm: 1_737.4 },
);
if (!contacts.candidate) throw new Error('Eclipse contact geometry invariant failed.');

const rs = schwarzschildRadiusKm({ massSolar: 1 });
if (!(rs > 2 && rs < 4)) throw new Error('Schwarzschild radius invariant failed.');
if (!(stefanBoltzmannLuminosityWatts({ radiusSolar: 1, temperatureK: 5772 }) > 0)) throw new Error('Stellar luminosity invariant failed.');
if (!(gravitationalTimeDilationFactor(5.9722e24, 6371) > 0 && gravitationalTimeDilationFactor(5.9722e24, 6371) < 1)) throw new Error('Relativistic factor invariant failed.');
const cosmology = { H0KmPerSecPerMpc: 70, omegaMatter: 0.3, omegaLambda: 0.7 };
if (Math.abs(flatOmegaResidual(cosmology)) > 1e-12) throw new Error('Cosmology flatness invariant failed.');
if (!(cosmicAgeGyr(cosmology, 1000) > 1 && cosmicAgeGyr(cosmology, 1000) < 30)) throw new Error('Cosmic age invariant failed.');
if (!(lookbackTimeGyr(cosmology, 1, 1000) > 0)) throw new Error('Lookback time invariant failed.');

const policy = getRegionalPolicy('north-india');
validateRegionalContext(policy, location);
const midnight = selectBoundary(date, location, 'midnight');
if (!(midnight.utc instanceof Date) || !midnight.localDateIso) throw new Error('Day-boundary invariant failed.');

const chart = buildJyotishaChart(date, { longitudeDeg: location.longitudeDeg, location, ruleSet: 'regional:north-india' });
if (chart.sun.signIndex < 0 || chart.sun.signIndex > 11 || chart.moon.signIndex < 0 || chart.moon.signIndex > 11) throw new Error('Jyotisha graha sign invariant failed.');
if (chart.ayanamsa !== 'Lahiri') throw new Error('Jyotisha ayanamsa invariant failed.');
if (!getJyotishaWorkspace('kundli') || JYOTISHA_WORKSPACES.length < 10) throw new Error('Jyotisha workspace catalogue invariant failed.');

const ellipse = principalSigma2D({ xx: 4, xy: 1, yy: 1 });
if (!(ellipse.major >= ellipse.minor && ellipse.minor >= 0)) throw new Error('Uncertainty ellipse invariant failed.');
const benchmark = evaluateAngularBenchmarks([{ id: 'identity', dateIso: date.toISOString(), actualDeg: 12, referenceDeg: 12, toleranceArcsec: 0 }]);
if (!benchmark.passed || benchmark.maxErrorArcsec !== 0) throw new Error('Benchmark invariant failed.');

const providerRegistry = new ProviderRegistry();
if (providerRegistry.list().length !== 0) throw new Error('Provider registry invariant failed.');

const start = {
  id: 'fixture', version: '1', accuracy: 'high-precision' as const, epochJd: p.jd, timeScale: 'TDB' as const,
  frame: 'barycentric-icrf' as const, state: { positionKm: [0, 0, 0] as [number, number, number], velocityKmPerSec: [0, 0, 0] as [number, number, number] }, notes: [],
};
validatePropagationRequest({ body: 'Earth', start, targetEpochJd: p.jd + 1, stepDays: 0.25, scale: 'TDB', frame: 'barycentric-icrf' });

console.log('AstroSun scientific invariants: PASS');
