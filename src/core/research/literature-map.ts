export interface LiteratureReference {
  id: string;
  title: string;
  role: 'ephemeris' | 'astrodynamics' | 'celestial-mechanics' | 'astronomy-software' | 'calendar';
  implementationImpact: string;
}

/** Curated research-to-architecture map; citations remain external evidence, not runtime authority. */
export const ASTROSUN_LITERATURE_MAP: readonly LiteratureReference[] = [
  { id: '2509.19549', title: 'A High-Precision, Differentiable Code for Solar System Ephemerides', role: 'ephemeris', implementationImpact: 'Supports provider boundaries around JPL DE data, high-order integration, pluggable acceleration models, and explicit validation.' },
  { id: '2601.06452', title: 'Brahe: A Modern Astrodynamics Library for Research and Engineering Applications', role: 'astrodynamics', implementationImpact: 'Supports explicit time/reference-frame APIs, perturbation models, propagation, and testable visibility workflows.' },
  { id: '2510.23179', title: 'Open-Source High-Fidelity Orbit Estimation for Planetary Science and Space Situational Awareness Using the Tudat Software', role: 'astrodynamics', implementationImpact: 'Supports modular high-fidelity estimation and propagation boundaries instead of monolithic orbital logic.' },
  { id: '2411.12774', title: 'EphemerisSources.jl: Idiomatic Ephemeris Sourcing and Parsing in Julia', role: 'ephemeris', implementationImpact: 'Supports treating ephemeris files as versioned source data with parsers/adapters rather than embedding undocumented constants.' },
  { id: '2105.00800', title: 'Revisiting high-order Taylor methods for astrodynamics and celestial mechanics', role: 'celestial-mechanics', implementationImpact: 'Supports keeping numerical integrators modular so higher-order methods can replace baseline RK/Verlet implementations.' },
];
