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

  const res = await client.query(`
    SELECT p.id, p.name, f.is_cover, f.type, f.sort_order, f.url
    FROM public.produtos p
    LEFT JOIN public.fotos f ON f.produto_internal_id = p.internal_id
    WHERE p.id IN ('lugar-americano-redondo-xadrez', 'kit-fundo-do-mar-convencional')
    ORDER BY p.id, f.sort_order
  `);
  console.table(res.rows);

  // Check how many products in total have photos in public.fotos
  const prodsWithFotos = await client.query(`
    SELECT count(DISTINCT produto_internal_id) FROM public.fotos
  `);
  console.log('Total de produtos com fotos em public.fotos:', prodsWithFotos.rows[0].count);

  // Check products that have NO rows in public.fotos
  const withoutFotos = await client.query(`
    SELECT p.internal_id, p.id, p.name, p.media
    FROM public.produtos p
    LEFT JOIN public.fotos f ON f.produto_internal_id = p.internal_id
    WHERE f.id IS NULL
  `);
  console.log('Produtos sem fotos em public.fotos:', withoutFotos.rows.length);
  console.table(withoutFotos.rows.map(r => ({ id: r.id, name: r.name.slice(0, 35), media: JSON.stringify(r.media || {}).slice(0, 50) })));

  await client.end();
}

main().catch(console.error);
