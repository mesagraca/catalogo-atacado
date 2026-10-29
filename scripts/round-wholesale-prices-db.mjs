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

function roundPriceToDecile(price) {
  if (price === null || price === undefined || price === "") return null;
  const num = typeof price === "string" ? parseFloat(price) : Number(price);
  if (isNaN(num)) return null;
  const rounded = Math.round(num * 10) / 10;
  return Number(rounded.toFixed(2));
}

const connectionString = (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0];
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('=== ATUALIZAÇÃO EM LOTE: ARREDONDAMENTO EM DÉCIMOS PARA ATACADO ===\n');

  const { rows } = await client.query(`
    SELECT internal_id, id, sku, name, wholesale_price, game_items
    FROM public.produtos
    WHERE wholesale_price IS NOT NULL
    ORDER BY internal_id ASC
  `);

  console.log(`Analisando ${rows.length} produtos no Supabase...`);

  let updatedCount = 0;
  const auditLog = [];

  for (const prod of rows) {
    const currentWholesale = parseFloat(prod.wholesale_price);
    const roundedWholesale = roundPriceToDecile(currentWholesale);

    let gameItemsChanged = false;
    let updatedGameItems = prod.game_items;

    if (Array.isArray(prod.game_items) && prod.game_items.length > 0) {
      updatedGameItems = prod.game_items.map(gi => {
        const itemWholesale = gi.wholesale_price != null ? roundPriceToDecile(gi.wholesale_price) : null;
        const itemRetail = gi.retail_price != null ? roundPriceToDecile(gi.retail_price) : null;
        if (itemWholesale !== gi.wholesale_price || itemRetail !== gi.retail_price) {
          gameItemsChanged = true;
        }
        return {
          ...gi,
          wholesale_price: itemWholesale,
          retail_price: itemRetail
        };
      });
    }

    const priceChanged = Math.abs(currentWholesale - roundedWholesale) > 0.001;

    if (priceChanged || gameItemsChanged) {
      await client.query(`
        UPDATE public.produtos
        SET
          wholesale_price = $1,
          game_items = $2,
          updated_at = NOW()
        WHERE internal_id = $3
      `, [roundedWholesale, JSON.stringify(updatedGameItems), prod.internal_id]);

      updatedCount++;
      auditLog.push({
        id: prod.id,
        name: prod.name.slice(0, 40),
        antes: `R$ ${currentWholesale.toFixed(2)}`,
        depois: `R$ ${roundedWholesale.toFixed(2)}`
      });
    }
  }

  console.log(`\n======================================================`);
  console.log(`ATUALIZAÇÃO DE PREÇOS DE ATACADO CONCLUÍDA!`);
  console.log(`- Total de produtos analisados: ${rows.length}`);
  console.log(`- Produtos com preços ajustados para décimos: ${updatedCount}`);
  console.log(`======================================================\n`);

  console.log('Amostra de alterações (Antes vs Depois):');
  console.table(auditLog.slice(0, 20));

  await client.end();
}

main().catch(console.error);
