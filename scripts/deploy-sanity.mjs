import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'package.json',
  'vite.config.js',
  'src/main.jsx',
  'src/styles.css',
  'public/manifest.webmanifest',
  'public/sw.js',
  'public/icon-192.png',
  'public/icon-512.png',
];

for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing deployment file: ${file}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const script of ['build', 'typecheck', 'scientific:check']) {
  if (!pkg.scripts?.[script]) throw new Error(`Missing npm script: ${script}`);
}

const main = fs.readFileSync(path.join(root, 'src/main.jsx'), 'utf8');
if (!main.includes("import './styles.css'")) throw new Error('Main stylesheet import missing');
if (!main.includes('LanguageGate')) throw new Error('Language gate missing');
if (!main.includes('IntroScreen')) throw new Error('Intro screen missing');
if (!main.includes('buildRuntimeSnapshot')) throw new Error('Runtime engine not wired');

console.log('AstroSun deployment sanity checks: PASS');
