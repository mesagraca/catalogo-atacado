import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Decile rounding rule
function roundPriceToDecile(val) {
  if (val == null || isNaN(val)) return null;
  return Math.round(Number(val) * 10) / 10;
}

// Load industrial technical sheets
const fichasRaw = JSON.parse(
  fs.readFileSync('C:/Users/nando/.gemini/tray-api-ai-plugin/data/fichas_tecnicas_colecoes.json', 'utf8')
);

// Helper to normalize collection name
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('--- ENRICHING GAME ITEMS WITH SIZES AND PRICES FOR ALL KITS ---');
  const { data: kits, error } = await supabase
    .from('produtos')
    .select('*')
    .ilike('category', '%Jogo%');

  if (error || !kits) {
    console.error('Error fetching kits:', error);
    process.exit(1);
  }

  console.log(`Found ${kits.length} kits in Supabase.`);

  let enrichedCount = 0;

  for (const kit of kits) {
    const isRedondo = (kit.name || '').toLowerCase().includes('redondo');
    const normName = normalize(kit.name);
    const normColl = normalize(kit.collection);

    // Find match in industrial sheets
    let ficha = fichasRaw.find(f => {
      const fNorm = normalize(f.name);
      return normName.includes(fNorm) || (normColl && fNorm.includes(normColl)) || normColl === fNorm;
    });

    const kitRetail = roundPriceToDecile(kit.price);
    const kitWholesale = roundPriceToDecile(kit.wholesale_price);

    let laRetail = null;
    let laWholesale = null;
    let gdRetail = null;
    let gdWholesale = null;
    let pgRetail = null;
    let pgWholesale = null;

    if (ficha && ficha.precos_venda?.site_varejo) {
      laRetail = ficha.precos_venda.site_varejo.lugar_americano;
      gdRetail = ficha.precos_venda.site_varejo.guardanapo;
      pgRetail = ficha.precos_venda.site_varejo.porta_guardanapo;

      laWholesale = ficha.atacado_30_off?.items?.lugar_americano?.preco_venda || (laRetail ? laRetail * 0.7 : null);
      gdWholesale = ficha.atacado_30_off?.items?.guardanapo?.preco_venda || (gdRetail ? gdRetail * 0.7 : null);
      pgWholesale = ficha.atacado_30_off?.items?.porta_guardanapo?.preco_venda || (pgRetail ? pgRetail * 0.7 : null);
    }

    // If still null, derive from kit prices (proportions: LA ~43.5%, GD ~31.5%, PG ~25%)
    if (!laWholesale && kitWholesale) {
      laWholesale = roundPriceToDecile(kitWholesale * 0.435);
      gdWholesale = roundPriceToDecile(kitWholesale * 0.315);
      pgWholesale = roundPriceToDecile(kitWholesale - (laWholesale + gdWholesale));
    }
    if (!laRetail && kitRetail) {
      laRetail = roundPriceToDecile(kitRetail * 0.435);
      gdRetail = roundPriceToDecile(kitRetail * 0.315);
      pgRetail = roundPriceToDecile(kitRetail - (laRetail + gdRetail));
    } else if (!laRetail && laWholesale) {
      laRetail = roundPriceToDecile(laWholesale / 0.7);
      gdRetail = roundPriceToDecile(gdWholesale / 0.7);
      pgRetail = roundPriceToDecile(pgWholesale / 0.7);
    }

    const laLabel = isRedondo ? 'Lugar Americano Redondo (44 x 44 cm)' : 'Lugar Americano (44 x 36 cm)';
    const gdLabel = 'Guardanapo de Tecido (44 x 44 cm)';
    const pgLabel = 'Porta-guardanapo Artesanal (07 x 05 cm)';

    const enrichedGameItems = [
      {
        label: laLabel,
        wholesale_price: roundPriceToDecile(laWholesale),
        retail_price: roundPriceToDecile(laRetail)
      },
      {
        label: gdLabel,
        wholesale_price: roundPriceToDecile(gdWholesale),
        retail_price: roundPriceToDecile(gdRetail)
      },
      {
        label: pgLabel,
        wholesale_price: roundPriceToDecile(pgWholesale),
        retail_price: roundPriceToDecile(pgRetail)
      }
    ];

    console.log(`[${kit.id}] ${kit.name}:`);
    for (const item of enrichedGameItems) {
      console.log(`   - ${item.label} -> Atacado: R$ ${item.wholesale_price?.toFixed(2)} | Varejo: R$ ${item.retail_price?.toFixed(2)}`);
    }

    const { error: updErr } = await supabase
      .from('produtos')
      .update({
        game_items: enrichedGameItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', kit.id);

    if (updErr) {
      console.error(`Error updating kit ${kit.id}:`, updErr);
    } else {
      enrichedCount++;
    }
  }

  console.log(`\nSuccessfully enriched ${enrichedCount} kits with sizes and decile-rounded prices.`);
}

run();
