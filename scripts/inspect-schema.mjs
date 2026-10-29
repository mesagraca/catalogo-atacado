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
  const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'produtos' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);
  console.log('Colunas de public.produtos:');
  console.log(cols.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));

  const countRes = await client.query('SELECT count(*) FROM public.produtos');
  console.log('\nTotal de produtos:', countRes.rows[0].count);

  const activeRes = await client.query('SELECT count(*) FROM public.produtos WHERE active = true');
  console.log('Produtos ativos:', activeRes.rows[0].count);

  const collectionsRes = await client.query('SELECT DISTINCT collection FROM public.produtos WHERE collection IS NOT NULL');
  console.log('Coleções existentes no banco:', collectionsRes.rows.map(r => r.collection));

  await client.end();
}
run().catch(console.error);
