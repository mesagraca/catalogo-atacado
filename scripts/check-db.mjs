import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname, '../.env.local');

if (!existsSync(envFile)) {
  console.error('❌ Arquivo .env.local não encontrado.');
  process.exit(1);
}

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

const connectionString = env.POSTGRES_URL || env.POSTGRES_PRISMA_URL;
const client = new pg.Client({
  connectionString: connectionString.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT count(*) FROM public.produtos');
  console.log('Total de produtos no banco Supabase:', res.rows[0].count);

  const sample = await client.query(`
    SELECT internal_id, tray_product_id, sku, name, collection, price, wholesale_price, cost_price
    FROM public.produtos
    ORDER BY internal_id ASC
    LIMIT 10
  `);
  console.log('Amostra de produtos no banco:');
  console.table(sample.rows);

  await client.end();
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
