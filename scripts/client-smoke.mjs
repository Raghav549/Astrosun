import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root,'dist');
const index = path.join(dist,'index.html');
const manifest = path.join(dist,'manifest.webmanifest');
const sw = path.join(dist,'sw.js');

for (const file of [index,manifest,sw]) {
  if (!fs.existsSync(file)) throw new Error(`Missing built runtime asset: ${path.relative(root,file)}`);
}

const html = fs.readFileSync(index,'utf8');
const manifestText = fs.readFileSync(manifest,'utf8');
const swText = fs.readFileSync(sw,'utf8');
if (!html.includes('id="root"')) throw new Error('Built HTML has no React root.');
if (!html.includes('/src/main.jsx') && !html.includes('/assets/')) throw new Error('Built HTML has no application script reference.');
if (!html.includes('/src/boot.css') && !html.includes('/assets/')) throw new Error('Built HTML has no boot stylesheet reference.');
if (!manifestText.includes('AstroSun') && !manifestText.includes('ऐस्ट्रोसुन')) throw new Error('Built manifest is invalid.');
if (!swText.includes('astrosun-v4')) throw new Error('Built service worker cache version is stale.');
console.log('AstroSun built client smoke: PASS');
