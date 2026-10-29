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

async function run() {
  await client.connect();

  console.log('=== AUDITORIA DE PARIDADE PÓS-SINCRONIZAÇÃO SUPABASE ===');

  const { rows } = await client.query(`
    SELECT
      internal_id,
      tray_product_id,
      sku,
      name,
      category,
      collection,
      price,
      wholesale_price,
      cost_price,
      weight_grams,
      length_cm,
      width_cm,
      height_cm,
      technical_specifications,
      media
    FROM public.produtos
    WHERE tray_product_id IS NOT NULL
    ORDER BY tray_product_id ASC
  `);

  console.log(`\nTotal de produtos vinculados à Tray no Supabase: ${rows.length} / 93`);

  let nullTrayCount = 0;
  let zeroCostCount = 0;
  let zeroWholesaleCount = 0;
  let zeroPriceCount = 0;
  let emptySpecsCount = 0;
  let missingPhotosCount = 0;

  for (const r of rows) {
    if (!r.tray_product_id) nullTrayCount++;
    if (parseFloat(r.cost_price || 0) <= 0) zeroCostCount++;
    if (parseFloat(r.wholesale_price || 0) <= 0) zeroWholesaleCount++;
    if (parseFloat(r.price || 0) <= 0) zeroPriceCount++;
    
    const specs = r.technical_specifications;
    if (!specs || specs.Medidas === 'Medidas: —' || specs.Composição === 'Material: —') {
      emptySpecsCount++;
    }

    const images = r.media?.images;
    if (!images || images.length === 0) {
      missingPhotosCount++;
    }
  }

  // Verificar tabela public.fotos
  const fotosRes = await client.query('SELECT count(*) FROM public.fotos');
  console.log(`Total de fotos cadastradas na tabela public.fotos: ${fotosRes.rows[0].count}`);

  console.log('======================================================');
  console.log(`- Produtos com tray_product_id nulo: ${nullTrayCount}`);
  console.log(`- Produtos com Custo zerado (<= 0): ${zeroCostCount}`);
  console.log(`- Produtos com Preço de Atacado zerado (<= 0): ${zeroWholesaleCount}`);
  console.log(`- Produtos com Preço de Varejo zerado (<= 0): ${zeroPriceCount}`);
  console.log(`- Produtos com especificações técnicas vazias: ${emptySpecsCount}`);
  console.log(`- Produtos sem fotos no campo media: ${missingPhotosCount}`);
  console.log('======================================================\n');

  if (rows.length === 93 && zeroCostCount === 0 && zeroWholesaleCount === 0 && emptySpecsCount === 0) {
    console.log('✅ SUCESSO TOTAL: 100% de paridade e integridade alcançada!');
  } else {
    console.log('⚠️ Atenção: Algumas métricas requerem verificação.');
  }

  await client.end();
}

run().catch(console.error);
