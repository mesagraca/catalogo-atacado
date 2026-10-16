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
 * Constrói a introdução enriquecida com exatamente 250 a 300 caracteres,
 * criando uma narrativa estética envolvente, sensorial e de alta conversão.
 */
function buildEnrichedIntro(product: any): string {
  const category = product.category;
  const name = product.name;
  const collection = product.collection || 'Mesa Posta Autoral';
  const id = product.id;

  // 1. Kits e Jogos Temáticos
  if (category === 'Jogos') {
    if (id === 'kit-feijoada') {
      return 'O Kit Mesa Posta Feijoada celebra o acolhimento e a rica tradição gastronômica brasileira em composições vibrantes e cheias de afeto. Confeccionado com base em nylon de fácil higienização e guardanapo em tricoline nobre, é a escolha perfeita para reunir família e amigos em momentos memoráveis à mesa.';
    }
    if (id === 'kit-churrasco') {
      return 'O Kit Mesa Posta Churrasco traduz a energia dos encontros descontraídos com personalidade e presença marcante à mesa. Confeccionado na autêntica combinação de jeans encorpado e courino premium, oferece altíssima resistência e praticidade para valorizar momentos especiais ao redor da brasa.';
    }
    if (id === 'kit-hamburguer') {
      return 'O Kit Mesa Posta Hambúrguer une a descontração contemporânea a um acabamento artesanal refinado para noites de lanches e celebrações. Em elegante mescla de jeans e courino com guardanapo coordenado, transforma refeições casuais em experiências completas e cheias de estilo e identidade visual.';
    }
    if (id === 'kit-pizza-dupla-face') {
      return 'O Kit Mesa Posta Pizza traz o clima acolhedor das melhores cantinas italianas direto para a sua casa com charme e versatilidade. Com lugar americano dupla face em nylon e Oxford e guardanapo xadrez temático, é a escolha ideal para criar noites de pizza inesquecíveis com a família e convidados.';
    }
    if (id === 'kit-hot-dog') {
      return 'O Kit Mesa Posta Hot Dog traduz alegria e leveza para encontros casuais, lanches da tarde e momentos de descontração com quem se ama. Com acabamento clássico em borda xadrez vermelha e guardanapo temático exclusivo, leva cor, personalidade e afeto para vestir sua mesa em qualquer ocasião.';
    }
    if (id === 'kit-limao') {
      return 'O Kit Mesa Posta Limão Siciliano transporta o frescor e a luminosidade da Costa Amalfitana para o centro da sua decoração com elegância. Confeccionado em gorgurinho nobre com estampa cítrica vibrante e guardanapo marinho coordenado, garante um visual solar, requintado e acolhedor à mesa.';
    }
    if (id === 'kit-cerejinha') {
      return 'O Kit Mesa Posta Cerejinha é uma composição lúdica e apaixonante que une doçura e sofisticação autoral para vestir mesas encantadoras. Confeccionado com base em nylon resistente e guardanapo em tricoline listrado coordenado, é perfeito para cafés da manhã, chás da tarde e datas memoráveis.';
    }
    if (id === 'kit-abelhinha') {
      return 'O Kit Mesa Posta Abelhinha combina delicadeza botânica e tons solares para transformar sua mesa posta em um jardim acolhedor e alegre. Confeccionado em nylon de toque suave e guardanapo amarelo em tricoline nobre, cria uma composição leve e radiante para cafés, brunches e almoços especiais.';
    }
    if (id === 'kit-ovinho') {
      return 'O Kit Mesa Posta Ovinho desperta sorrisos e aconchego com uma proposta criativa e carinhosa para momentos cotidianos e datas festivas. Com base resistente em nylon e guardanapo off-white em tricoline suave, veste a mesa com originalidade, charme e aquele toque autoral que acolhe a família.';
    }
    if (id === 'kit-folhas') {
      return 'O Kit Mesa Posta Folhas Verdejantes traz a serenidade da natureza para dentro de casa em uma composição botânica elegante e atemporal. Confeccionado em gorgurinho texturizado de alta durabilidade com guardanapo em Oxford verde, é ideal para quem busca harmonia, equilíbrio e frescor visual à mesa.';
    }
    if (id === 'kit-magnolia') {
      return 'O Kit Mesa Posta Magnólia destaca a nobreza e o refinamento do tecido Jacquard com uma padronagem floral sofisticada e acabamento impecável. Em tons suaves e elegantes com guardanapo coordenado, é a peça ideal para compor mesas imponentes, recepções requintadas e celebrações memoráveis.';
    }
    if (id.includes('bridgerton')) {
      return 'O Kit Mesa Posta Bridgerton resgata a estética romântica e o requinte da realeza com uma padronagem floral clássica e poética à mesa. Confeccionado inteiramente em tricoline premium com caimento suave e acabamento artesanal cuidadoso, transforma cada refeição em um momento nobre e acolhedor.';
    }
    if (id.includes('fundo-do-mar')) {
      return 'O Kit Mesa Posta Fundo do Mar evoca a brisa costeira e a tranquilidade marítima em tons de azul sereno e detalhes minuciosos de mesa posta. Com materiais de alta qualidade e guardanapo em tricoline coordenado, proporciona uma atmosfera relaxante, sofisticada e convidativa para receber.';
    }

    // Padrão equilibrado para demais jogos (~275 caracteres)
    const baseName = name.replace(/^Jogo /, '').replace(/^Jogo Americano /, '');
    return `O Kit Mesa Posta ${baseName} reúne harmonia, praticidade e a identidade acolhedora da Mesa & Graça para compor 1 lugar completo com requinte. Confeccionado com materiais nobres e acabamento artesanal cuidadoso, é a escolha perfeita para valorizar momentos memoráveis entre família e amigos.`;
  }

  // 2. Porta-guardanapos
  if (category === 'Porta-guardanapos') {
    return `O ${name} é o detalhe autoral Mesa & Graça que coroa a composição da mesa posta com sofisticação, delicadeza e acabamento impecável. Inspirado no design botânico e contemporâneo, possui argola artesanal nobre que harmoniza com guardanapos lisos ou estampados em ocasiões inesquecíveis.`;
  }

  // 3. Lugares Americanos Avulsos
  if (name.toLowerCase().includes('dupla face') || (product.collection && product.collection.toLowerCase().includes('dupla face'))) {
    return 'O Lugar Americano Redondo Xadrez une a elegância do design autoral Mesa & Graça à praticidade contemporânea para vestir sua mesa posta. Com acabamento ondulado e versatilidade dupla face, permite alternar entre o charme do xadrez e a sofisticação do verso liso, multiplicando as opções de recepção.';
  }

  if (name.toLowerCase().includes('natal')) {
    return `O ${name} foi desenvolvido exclusivamente para vestir a mesa natalina com requinte, brilho sutil e a atmosfera mágica das celebrações de fim de ano. Com tecido encorpado de altíssima qualidade e costura artesanal perfeita, transforma a ceia em uma lembrança inesquecível para toda a família.`;
  }

  return `O ${name} é uma criação autoral Mesa & Graça desenvolvida para transformar a decoração da mesa posta com elegância, praticidade e durabilidade. Confeccionado com tecido nobre de caimento impecável e costura reforçada, valoriza desde as refeições do dia a dia até recepções comemorativas.`;
}

