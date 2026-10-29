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

  const { rows } = await client.query(`
    SELECT p.internal_id, p.id, p.name, p.media,
           f.url as foto_cover_url, f.type as foto_cover_type
    FROM public.produtos p
    LEFT JOIN public.fotos f ON f.produto_internal_id = p.internal_id AND f.is_cover = true
    ORDER BY p.internal_id ASC
  `);

  console.log(`Verificando capas de ${rows.length} produtos...`);
  const suspicious = [];

  for (const r of rows) {
    const images = r.media?.images || [];
    const coverMedia = images.find(img => img.is_cover) || images[0];
    const url = r.foto_cover_url || coverMedia?.url || '';

    // Check if filename contains "editorial", "ambientada", "mesa", or if it's local webp
    const isEditorialName = url.toLowerCase().includes('editorial') || url.toLowerCase().includes('ambient');
    if (isEditorialName || !url) {
      suspicious.push({
        id: r.id,
        name: r.name.slice(0, 35),
        cover_type: r.foto_cover_type,
        url: url.slice(0, 60)
      });
    }
  }

  console.log(`Produtos com capa suspeita/editorial: ${suspicious.length}`);
  console.table(suspicious);

  await client.end();
}

main().catch(console.error);
