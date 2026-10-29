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

// Sheet data from tray plugin
const sheetPath = path.resolve(__dirname, '../../tray-api-ai-plugin/data/fichas_tecnicas_colecoes.json');
const sheetData = JSON.parse(readFileSync(sheetPath, 'utf8'));
const sheetCols = Object.values(sheetData);

// Tray audit data
const trayPath = path.resolve(__dirname, '../../tray-api-ai-plugin/data/auditoria_completa_ids.json');
const trayAudit = JSON.parse(readFileSync(trayPath, 'utf8'));

async function run() {
  await client.connect();

  const { rows } = await client.query(`
    SELECT internal_id, id, sku, name, category, collection, price, wholesale_price, cost_price, tray_product_id
    FROM public.produtos
    ORDER BY internal_id ASC
  `);

  console.log(`--- AUDITORIA: BANCO SUPABASE (${rows.length} PRODUTOS) VS PLANILHA INDUSTRIAL ---`);
  
  let matchingCount = 0;
  let priceDivergences = 0;
  let wholesaleDivergences = 0;
  let costZeroCount = 0;
  let nullTrayCount = 0;

  for (const r of rows) {
    if (!r.tray_product_id) nullTrayCount++;
    if (parseFloat(r.cost_price || 0) === 0) costZeroCount++;

    // Try to find matching sheet collection
    const colName = (r.collection || '').toLowerCase();
    const prodName = (r.name || '').toLowerCase();

    let matchedCol = null;
    for (const sc of sheetCols) {
      const scName = sc.name.toLowerCase();
      if (colName && (scName.includes(colName) || colName.includes(scName))) {
        matchedCol = sc;
        break;
      }
      const keywords = scName.split(' ').filter(w => w.length > 3);
      if (keywords.some(k => prodName.includes(k))) {
        matchedCol = sc;
        break;
      }
    }

    if (matchedCol) {
      matchingCount++;
      // Check wholesale prices
      // In sheet: atacado_30_off.items
      let sheetAtacado = null;
      let sheetVarejo = null;
      let sheetCusto = null;

      if (r.category === 'Lugar Americano' || prodName.includes('lugar americano') || prodName.includes('americano')) {
        sheetAtacado = matchedCol.atacado_30_off?.items?.lugar_americano?.preco_atacado_unit;
        sheetVarejo = matchedCol.precos_venda?.site_varejo?.lugar_americano;
        sheetCusto = matchedCol.items?.lugar_americano?.custo_unitario;
      } else if (r.category === 'Porta-guardanapos' || prodName.includes('porta guardanapo')) {
        sheetAtacado = matchedCol.atacado_30_off?.items?.porta_guardanapo?.preco_atacado_unit;
        sheetVarejo = matchedCol.precos_venda?.site_varejo?.porta_guardanapo;
        sheetCusto = matchedCol.items?.porta_guardanapo?.custo_unitario;
      } else if (r.category === 'Guardanapos' || prodName.includes('guardanapo')) {
        sheetAtacado = matchedCol.atacado_30_off?.items?.guardanapo?.preco_atacado_unit;
        sheetVarejo = matchedCol.precos_venda?.site_varejo?.guardanapo;
        sheetCusto = matchedCol.items?.guardanapo?.custo_unitario;
      } else if (r.category === 'Jogos' || prodName.includes('jogo') || prodName.includes('kit')) {
        // Kit
        sheetVarejo = matchedCol.precos_venda?.totais?.kit_site_varejo;
        sheetCusto = matchedCol.custo_total_kit_3pcs;
      }

      const curPrice = parseFloat(r.price || 0);
      const curWholesale = parseFloat(r.wholesale_price || 0);
      const curCost = parseFloat(r.cost_price || 0);

      const hasPriceDiv = sheetVarejo && Math.abs(curPrice - sheetVarejo) > 0.05;
      const hasWholesaleDiv = sheetAtacado && Math.abs(curWholesale - sheetAtacado) > 0.05;

      if (hasPriceDiv) priceDivergences++;
      if (hasWholesaleDiv) wholesaleDivergences++;
    }
  }

  console.log(`- Produtos no banco: ${rows.length}`);
  console.log(`- Produtos com tray_product_id nulo: ${nullTrayCount}`);
  console.log(`- Produtos com custo zerado (0.00): ${costZeroCount}`);
  console.log(`- Coleções combinadas com a planilha: ${matchingCount}`);
  console.log(`- Divergências de preço de varejo detectadas: ${priceDivergences}`);
  console.log(`- Divergências de preço de atacado detectadas: ${wholesaleDivergences}`);

  await client.end();
}

run().catch(console.error);
