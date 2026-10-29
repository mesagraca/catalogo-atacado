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

const connectionString = (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0];
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const total = await client.query('SELECT count(*) FROM public.produtos');
  const withTray = await client.query('SELECT count(*) FROM public.produtos WHERE tray_product_id IS NOT NULL');
  const withoutTray = await client.query('SELECT count(*) FROM public.produtos WHERE tray_product_id IS NULL');
  console.log('Total produtos no banco:', total.rows[0].count);
  console.log('Com tray_product_id:', withTray.rows[0].count);
  console.log('Sem tray_product_id (legados antigos):', withoutTray.rows[0].count);
  
  const oldLegacy = await client.query('SELECT internal_id, id, sku, name, collection FROM public.produtos WHERE tray_product_id IS NULL');
  console.log('Produtos legados antigos sem tray_product_id:');
  console.table(oldLegacy.rows);

  await client.end();
}

main().catch(console.error);
