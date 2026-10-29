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

  const testIds = ['lugar-americano-redondo-xadrez', 'kit-fundo-do-mar-convencional'];

  for (const id of testIds) {
    const res = await client.query('SELECT id, name, category, collection, wholesale_price, price, technical_specifications FROM public.produtos WHERE id = $1', [id]);
    const p = res.rows[0];
    console.log(`\n======================================================`);
    console.log(`PRODUTO: [${p.id}] ${p.name}`);
    console.log(`Categoria: ${p.category} | Coleção: ${p.collection}`);
    console.log(`Preços: Varejo R$ ${p.price} | Atacado R$ ${p.wholesale_price}`);
    console.log(`MATERIAIS:`);
    console.table(p.technical_specifications.materials);
    console.log(`MEDIDAS:`);
    console.table(p.technical_specifications.dimensions);
  }

  await client.end();
}

main().catch(console.error);
