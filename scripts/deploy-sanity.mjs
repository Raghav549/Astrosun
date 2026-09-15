import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=['index.html','package.json','src/main.jsx','src/styles.css','src/ui-polish.css','public/manifest.webmanifest','public/sw.js','public/icon-192.png','public/icon-512.png'];
for(const file of required){if(!fs.existsSync(path.join(root,file)))throw new Error(`Missing deployment file: ${file}`)}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
for(const script of ['build','typecheck','scientific:check','deploy:check','runtime:smoke','client:smoke']){if(!pkg.scripts?.[script])throw new Error(`Missing npm script: ${script}`)}
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!main.includes("import'./styles.css'"))throw new Error('Main stylesheet import missing');
if(!main.includes("import'./ui-polish.css'"))throw new Error('UI polish stylesheet import missing');
if(!main.includes('LanguageGate'))throw new Error('Language gate missing');
if(!main.includes('IntroScreen'))throw new Error('Intro screen missing');
if(!main.includes('buildRuntimeSnapshot'))throw new Error('Runtime engine not wired');
if(!main.includes('createRoot'))throw new Error('React root bootstrap missing');
if(!index.includes('id="root"'))throw new Error('Root element missing');
if(!index.includes('/src/main.jsx'))throw new Error('Application module link missing');
console.log('AstroSun deployment sanity checks: PASS');
