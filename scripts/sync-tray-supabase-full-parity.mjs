import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname, '../.env.local');

if (!existsSync(envFile)) {
  console.error('❌ Arquivo .env.local não encontrado em catalogo-atacado.');
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

const connectionString = (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0];
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Import Tray Client from tray plugin
const trayPluginPath = path.resolve(__dirname, '../../tray-api-ai-plugin');
const trayClientUrl = pathToFileURL(path.join(trayPluginPath, 'tray-client.mjs')).href;
const { apiRequest } = await import(trayClientUrl);

// Load Tray Audit Data (93 products)
const trayAuditPath = path.resolve(trayPluginPath, 'data/auditoria_completa_ids.json');
const trayAudit = JSON.parse(readFileSync(trayAuditPath, 'utf8'));

// Load Sheet Specs (27 collections)
const sheetPath = path.resolve(trayPluginPath, 'data/fichas_tecnicas_colecoes.json');
const sheetData = JSON.parse(readFileSync(sheetPath, 'utf8'));
const sheetCols = Object.values(sheetData);

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(s) {
  return normalize(s).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function matchCollection(productName) {
  const normName = normalize(productName);
  for (const col of sheetCols) {
    const normCol = normalize(col.name);
    if (normCol === 'costela de adao' && normName.includes('costela de adao')) return col;
    if (normCol === 'alecrim' && normName.includes('alecrim')) return col;
    if (normCol === 'ramo de oliveira' && (normName.includes('ramo de oliveira') || normName.includes('oliveira'))) return col;
    if (normCol === 'feijoada' && normName.includes('feijoada')) return col;
    if (normCol === 'churrasco' && normName.includes('churrasco')) return col;
    if (normCol === 'hamburguer' && normName.includes('hamburguer')) return col;
    if (normCol === 'hotdog' && (normName.includes('hotdog') || normName.includes('hot dog'))) return col;
    if (normCol === 'pizza' && normName.includes('pizza')) return col;
    if (normCol === 'limao azul' && (normName.includes('limao') && (normName.includes('azul') || normName.includes('marinho')))) return col;
    if (normCol === 'limao branco' && (normName.includes('limao') && (normName.includes('branco') || normName.includes('amarelo')))) return col;
    if (normCol === 'rose imperial' && (normName.includes('rose imperial') || normName.includes('floral rosa'))) return col;
    if (normCol === 'folhas verde' && (normName.includes('folhas') || normName.includes('folha'))) return col;
    if (normCol === 'magnolia' && normName.includes('magnolia')) return col;
    if (normCol === 'flor marrom' && (normName.includes('flor marrom') || normName.includes('floral marrom'))) return col;
    if (normCol === 'cerejinha' && normName.includes('cerej')) return col;
    if (normCol === 'abelinha' && normName.includes('abel')) return col;
    if (normCol === 'ovinho' && normName.includes('ovinho')) return col;
    if (normCol === 'flor de lotus' && (normName.includes('flor de lotus') || normName.includes('flor de lottus') || normName.includes('lottus'))) return col;
    if (normCol === 'lavanda' && normName.includes('lavanda')) return col;
    if (normCol === 'bridgerton azul' && normName.includes('bridgerton azul')) return col;
    if (normCol === 'bridgerton verde' && normName.includes('bridgerton verde')) return col;
    if (normCol === 'fundo do mar - premium' && (normName.includes('fundo do mar') || normName.includes('marinha') || normName.includes('estrela nautica'))) return col;
    if (normCol === 'natal 1' && normName.includes('natal 1')) return col;
    if (normCol === 'natal 2' && normName.includes('natal 2')) return col;
    if (normCol === 'natal 3' && normName.includes('natal 3')) return col;
    if (normCol === 'natal 4' && normName.includes('natal 4')) return col;
    if (normCol === 'natal 5' && normName.includes('natal 5')) return col;
  }
  return null;
}

function resolveProductSpecs(name, col) {
  const norm = normalize(name);
  let itemType = 'outro';
  let category = 'Mesa Posta';
  let dimensions = '44 x 36 cm';
  let fabric = 'Tecido Especial';
  let finishing = 'Acabamento refinado';
  let weight = 150;
  let wholesalePrice = null;
  let costPrice = null;
  let length = 44;
  let width = 36;
  let height = 1;

  if (norm.includes('kit mesa posta') || norm.includes('kit')) {
    itemType = 'kit';
    category = 'Jogos';
    dimensions = '44 x 36 x 5 cm';
    weight = 340;
    length = 44;
    width = 36;
    height = 5;
    fabric = col ? `${col.items?.lugar_americano?.tecido || 'Nylon 600'} + ${col.items?.guardanapo?.tecido || 'Tricoline 100%'}` : 'Nylon 600 e Algodão';
    finishing = 'Composição completa coordenada de mesa posta';
    costPrice = col?.custo_total_kit_3pcs || null;
    wholesalePrice = col ? (
      (col.atacado_30_off?.items?.lugar_americano?.preco_atacado_unit || 0) +
      (col.atacado_30_off?.items?.guardanapo?.preco_atacado_unit || 0) +
      (col.atacado_30_off?.items?.porta_guardanapo?.preco_atacado_unit || 0)
    ) : null;
    if (wholesalePrice === 0) wholesalePrice = null;
  } else if (norm.includes('porta guardanapo') || norm.includes('porta-guardanapo')) {
    itemType = 'porta_guardanapo';
    category = 'Porta-guardanapos';
    dimensions = '7 x 5 x 5 cm';
    weight = norm.includes('jogo de 4') || norm.includes('4 pecas') ? 160 : 40;
    length = 7;
    width = 5;
    height = 5;
    fabric = col?.items?.porta_guardanapo?.modelo || 'Artesanal com Fibra Natural';
    finishing = 'Estrutura artesanal exclusiva para mesa posta';
    costPrice = col?.items?.porta_guardanapo?.custo_unitario || null;
    wholesalePrice = col?.atacado_30_off?.items?.porta_guardanapo?.preco_atacado_unit || null;
  } else if (norm.includes('lugar americano') || norm.includes('jogo americano')) {
    itemType = 'lugar_americano';
    category = 'Lugar Americano';
    dimensions = norm.includes('redondo') ? '44 x 44 cm' : '44 x 36 cm';
    weight = 120;
    length = 44;
    width = norm.includes('redondo') ? 44 : 36;
    height = 1;
    fabric = col?.items?.lugar_americano?.tecido || 'Nylon 600 Impermeável';
    finishing = col?.items?.lugar_americano?.especificacao || 'Bordado com frase autoral';
    costPrice = col?.items?.lugar_americano?.custo_unitario || null;
    wholesalePrice = col?.atacado_30_off?.items?.lugar_americano?.preco_atacado_unit || null;
  } else if (norm.includes('guardanapo')) {
    itemType = 'guardanapo';
    category = 'Guardanapos';
    dimensions = '44 x 44 cm';
    weight = 50;
    length = 44;
    width = 44;
    height = 1;
    fabric = col?.items?.guardanapo?.tecido || 'Tricoline 100% Algodão';
    finishing = col?.items?.guardanapo?.especificacao || 'Bainha costurada e toque suave';
    costPrice = col?.items?.guardanapo?.custo_unitario || null;
    wholesalePrice = col?.atacado_30_off?.items?.guardanapo?.preco_atacado_unit || null;
  }

  return {
    itemType,
    category,
    dimensions,
    fabric,
    finishing,
    weight,
    length,
    width,
    height,
    wholesalePrice,
    costPrice
  };
}

async function main() {
  console.log('=== SINCRONIZAÇÃO TOTAL TRAY ⟷ SUPABASE (PARIDADE 100%) ===');
  await client.connect();

  console.log(`Carregando ${trayAudit.length} produtos mapeados da Tray Commerce...`);

  let updatedCount = 0;
  let insertedCount = 0;

  for (const item of trayAudit) {
    const trayId = Number(item.tray_id);
    
    // 1. Obter dados ao vivo da API da Tray
    let liveTray = null;
    try {
      const res = await apiRequest('GET', `/products/${trayId}`);
      liveTray = res.Product;
    } catch (err) {
      console.error(`❌ Erro ao consultar Tray ID ${trayId}:`, err.message);
      continue;
    }

    const name = liveTray.name;
    const sku = liveTray.reference || item.reference || `MES-PRD-${trayId}`;
    const price = parseFloat(liveTray.price);
    const trayCost = parseFloat(liveTray.cost_price || 0);
    const stock = parseInt(liveTray.stock, 10) || 0;
    const active = liveTray.available === '1' || liveTray.available === 1 || liveTray.available === true;

    // 2. Cruzar com a Planilha Industrial
    const col = matchCollection(name);
    const collectionName = col ? col.name : (item.colecao !== 'Avulso / Complementar' ? item.colecao : 'Linha Mesa & Graça');
    const specs = resolveProductSpecs(name, col);

    // Definir custo e preço de atacado oficiais
    const costPrice = specs.costPrice !== null ? Number(specs.costPrice) : (trayCost > 0 ? trayCost : Number((price * 0.45).toFixed(2)));
    let wholesalePrice = specs.wholesalePrice !== null ? Number(specs.wholesalePrice) : Number((price * 0.70).toFixed(2));
    
    // Dimensões físicas
    const lengthCm = Number(liveTray.length || specs.length);
    const widthCm = Number(liveTray.width || specs.width);
    const heightCm = Number(liveTray.height || specs.height);
    const weightGrams = Number(liveTray.weight || specs.weight);

    // 3. Montar fotos e mídias
    const imagesList = [];
    if (liveTray.ProductImage && Array.isArray(liveTray.ProductImage)) {
      for (let idx = 0; idx < liveTray.ProductImage.length; idx++) {
        const img = liveTray.ProductImage[idx];
        const url = img.https || img.http;
        if (url) {
          imagesList.push({
            url,
            is_cover: idx === 0,
            type: idx === 0 ? 'studio' : 'editorial'
          });
        }
      }
    }

    const mediaJson = {
      images: imagesList.map((im, i) => ({
        id: `img-${trayId}-${i}`,
        url: im.url,
        url_webp: im.url,
        is_cover: im.is_cover,
        type: im.type
      }))
    };

    // 4. Montar Technical Specifications estruturadas
    const technicalSpecifications = {
      Marca: 'Mesa & Graça',
      Medidas: specs.dimensions,
      Categoria: specs.category,
      Coleção: collectionName,
      Composição: specs.fabric,
      Tecido: specs.fabric,
      Acabamento: specs.finishing,
      Cuidados: 'Lavar com sabão neutro, não usar alvejante, secar à sombra.',
      materials: [
        { label: 'Tecido / Composição', value: specs.fabric },
        { label: 'Acabamento', value: specs.finishing }
      ],
      dimensions: [
        { label: 'Dimensões (Comp x Larg)', value: specs.dimensions },
        { label: 'Peso Unitário Aproximado', value: `${weightGrams} g` }
      ]
    };

    // 5. Itens inclusos
    let includedItems = `1 unidade de ${name}`;
    if (specs.itemType === 'kit') {
      includedItems = '1 Lugar Americano + 1 Guardanapo de Tecido + 1 Porta-Guardanapo Artesanal';
    } else if (name.toLowerCase().includes('jogo de 4') || name.toLowerCase().includes('conjunto com 4')) {
      includedItems = 'Conjunto com 4 unidades de Porta-Guardanapos artesanais';
    }

    // 6. Verificar se produto já existe no Supabase
    const existingRes = await client.query(
      'SELECT internal_id, id FROM public.produtos WHERE tray_product_id = $1 OR sku = $2 LIMIT 1',
      [trayId, sku]
    );

    let targetInternalId = null;
    let targetSlug = null;

    if (existingRes.rows.length > 0) {
      // ATUALIZAR
      targetInternalId = existingRes.rows[0].internal_id;
      targetSlug = existingRes.rows[0].id;
      await client.query(`
        UPDATE public.produtos
        SET
          name = $1,
          category = $2,
          collection = $3,
          price = $4,
          wholesale_price = $5,
          cost_price = $6,
          stock = $7,
          active = $8,
          tray_product_id = $9,
          sku = $10,
          length_cm = $11,
          width_cm = $12,
          height_cm = $13,
          weight_grams = $14,
          included_items = $15,
          technical_specifications = $16,
          media = $17,
          sync_status = 'synced',
          updated_at = NOW()
        WHERE internal_id = $18
      `, [
        name,
        specs.category,
        collectionName,
        price,
        wholesalePrice,
        costPrice,
        stock,
        active,
        trayId,
        sku,
        lengthCm,
        widthCm,
        heightCm,
        weightGrams,
        includedItems,
        technicalSpecifications,
        mediaJson,
        targetInternalId
      ]);
      updatedCount++;
      console.log(`[ATUALIZADO] ID ${targetInternalId} | Tray ${trayId} | ${name} | Atacado: R$ ${wholesalePrice.toFixed(2)} | Custo: R$ ${costPrice.toFixed(2)}`);
    } else {
      // INSERIR
      targetSlug = slugify(`${name}-${trayId}`);
      const insertRes = await client.query(`
        INSERT INTO public.produtos (
          id,
          sku,
          name,
          category,
          collection,
          price,
          wholesale_price,
          cost_price,
          stock,
          active,
          tray_product_id,
          length_cm,
          width_cm,
          height_cm,
          weight_grams,
          included_items,
          technical_specifications,
          media,
          sync_status,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'synced', NOW(), NOW()
        ) RETURNING internal_id
      `, [
        targetSlug,
        sku,
        name,
        specs.category,
        collectionName,
        price,
        wholesalePrice,
        costPrice,
        stock,
        active,
        trayId,
        lengthCm,
        widthCm,
        heightCm,
        weightGrams,
        includedItems,
        technicalSpecifications,
        mediaJson
      ]);
      targetInternalId = insertRes.rows[0].internal_id;
      insertedCount++;
      console.log(`[INSERIDO] ID ${targetInternalId} | Tray ${trayId} | ${name} | Atacado: R$ ${wholesalePrice.toFixed(2)} | Custo: R$ ${costPrice.toFixed(2)}`);
    }

    // 7. Sincronizar tabela public.fotos
    if (imagesList.length > 0 && targetInternalId) {
      await client.query('DELETE FROM public.fotos WHERE produto_internal_id = $1', [targetInternalId]);
      
      for (let i = 0; i < imagesList.length; i++) {
        const img = imagesList[i];
        await client.query(`
          INSERT INTO public.fotos (
            produto_internal_id,
            produto_slug,
            type,
            is_cover,
            sort_order,
            url,
            url_webp,
            alt,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `, [
          targetInternalId,
          targetSlug,
          img.type,
          img.is_cover,
          i,
          img.url,
          img.url,
          name
        ]);
      }
    }
  }

  console.log('\n======================================================');
  console.log(`SINCRONIZAÇÃO SUPABASE CONCLUÍDA!`);
  console.log(`- Produtos Atualizados: ${updatedCount}`);
  console.log(`- Produtos Novos Inseridos: ${insertedCount}`);
  console.log(`- Total de Produtos Processados: ${updatedCount + insertedCount}`);
  console.log('======================================================\n');

  await client.end();
}

main().catch(err => {
  console.error('❌ Falha na sincronização:', err);
  process.exit(1);
});
