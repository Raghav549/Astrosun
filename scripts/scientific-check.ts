import { assertScientificInvariants } from '../src/core/astro/invariants.ts';
import { assertDynamicsInvariants } from '../src/core/dynamics/invariants.ts';

assertScientificInvariants(new Date('2026-01-01T00:00:00Z'));
assertDynamicsInvariants();
console.log('Astrosun scientific invariants: PASS');
