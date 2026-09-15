import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const files=['index.html','manifest.webmanifest','sw.js'];
for(const file of files){const full=path.join(dist,file);if(!fs.existsSync(full))throw new Error(`Missing built runtime asset: ${path.relative(root,full)}`)}
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const manifest=fs.readFileSync(path.join(dist,'manifest.webmanifest'),'utf8');
const sw=fs.readFileSync(path.join(dist,'sw.js'),'utf8');
if(!html.includes('id="root"'))throw new Error('Built HTML has no React root.');
if(!html.includes('/assets/')&&!html.includes('/src/'))throw new Error('Built HTML has no application script reference.');
if(!manifest.includes('AstroSun'))throw new Error('Manifest is invalid.');
if(!sw.includes('CACHE'))throw new Error('Service worker is invalid.');
console.log('AstroSun runtime smoke: PASS');