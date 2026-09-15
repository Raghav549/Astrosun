import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/ui/production-app.jsx', import.meta.url), 'utf8');
const requiredRoutes = ['home','language','panchanga','sky','astrophysics','research','settings','kundli','graha','bhava','nakshatra','dasha','transits','muhurta','vivah','rituals','gemstones','palm','evidence','ephemeris','dynamics','eclipse','observer','time','uncertainty','benchmarks','library'];
const requiredImplementations = ['function Panchanga','function Sky','function Jyotisha','function Settings','function PalmPanel','function EvidencePanel','function DashaPanel','function TransitPanel','function MuhurtaPanel','function VivahPanel','function RitualPanel'];
const missing = requiredRoutes.filter((id) => !source.includes(`'${id}'`));
if (missing.length) throw new Error(`Missing production routes: ${missing.join(', ')}`);
for (const token of requiredImplementations) {
  if (!source.includes(token)) throw new Error(`Missing substantive implementation: ${token}`);
}
if (source.includes('Unknown Panchanga policy')) throw new Error('Generic unknown-policy handling leaked into UI source');
if (!source.includes('OrbitalScene') || !source.includes('requestAnimationFrame')) throw new Error('Calculation-linked animation surface missing');
if (!source.includes('/api/profile') || !source.includes('/api/history')) throw new Error('Persistent API integration missing');
console.log(`Feature route audit: PASS (${requiredRoutes.length} production routes, ${requiredImplementations.length} implementation gates)`);