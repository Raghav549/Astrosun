import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(),'dist');
const index = path.join(dist,'index.html');
const manifest = path.join(dist,'manifest.webmanifest');
const sw = path.join(dist,'sw.js');
for (const file of [index,manifest,sw]) if (!fs.existsSync(file)) throw new Error(`Missing built runtime asset: ${path.relative(process.cwd(),file)}`);
const html=fs.readFileSync(index,'utf8');
const manifestText=fs.readFileSync(manifest,'utf8');
const swText=fs.readFileSync(sw,'utf8');
if(!html.includes('id="root"')) throw new Error('Built HTML has no React root.');
if(!html.includes('/assets/')&&!html.includes('/src/')) throw new Error('Built HTML has no application script reference.');
if(!manifestText.includes('AstroSun')) throw new Error('Manifest content is invalid.');
if(!swText.includes('CACHE')) throw new Error('Service worker content is invalid.');
console.log('AstroSun runtime smoke: PASS');