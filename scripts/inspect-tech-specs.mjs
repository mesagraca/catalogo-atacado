import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname, '../.env.local');
const envContent = readFileSync(envFile, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[key] = val;
  }
}

const client = new pg.Client({
  connectionString: (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0],
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT sku, name, category, collection, length_cm, width_cm, height_cm, weight_grams, technical_specifications, included_items
    FROM public.produtos
    WHERE technical_specifications IS NOT NULL
    LIMIT 3
  `);
  for (const r of res.rows) {
    console.log('===', r.sku, r.name, `(${r.category} - ${r.collection})`, '===');
    console.log('Medidas:', r.length_cm, 'x', r.width_cm, 'x', r.height_cm, 'cm | Peso:', r.weight_grams, 'g');
    console.log('Itens Inclusos:', r.included_items);
    console.log('Tech Specs:', JSON.stringify(r.technical_specifications, null, 2));
  }
  await client.end();
}
run().catch(console.error);
