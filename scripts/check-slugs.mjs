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

  const slugs = ['lugar-americano-redondo-xadrez', 'kit-fundo-do-mar-convencional'];

  for (const slug of slugs) {
    console.log(`\n=== BUSCANDO SLUG: ${slug} ===`);
    const res = await client.query('SELECT internal_id, id, sku, name, category, collection, technical_specifications, game_items FROM public.produtos WHERE id = $1', [slug]);
    if (res.rows.length === 0) {
      console.log('Nenhum registro com id =', slug);
      const resLike = await client.query('SELECT internal_id, id, sku, name FROM public.produtos WHERE id ILIKE $1 OR name ILIKE $2 LIMIT 5', [`%${slug}%`, `%${slug.replace(/-/g, ' ')}%`]);
      console.log('Resultados similares:', resLike.rows);
    } else {
      const p = res.rows[0];
      console.log('Encontrado:', p.internal_id, p.id, p.sku, p.name);
      console.log('Tech Specs:', JSON.stringify(p.technical_specifications, null, 2));
      console.log('Game Items:', JSON.stringify(p.game_items, null, 2));
    }
  }

  await client.end();
}

main().catch(console.error);
