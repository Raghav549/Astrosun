import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
const requiredRoutes = ['home','language','panchanga','sky','astrophysics','research','settings','kundli','graha','bhava','nakshatra','dasha','transits','muhurta','vivah','rituals','gemstones','palm','evidence','ephemeris','dynamics','eclipse','observer','time','uncertainty','benchmarks','library'];
const missing = requiredRoutes.filter((id) => !source.includes(`'${id}'`));
if (missing.length) throw new Error(`Missing route identifiers: ${missing.join(', ')}`);
for (const token of ['function PanchangaPage','function SkyPage','function JyotishaPage','function ScientificPage','function SettingsPage']) {
  if (!source.includes(token)) throw new Error(`Missing screen implementation: ${token}`);
}
if (source.includes("Unknown Panchanga policy")) throw new Error('Generic unknown-policy handling leaked into UI source');
console.log(`Feature route audit: PASS (${requiredRoutes.length} routes discovered)`);
