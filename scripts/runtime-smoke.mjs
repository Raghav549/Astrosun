import http from 'node:http';
import { spawn } from 'node:child_process';

const port = Number(process.env.ASTROSUN_SMOKE_PORT || 4173);
const child = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const timeout = setTimeout(() => {
  child.kill('SIGTERM');
  console.error('Runtime smoke test timed out.');
  process.exit(1);
}, 60000);

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
    });
    req.on('error', reject);
  });
}

async function main() {
  let ready = false;
  for (let i = 0; i < 60; i += 1) {
    try {
      const root = await request('/');
      if (root.status === 200 && root.body.includes('id="root"')) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
    if (child.exitCode !== null) throw new Error(`Preview server exited with code ${child.exitCode}.`);
  }
  if (!ready) throw new Error('Preview server did not become ready.');

  const root = await request('/');
  const manifest = await request('/manifest.webmanifest');
  const sw = await request('/sw.js');

  if (root.status !== 200) throw new Error(`Root returned ${root.status}`);
  if (manifest.status !== 200) throw new Error(`Manifest returned ${manifest.status}`);
  if (sw.status !== 200) throw new Error(`Service worker returned ${sw.status}`);
  if (!root.body.includes('/assets/') && !root.body.includes('/src/')) throw new Error('Root HTML does not reference application assets.');
  if (!manifest.body.includes('AstroSun')) throw new Error('Manifest content is invalid.');
  if (!sw.body.includes('CACHE')) throw new Error('Service worker content is invalid.');

  console.log('AstroSun runtime smoke: PASS');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}).finally(() => {
  clearTimeout(timeout);
  setTimeout(() => child.kill('SIGTERM'), 100);
});