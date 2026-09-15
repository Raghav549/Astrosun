import http from 'node:http';
import { Pool } from 'pg';

const port = Number(process.env.PORT || 10000);
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required');
const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false }, max: 5 });

const allowedOrigins = new Set([
  'https://astrosun.onrender.com',
  'https://astrosunn-psi.vercel.app',
  'https://astrosunn-raghav549s-projects.vercel.app',
  'https://astrosunn-git-main-raghav549s-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173'
]);

async function migrate() {
  await pool.query(`
    create table if not exists user_profiles (
      user_id text primary key,
      language text not null default 'en',
      theme text not null default 'system',
      unit_system text not null default 'metric',
      location_name text not null default 'Patna',
      latitude_deg double precision not null default 25.5941,
      longitude_deg double precision not null default 85.1376,
      time_zone text not null default 'Asia/Kolkata',
      rule_set text not null default 'regional:north-india',
      precision_provider text not null default 'baseline',
      updated_at timestamptz not null default now()
    );
    create table if not exists calculation_history (
      id bigserial primary key,
      user_id text not null,
      feature text not null,
      payload jsonb not null,
      created_at timestamptz not null default now()
    );
    create table if not exists research_sources (
      source_id text primary key,
      title text not null,
      url text,
      provider text not null,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
  `);
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  const headers = {
    'access-control-allow-methods': 'GET,POST,PUT,OPTIONS',
    'access-control-allow-headers': 'Content-Type, X-AstroSun-User',
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8'
  };
  if (origin && allowedOrigins.has(origin)) headers['access-control-allow-origin'] = origin;
  return headers;
}

function send(req, res, status, body) {
  const headers = corsHeaders(req);
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  if (!text) return {};
  if (text.length > 256_000) throw new Error('Request body too large');
  return JSON.parse(text);
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(req, res, 204, {});
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/health') {
      const db = await pool.query('select now() as now');
      return send(req, res, 200, { ok: true, service: 'astrosun-api', database: 'connected', serverTime: db.rows[0].now });
    }

    if (url.pathname === '/api/profile' && (req.method === 'GET' || req.method === 'PUT')) {
      const userId = req.headers['x-astrosun-user']?.toString() || url.searchParams.get('userId') || 'local-user';
      if (req.method === 'PUT') {
        const body = await readJson(req);
        const p = {
          language: String(body.language || 'en'),
          theme: ['light','dark','system'].includes(body.theme) ? body.theme : 'system',
          unitSystem: ['metric','imperial'].includes(body.unitSystem) ? body.unitSystem : 'metric',
          locationName: String(body.location?.name || 'Patna'),
          latitude: Number(body.location?.latitudeDeg ?? 25.5941),
          longitude: Number(body.location?.longitudeDeg ?? 85.1376),
          timeZone: String(body.location?.timeZone || 'Asia/Kolkata'),
          ruleSet: String(body.ruleSet || 'regional:north-india'),
          precisionProvider: String(body.precisionProvider || 'baseline')
        };
        if (![p.latitude,p.longitude].every(Number.isFinite)) throw new Error('Invalid coordinates');
        const result = await pool.query(`
          insert into user_profiles(user_id,language,theme,unit_system,location_name,latitude_deg,longitude_deg,time_zone,rule_set,precision_provider,updated_at)
          values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
          on conflict(user_id) do update set language=excluded.language,theme=excluded.theme,unit_system=excluded.unit_system,location_name=excluded.location_name,latitude_deg=excluded.latitude_deg,longitude_deg=excluded.longitude_deg,time_zone=excluded.time_zone,rule_set=excluded.rule_set,precision_provider=excluded.precision_provider,updated_at=now()
          returning *`, [userId,p.language,p.theme,p.unitSystem,p.locationName,p.latitude,p.longitude,p.timeZone,p.ruleSet,p.precisionProvider]);
        return send(req, res, 200, { profile: result.rows[0] });
      }
      const result = await pool.query('select * from user_profiles where user_id=$1', [userId]);
      return send(req, res, 200, { profile: result.rows[0] || null });
    }

    if (url.pathname === '/api/history' && req.method === 'POST') {
      const body = await readJson(req);
      const userId = req.headers['x-astrosun-user']?.toString() || 'local-user';
      const feature = String(body.feature || 'unknown');
      const payload = body.payload ?? {};
      const result = await pool.query('insert into calculation_history(user_id,feature,payload) values($1,$2,$3) returning id,created_at', [userId,feature,payload]);
      return send(req, res, 201, { id: result.rows[0].id, createdAt: result.rows[0].created_at });
    }

    if (url.pathname === '/api/history' && req.method === 'GET') {
      const userId = req.headers['x-astrosun-user']?.toString() || url.searchParams.get('userId') || 'local-user';
      const feature = url.searchParams.get('feature');
      const result = feature
        ? await pool.query('select id,feature,payload,created_at from calculation_history where user_id=$1 and feature=$2 order by created_at desc limit 100',[userId,feature])
        : await pool.query('select id,feature,payload,created_at from calculation_history where user_id=$1 order by created_at desc limit 100',[userId]);
      return send(req, res, 200, { history: result.rows });
    }

    if (url.pathname === '/api/research/sources' && req.method === 'GET') {
      const result = await pool.query('select source_id,title,url,provider,metadata,created_at from research_sources order by created_at desc');
      return send(req, res, 200, { sources: result.rows });
    }

    return send(req, res, 404, { ok: false, error: 'Not found' });
  } catch (error) {
    return send(req, res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

migrate().then(() => {
  const server = http.createServer(handler);
  server.listen(port, '0.0.0.0', () => console.log(`AstroSun API listening on ${port}`));
}).catch(error => {
  console.error('AstroSun API migration failed', error);
  process.exit(1);
});