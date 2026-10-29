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

function roundPriceToDecile(price) {
  const num = typeof price === 'string' ? parseFloat(price) : Number(price);
  if (isNaN(num)) return price;
  return Math.round(num * 10) / 10;
}

const connectionString = (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0];
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const { rows } = await client.query('SELECT internal_id, id, sku, name, wholesale_price FROM public.produtos WHERE wholesale_price IS NOT NULL ORDER BY internal_id ASC');
  
  let brokenCount = 0;
  const sample = [];

  for (const r of rows) {
    const cur = parseFloat(r.wholesale_price);
    const rounded = roundPriceToDecile(cur);
    const isBroken = Math.abs(cur - rounded) > 0.001;
    if (isBroken) {
      brokenCount++;
      if (sample.length < 15) {
        sample.push({
          id: r.id,
          name: r.name.slice(0, 35),
          atual: cur.toFixed(2),
          arredondado: rounded.toFixed(2)
        });
      }
    }
  }

  console.log('Total produtos com preço atacado:', rows.length);
  console.log('Produtos com centavos quebrados no atacado:', brokenCount);
  console.log('Amostra de arredondamentos:');
  console.table(sample);

  await client.end();
}

main().catch(console.error);
