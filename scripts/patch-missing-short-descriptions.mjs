import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map of canonical descriptions from existing curated catalogue or catalog.ts
const code = fs.readFileSync('src/types/catalog.ts', 'utf8');
const idx = code.indexOf('export const FEATURED_PRODUCTS: Product[] = ');
const jsonStr = code.slice(idx + 'export const FEATURED_PRODUCTS: Product[] = '.length).trim().replace(/;$/, '');
const featuredProducts = JSON.parse(jsonStr);
const descMap = new Map();
for (const p of featuredProducts) {
  if (p.description && p.description.trim()) {
    descMap.set(p.id, p.description.trim());
    if (p.sku) descMap.set(p.sku, p.description.trim());
  }
}

// Fallback generator for textile tableware products if not in map
function generateEditorialDescription(prod) {
  const name = prod.name || '';
  const cat = prod.category || '';
  const spec = prod.technical_specifications || {};
  const fabric = spec.Tecido || spec.Composição || 'tecido nobre selecionado';
  
  if (cat.includes('Jogo') || cat.includes('Kit') || name.toLowerCase().includes('kit')) {
    return `Jogo completo para mesa posta com acabamento de alta qualidade, confeccionado com carinho pela Mesa & Graça, composto por lugar americano, guardanapo de tecido e porta-guardanapo coordenado.`;
  }
  if (cat.includes('Guardanapo') || name.toLowerCase().includes('guardanapo')) {
    return `Guardanapo em tecido macio de alta durabilidade com acabamento refinado, ideal para composições elegantes e acolhedoras à mesa.`;
  }
  if (cat.includes('Porta-guardanapo') || name.toLowerCase().includes('porta guardanapo') || name.toLowerCase().includes('porta-guardanapo')) {
    return `Porta-guardanapo artesanal confeccionado com elementos nobres, trazendo sofisticação e toque acolhedor a cada encontro à mesa.`;
  }
  return `Peça exclusiva Mesa & Graça confeccionada em ${fabric}, unindo elegância, praticidade e durabilidade para enriquecer suas composições de mesa posta.`;
}

async function run() {
  console.log('--- PATCHING MISSING SHORT DESCRIPTIONS IN SUPABASE ---');
  const { data: prods, error } = await supabase
    .from('produtos')
    .select('id, name, sku, category, short_description, description, technical_specifications');

  if (error || !prods) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  let patchedCount = 0;
  for (const p of prods) {
    const hasShort = p.short_description && p.short_description.trim().length > 0;
    const hasDesc = p.description && p.description.trim().length > 0 && !p.description.includes('undefined');

    if (!hasShort || !hasDesc) {
      let cleanDesc = descMap.get(p.id) || (p.sku ? descMap.get(p.sku) : null);
      if (!cleanDesc) {
        cleanDesc = generateEditorialDescription(p);
      }

      console.log(`Patching [${p.id}]: "${cleanDesc.slice(0, 60)}..."`);

      const updates = {
        updated_at: new Date().toISOString()
      };
      if (!hasShort) updates.short_description = cleanDesc;
      if (!hasDesc) updates.description = cleanDesc;

      const { error: updErr } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', p.id);

      if (updErr) {
        console.error(`Error updating product ${p.id}:`, updErr);
      } else {
        patchedCount++;
      }
    }
  }

  console.log(`\nSuccessfully patched ${patchedCount} products with clean descriptions.`);
}

run();
