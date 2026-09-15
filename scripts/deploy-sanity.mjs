import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=['index.html','package.json','src/main-production2.jsx','src/ui/production-shell.jsx','src/ui/production-pages.jsx','src/ui/production-core.jsx','src/ui/production.css','public/manifest.webmanifest','public/sw.js','public/icon-192.png','public/icon-512.png','server/index.mjs'];
for(const file of required){if(!fs.existsSync(path.join(root,file)))throw new Error(`Missing deployment file: ${file}`)}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
for(const script of ['build','typecheck','scientific:check','deploy:check','runtime:smoke','client:smoke','feature:audit','server:start'])if(!pkg.scripts?.[script])throw new Error(`Missing npm script: ${script}`);
const main=fs.readFileSync(path.join(root,'src/main-production2.jsx'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!main.includes('createRoot'))throw new Error('React root bootstrap missing');
if(!main.includes('buildRuntimeSnapshot'))throw new Error('Runtime engine not wired');
if(!main.includes("api('/api/profile')"))throw new Error('Persistent profile API not wired');
if(!main.includes("api('/api/history'"))throw new Error('Persistent calculation history API not wired');
if(!index.includes('id="root"'))throw new Error('Root element missing');
if(!index.includes('/src/main-production2.jsx'))throw new Error('Production application module link missing');
console.log('AstroSun deployment sanity checks: PASS');