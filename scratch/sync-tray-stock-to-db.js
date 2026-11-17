const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

function parseEnv(path) {
  const content = fs.readFileSync(path, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const k = trimmed.substring(0, eqIdx).trim();
      let v = trimmed.substring(eqIdx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[k] = v;
    }
  }
  return env;
}

const env = parseEnv('.env.local');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function syncTrayStock() {
  // 1. Obter token ativo da Tray do Supabase
  const { data: session } = await supabase.from('tray_session').select('*').single();
  if (!session || !session.access_token) {
    throw new Error('Sessão da Tray não encontrada no banco');
  }

  const token = session.access_token;
  const baseUrl = session.api_address ? `https://${session.api_address}` : 'https://www.mesaegraca.com.br/web_api';

  console.log('Conectado à Tray API:', baseUrl);

  // 2. Buscar todos os produtos da Tray
  const allTrayProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${baseUrl}/products?limit=50&page=${page}&access_token=${token}`);
    const data = await res.json();
    const prods = data.Products || [];
    if (prods.length === 0) {
      hasMore = false;
    } else {
      for (const p of prods) {
        allTrayProducts.push(p.Product);
      }
      if (prods.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  console.log(`Total de produtos carregados da Tray: ${allTrayProducts.length}`);
  fs.writeFileSync('scratch/tray-all-products.json', JSON.stringify(allTrayProducts, null, 2), 'utf8');

  // 3. Atualizar estoque no Supabase
  let updatedCount = 0;
  for (const p of allTrayProducts) {
    const trayId = Number(p.id);
    const stock = Number(p.stock || 0);
    const ref = p.reference ? p.reference.trim() : null;

    // Atualiza por tray_product_id
    const { data: byId } = await supabase
      .from('produtos')
      .update({ stock })
      .eq('tray_product_id', trayId)
      .select('id, name, sku, stock');

    if (byId && byId.length > 0) {
      updatedCount += byId.length;
    } else if (ref) {
      // Se não achou por tray_product_id, tenta por sku
      const { data: bySku } = await supabase
        .from('produtos')
        .update({ stock, tray_product_id: trayId })
        .eq('sku', ref)
        .select('id, name, sku, stock');

      if (bySku && bySku.length > 0) {
        updatedCount += bySku.length;
      }
    }
  }

  console.log(`Sucesso: ${updatedCount} produtos atualizados no Supabase com o estoque real da Tray!`);

  // 4. Conferir produto 80 (Dália Rosé)
  const { data: check80 } = await supabase
    .from('produtos')
    .select('id, name, sku, stock, tray_product_id')
    .or(`tray_product_id.eq.80,sku.eq.MES-MAD-AFE-080`);

  console.log('Conferência do produto 80 no Supabase:', check80);
}

syncTrayStock().catch(console.error);
