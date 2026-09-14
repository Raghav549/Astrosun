import assert from 'node:assert/strict';
import {
  eclipticPositions,
  computePanchanga,
  lunarPhaseAngle,
} from '../src/core/index.ts';

const epoch = new Date('2000-01-01T12:00:00.000Z');
const positions = eclipticPositions(epoch);
assert.equal(positions.length, 2);
assert.equal(positions[0].body, 'Sun');
assert.equal(positions[1].body, 'Moon');
assert.equal(positions[0].accuracy, 'approximate');

const panchanga = computePanchanga(epoch);
assert.ok(panchanga.tithi.number >= 1 && panchanga.tithi.number <= 30);
assert.ok(panchanga.nakshatra.number >= 1 && panchanga.nakshatra.number <= 27);
assert.ok(panchanga.nakshatra.pada >= 1 && panchanga.nakshatra.pada <= 4);
assert.ok(panchanga.yogaDeg >= 0 && panchanga.yogaDeg < 360);
assert.ok(panchanga.karanaIndex >= 1 && panchanga.karanaIndex <= 60);

const phase = lunarPhaseAngle(epoch);
assert.ok(Number.isFinite(phase));
assert.ok(phase >= 0 && phase < 360);

console.log('Astrosun scientific smoke checks passed.');