/**
 * Constrói a descrição longa sem redundâncias de medidas.
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

  const intro = buildEnrichedIntro(product);

  // 1. Template para Kits e Jogos Completos
  if (category === 'Jogos') {
    const baseName = name.replace(/^Jogo /, '').replace(/^Jogo Americano /, '');

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
• Porta-guardanapo: 10 × 10 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso total aproximado: 250 gramas.`;
  }

  // 2. Template para Porta-guardanapos
  if (category === 'Porta-guardanapos') {
    return `${name}

${intro}

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
• Peso aproximado: 40 gramas.`;
  }

  // 3. Template para Lugares Americanos Avulsos
  const isDuplaFace = name.toLowerCase().includes('dupla face') || (product.collection && product.collection.toLowerCase().includes('dupla face'));
  const matUnico = materials[0]?.value && materials[0]?.value !== '—' ? materials[0].value : 'Tecido nobre de alta durabilidade';
  const dimUnico = dimensions[0]?.value && dimensions[0]?.value !== '—' ? dimensions[0].value : '38 × 38 cm';

  return `${name}

${intro}

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
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
• Peso aproximado: 150 gramas.`;
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

      // Regra de Variação Real: só tem variação se tiver mais de 1 variante com opções distintas
      const hasRealVariations = Boolean(p.variations && p.variations.length > 1);

      // Se for monocor ou conforme composição, registrar em especificações
      const specs = { ...canonical.technical_specifications };
      if (!hasRealVariations) {
        specs['Cor Predominante'] = p.color_name || 'Conforme composição';
      }

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
          sort_order, has_variations, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26,
          $27, $28, $29, $30, $31, $32, $33, $34,
          $35, $36, $37, $38,
          $39, $40, $41, $42, $43,
          $44, $45, now()
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
          has_variations = EXCLUDED.has_variations,
          updated_at = now()
        RETURNING internal_id;
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
        JSON.stringify(specs),
        JSON.stringify(canonical.google_shopping),
        JSON.stringify(canonical.media),
        JSON.stringify(p.game_items || []),
        JSON.stringify(canonical.data_provenance),
        p.sort_order || 0,
        hasRealVariations,
      ];

      const prodRes = await client.query(insertProdSQL, prodValues);
      const internalId = prodRes.rows[0].internal_id;
      insertedProducts++;

      // 2. Inserir Variantes (Apenas se tiver variações reais!)
      await client.query('DELETE FROM public.variantes WHERE produto_internal_id = $1', [internalId]);

      if (hasRealVariations && canonical.variants && canonical.variants.length > 0) {
        for (const v of canonical.variants) {
          const insertVarSQL = `
            INSERT INTO public.variantes (
              produto_internal_id, produto_slug, sku, name, pattern, color_hex,
              stock, price, cost_price, ncm, ean, tray_variant_id, attributes, image_url
            ) VALUES (
              $1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10, $11, $12, $13, $14
            )
            ON CONFLICT (sku) DO UPDATE SET
              produto_internal_id = EXCLUDED.produto_internal_id,
              stock = EXCLUDED.stock,
              price = EXCLUDED.price,
              cost_price = EXCLUDED.cost_price,
              ncm = EXCLUDED.ncm,
              image_url = EXCLUDED.image_url;
          `;

          const varValues = [
            internalId,
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
        await client.query('DELETE FROM public.fotos WHERE produto_internal_id = $1', [internalId]);

        let photoOrder = 1;
        for (const img of canonical.media.images) {
          const insertFotoSQL = `
            INSERT INTO public.fotos (
              produto_internal_id, produto_slug, url, url_webp, alt, type, is_cover, sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `;
          await client.query(insertFotoSQL, [
            internalId,
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
    console.log(`📦 Produtos cadastrados com internal_id: ${insertedProducts}`);
    console.log(`🎨 Variantes reais cadastradas: ${insertedVariants}`);
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
