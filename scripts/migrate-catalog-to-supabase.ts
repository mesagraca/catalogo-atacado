import { readFileSync, existsSync } from 'node:fs';
import pg from 'pg';
import { FEATURED_PRODUCTS } from '../src/types/catalog';
import { toCanonicalProduct } from '../src/lib/catalog-canonical';

// 1. Carregar variáveis de ambiente do .env.local
const envFile = '.env.local';
if (!existsSync(envFile)) {
  console.error('❌ Arquivo .env.local não encontrado.');
  process.exit(1);
}

const envContent = readFileSync(envFile, 'utf-8');
const env: Record<string, string> = {};
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

const connectionString = env.POSTGRES_URL || env.POSTGRES_PRISMA_URL;
if (!connectionString) {
  console.error('❌ POSTGRES_URL não encontrado.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: connectionString.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

/**
 * Constrói a descrição longa enriquecida e individualizada seguindo
 * rigorosamente o template oficial aprovado da Mesa & Graça.
 */
function buildEnrichedLongDescription(product: any): string {
  const category = product.category;
  const name = product.name;
  const collection = product.collection || 'Mesa Posta Autoral';
  const materials = product.materials || [];
  const dimensions = product.dimensions || [];

  const matAmericano = materials.find((m: any) => m.label.toLowerCase().includes('americano'))?.value || 'Tecido especial Mesa & Graça';
  const matGuardanapo = materials.find((m: any) => m.label.toLowerCase().includes('guardanapo'))?.value || 'Tricoline';
  const dimAmericano = dimensions.find((d: any) => d.label.toLowerCase().includes('americano'))?.value || '43 × 34 cm';
  const dimGuardanapo = dimensions.find((d: any) => d.label.toLowerCase().includes('guardanapo'))?.value || '42 × 42 cm';

  // 1. Template para Kits e Jogos Completos
  if (category === 'Jogos') {
    const baseName = name.replace(/^Jogo /, '').replace(/^Jogo Americano /, '');
    const intro = product.description || `O Kit Mesa Posta ${baseName} reúne as peças essenciais para compor 1 lugar à mesa no tema ${collection}, com materiais e medidas atualizados para facilitar a escolha e a composição da mesa posta.`;

    return `Kit Mesa Posta ${baseName} - Com Lugar Americano + Guardanapo + Porta-Guardanapo

${intro}

Destaques do produto:
• Kit completo para compor 1 lugar à mesa com harmonia e afeto.
• Lugar americano em ${matAmericano}, medindo ${dimAmericano}.
• Guardanapo coordenado em ${matGuardanapo}, medindo ${dimGuardanapo}.
• Inclui porta-guardanapo decorativo artesanal para finalizar a composição com requinte.
• Peça autoral Mesa & Graça, ideal para cafés, almoços, jantares, brunches e ocasiões especiais.
• Material: lugar americano em ${matAmericano}; guardanapo em ${matGuardanapo}; porta-guardanapo decorativo.

Itens inclusos: 1 lugar americano + 1 guardanapo + 1 porta-guardanapo.

Medidas das peças:
• Lugar americano: ${dimAmericano}.
• Guardanapo: ${dimGuardanapo}.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Altura: 2 cm
• Largura: 43 cm
• Comprimento: 34 cm
• Peso aproximado: 250 gramas`;
  }

  // 2. Template para Porta-guardanapos
  if (category === 'Porta-guardanapos') {
    return `${name}

O ${name} é o detalhe autoral Mesa & Graça que transforma e finaliza a composição da sua mesa posta com delicadeza e requinte. Uma peça decorativa pensada com afeto para criar mesas acolhedoras, elegantes e memoráveis.

Destaques do produto:
• Argola decorativa artesanal para finalizar a composição com guardanapo.
• Design exclusivo inspirado na estética floral, botânica e contemporânea.
• Versátil: combina perfeitamente com guardanapos lisos ou estampados.
• Ideal para cafés, almoços, jantares, brunches e ocasiões especiais.
• Material: argola em madeira ou acrílico com elemento decorativo coordenado.

Itens inclusos: 1 ${name}.

Medidas das peças:
• Porta-guardanapo: 10 × 10 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Altura: 5 cm
• Largura: 10 cm
• Comprimento: 10 cm
• Peso aproximado: 40 gramas`;
  }

  // 3. Template para Lugares Americanos Avulsos
  const isDuplaFace = name.toLowerCase().includes('dupla face') || (product.collection && product.collection.toLowerCase().includes('dupla face'));
  const isNatal = name.toLowerCase().includes('natal');

  let intro = `O ${name} é uma peça individual autoral Mesa & Graça desenvolvida para compor a mesa posta com praticidade, elegância e identidade visual.`;
  if (isDuplaFace) {
    intro += ` Possui acabamento ondulado e versatilidade dupla face, permitindo alternar entre o lado estampado e o verso liso para multiplicar as possibilidades à mesa.`;
  } else if (isNatal) {
    intro += ` Uma criação exclusiva para iluminar as celebrações de fim de ano com sofisticação, afeto e acabamento impecável.`;
  } else {
    intro += ` Confeccionado com tecido de alta gramatura, caimento refinado e costura reforçada para o dia a dia e recepções especiais.`;
  }

  const matUnico = materials[0]?.value && materials[0]?.value !== '—' ? materials[0].value : 'Tecido nobre de alta durabilidade';
  const dimUnico = dimensions[0]?.value && dimensions[0]?.value !== '—' ? dimensions[0].value : '38 × 38 cm';

  return `${name}

${intro}

Destaques do produto:
• Peça individual para compor 1 lugar à mesa.
• Confeccionado em ${matUnico}.
• Medidas atualizadas: ${dimUnico}.
${isDuplaFace ? '• Versatilidade dupla face: alterne entre o xadrez acolhedor e o liso clássico conforme a ocasião.\n• Acabamento ondulado elegante com costura reforçada.' : '• Acabamento refinado de alta durabilidade com caimento impecável.'}
• Combina perfeitamente com guardanapos, porta-guardanapos e louças coordenadas.
• Ideal para cafés, almoços, jantares, brunches e datas comemorativas.
• Material: ${matUnico}.

Itens inclusos: 1 ${name}.

Medidas das peças:
• Lugar americano: ${dimUnico}.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Altura: 1 cm
• Largura: 38 cm
• Comprimento: 38 cm
• Peso aproximado: 150 gramas`;
}

async function runMigration() {
  try {
    console.log('🔌 Conectando ao Supabase Postgres...');
    await client.connect();
    console.log('✅ Conectado!');

    console.log(`📦 Carregando ${FEATURED_PRODUCTS.length} produtos do catálogo...`);

    const baseUrl = 'https://catalogo.mesaegraca.com.br';
    let insertedProducts = 0;
    let insertedVariants = 0;
    let insertedPhotos = 0;

    await client.query('BEGIN');

    for (const p of FEATURED_PRODUCTS) {
      const canonical = toCanonicalProduct(p, baseUrl);
      const shortDesc = p.description || `${p.name} autoral Mesa & Graça para mesa posta.`;
      const enrichedLongDesc = buildEnrichedLongDescription(p);

      // 1. Inserir Produto
      const insertProdSQL = `
        INSERT INTO public.produtos (
          id, sku, name, brand, category, collection, color_name, color_hex,
          active, available_in_store, short_description, description, included_items,
          warranty, warranty_days, stock, price, wholesale_price, cost_price, promotional_price,
          weight_grams, length_cm, width_cm, height_cm, free_shipping, production_days,
          availability_text, ncm, ean, origin, cest, cfop_internal, cfop_external, csosn,
          tax_group_tray, tray_product_id, sync_status, last_sync_at,
          technical_specifications, google_shopping, media, game_items, data_provenance,
          sort_order, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26,
          $27, $28, $29, $30, $31, $32, $33, $34,
          $35, $36, $37, $38,
          $39, $40, $41, $42, $43,
          $44, now()
        )
        ON CONFLICT (id) DO UPDATE SET
          sku = EXCLUDED.sku,
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          collection = EXCLUDED.collection,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          wholesale_price = EXCLUDED.wholesale_price,
          cost_price = EXCLUDED.cost_price,
          stock = EXCLUDED.stock,
          ncm = EXCLUDED.ncm,
          ean = EXCLUDED.ean,
          tray_product_id = EXCLUDED.tray_product_id,
          sync_status = EXCLUDED.sync_status,
          technical_specifications = EXCLUDED.technical_specifications,
          data_provenance = EXCLUDED.data_provenance,
          media = EXCLUDED.media,
          updated_at = now();
      `;

      const prodValues = [
        canonical.sync_control.catalog_product_id,
        canonical.general.sku,
        canonical.general.name,
        canonical.general.brand,
        canonical.general.category,
        canonical.general.collection || null,
        p.color_name || null,
        p.color_hex || null,
        canonical.general.active,
        canonical.general.available_in_store,
        shortDesc,
        enrichedLongDesc,
        canonical.general.included_items,
        canonical.general.warranty,
        canonical.general.warranty_days,
        canonical.general.stock, // estritamente 0
        canonical.pricing.price,
        canonical.pricing.wholesale_price,
        canonical.pricing.cost_price, // estritamente 0.00
        canonical.pricing.promotional_price,
        canonical.logistics.weight_grams,
        canonical.logistics.length_cm,
        canonical.logistics.width_cm,
        canonical.logistics.height_cm,
        canonical.logistics.free_shipping,
        canonical.logistics.production_days,
        canonical.logistics.availability_text,
        canonical.fiscal.ncm,
        canonical.fiscal.ean,
        canonical.fiscal.origin,
        canonical.fiscal.cest,
        canonical.fiscal.cfop_internal,
        canonical.fiscal.cfop_external,
        canonical.fiscal.csosn,
        canonical.fiscal.tax_group_tray,
        canonical.sync_control.tray_product_id,
        canonical.sync_control.status,
        canonical.sync_control.last_sync_at,
        JSON.stringify(canonical.technical_specifications),
        JSON.stringify(canonical.google_shopping),
        JSON.stringify(canonical.media),
        JSON.stringify(p.game_items || []),
        JSON.stringify(canonical.data_provenance),
        p.sort_order || 0,
      ];

      await client.query(insertProdSQL, prodValues);
      insertedProducts++;

      // 2. Inserir Variantes
      if (canonical.variants && canonical.variants.length > 0) {
        // Limpar variantes anteriores do produto
        await client.query('DELETE FROM public.variantes WHERE produto_id = $1', [canonical.sync_control.catalog_product_id]);

        for (const v of canonical.variants) {
          const insertVarSQL = `
            INSERT INTO public.variantes (
              produto_id, sku, name, pattern, color_hex,
              stock, price, cost_price, ncm, ean, tray_variant_id, attributes, image_url
            ) VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9, $10, $11, $12, $13
            )
            ON CONFLICT (sku) DO UPDATE SET
              stock = EXCLUDED.stock,
              price = EXCLUDED.price,
              cost_price = EXCLUDED.cost_price,
              ncm = EXCLUDED.ncm,
              image_url = EXCLUDED.image_url;
          `;

          const varValues = [
            canonical.sync_control.catalog_product_id,
            v.sku,
            v.attributes.Cor || v.sku,
            v.attributes.Estampa || null,
            null,
            v.stock, // 0
            v.price,
            v.cost_price, // 0.00
            v.ncm,
            v.ean,
            v.tray_variant_id,
            JSON.stringify(v.attributes),
            v.image_url,
          ];

          await client.query(insertVarSQL, varValues);
          insertedVariants++;
        }
      }

      // 3. Inserir Fotos
      if (canonical.media.images && canonical.media.images.length > 0) {
        await client.query('DELETE FROM public.fotos WHERE produto_id = $1', [canonical.sync_control.catalog_product_id]);

        let photoOrder = 1;
        for (const img of canonical.media.images) {
          const insertFotoSQL = `
            INSERT INTO public.fotos (
              produto_id, url, url_webp, alt, type, is_cover, sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          await client.query(insertFotoSQL, [
            canonical.sync_control.catalog_product_id,
            img.url,
            img.url_webp,
            img.alt,
            img.type,
            img.is_cover,
            photoOrder++,
          ]);
          insertedPhotos++;
        }
      }
    }

    await client.query('COMMIT');

    console.log('\n=========================================');
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO TOTAL!');
    console.log(`📦 Produtos inseridos/atualizados: ${insertedProducts}`);
    console.log(`🎨 Variantes inseridas/atualizadas: ${insertedVariants}`);
    console.log(`🖼️ Fotos registradas: ${insertedPhotos}`);
    console.log('=========================================\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na migração para o Supabase:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
