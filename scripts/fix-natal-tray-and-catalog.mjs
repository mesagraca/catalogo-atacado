/**
 * Script de Padronização Canônica, Categorização Exclusiva e Arredondamento de Preços
 * Coleção Natal 3, 4 e 5 — Tray Commerce (IDs 291..311) e Catálogo Atacado (Supabase 126..136)
 */

import fs from 'node:fs';
import path from 'node:path';
import { apiRequest } from '../../tray-api-ai-plugin/tray-client.mjs';

const ENV_LOCAL_PATH = 'C:/Users/nando/.gemini/catalogo-atacado/.env.local';

function loadSupabaseEnv() {
  const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
  const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  return {
    url: urlMatch[1].replace(/['"]/g, '').trim(),
    key: keyMatch[1].replace(/['"]/g, '').trim(),
  };
}

async function trayRequest(method, endpoint, body = null) {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return apiRequest(method, cleanEndpoint, body);
}

async function updateSupabaseRow(internalId, payload) {
  const { url, key } = loadSupabaseEnv();
  const res = await fetch(`${url}/rest/v1/produtos?internal_id=eq.${internalId}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase PATCH failed for internal_id=${internalId}: ${errText}`);
  }
  return res.json();
}

/**
 * Gera descrição HTML canônica para Produto Individual na Tray (Padrão 287 / 289 / 144)
 * Sem travessão Unicode (—) para evitar '?' em colunas latin1 e com <br> no rodapé.
 */
function buildTrayIndividualDescription({
  trayName,
  collectionLabel,
  material,
  dimensionsText,
  highlights,
  includedText,
  heightCm,
  widthCm,
  lengthCm,
  weightGrams,
}) {
  const lis = highlights.map((h) => `\t<li>${h}</li>`).join('\n');
  return `<p><strong>${trayName}</strong>, uma peça exclusiva pensada e desenvolvida com afeto e dedicação pela Mesa &amp; Graça para transformar a composição da sua mesa posta com elegância, aconchego e identidade visual única.</p>

<p>Inspirado no encanto e na beleza atemporal da ${collectionLabel}, este produto é ideal para a Ceia de Natal, almoços festivos em família, jantares especiais e momentos inesquecíveis de celebração. Uma peça feita para criar memórias afetivas ao redor da mesa, valorizando cada detalhe do encontro e expressando o carinho de reunir quem a gente ama.</p>

<p><strong>Destaques do produto:</strong></p>
<ul>
\t<li>Conjunto com 2 unidades para compor 2 lugares à mesa.</li>
\t<li>Confeccionado em ${material}.</li>
\t<li>Medidas: ${dimensionsText}.</li>
${lis}
\t<li>Material: ${material}.</li>
</ul>

<p><strong>Itens inclusos:</strong> ${includedText}</p>

<p><em>Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.</em></p>

<p><strong>Características do produto:</strong></p>
<p>Altura: ${heightCm} cm<br>
Largura: ${widthCm} cm<br>
Comprimento: ${lengthCm} cm<br>
Peso aproximado: ${weightGrams} gramas<br>
<strong>Mesa &amp; Graça</strong><br>
Compre com segurança direto de fábrica.</p>`;
}

/**
 * Gera descrição HTML canônica para Kit Completo 2 Lugares na Tray (Padrão Kit Oliveira 271 / Churrasco 269)
 */
function buildTrayKitDescription({
  trayName,
  laHighlight,
  guaHighlight,
  pgHighlight,
  laIncluded,
  guaIncluded,
  pgIncluded,
}) {
  return `<h3>${trayName}</h3>

<p><strong>${trayName}</strong>, uma composição exclusiva pensada e desenvolvida com afeto e dedicação pela Mesa &amp; Graça para transformar a composição da sua mesa posta com elegância, aconchego e identidade visual única.</p>

<p>Inspirado no encanto e na beleza atemporal da Coleção Natal, este kit completo 2 lugares é ideal para a Ceia de Natal, almoços festivos em família, jantares especiais e momentos inesquecíveis de celebração. Uma peça feita para criar memórias afetivas ao redor da mesa, valorizando cada detalhe do encontro e expressando o carinho de reunir quem a gente ama.</p>

<h4>Destaques do produto:</h4>
<ul>
\t<li>Conjunto completo para compor 2 lugares à mesa (total de 6 peças coordenadas).</li>
\t<li>${laHighlight}</li>
\t<li>${guaHighlight}</li>
\t<li>${pgHighlight}</li>
\t<li>Praticidade e sofisticação para receber quem você ama com carinho.</li>
</ul>

<h4>Itens inclusos:</h4>
<p>Jogo completo para 2 lugares contendo 6 peças coordenadas:</p>
<ul>
\t<li>${laIncluded}</li>
\t<li>${guaIncluded}</li>
\t<li>${pgIncluded}</li>
</ul>

<p><em>Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.</em></p>

<h4>Características do produto:</h4>
<p>Altura: 9 cm<br>
Largura: 14 cm<br>
Comprimento: 23 cm<br>
Peso aproximado: 100 gramas<br>
<strong>Mesa &amp; Graça</strong><br>
Compre com segurança direto de fábrica.</p>`;
}

const ITEMS = [
  // 1. Lugar Americano Natal 5 (291 / 126)
  {
    tray_id: 291,
    internal_id: 126,
    sku: 'MES-TEC-JAM-290',
    is_kit: false,
    category_id: '35',
    tray_price: '71.80',
    catalog_price: 35.90,
    catalog_wholesale: 30.50,
    tray_name: 'Lugar Americano Natal Redondo Vermelho Borda Pregueada Xadrez - Kit 2 Un',
    description_small: 'Jogo com 2 lugares americanos redondos vermelhos com borda pregueada xadrez e fios dourados da Coleção Natal.',
    included_items: 'Jogo com 2 Lugares Americanos Natal Redondos Vermelho Borda Pregueada Xadrez (42 x 42 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Lugar Americano Natal Redondo Vermelho Borda Pregueada Xadrez - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Centro em Tricoline 50% Algodão Vermelho e borda pregueada em Tricoline 100% Algodão Xadrez com Fios Dourados',
      dimensionsText: 'Redondo 42 x 42 cm',
      highlights: [
        'Borda pregueada de alfaiataria artesanal com fios dourados que emoldura o prato com imponência.',
        'Ideal para composições de mesa posta na Ceia e no almoço de Natal.',
        'Combina perfeitamente com guardanapos de tecido, porta-guardanapos natalinos e louças coordenadas.',
      ],
      includedText: 'Jogo com 2 Lugares Americanos Natal Redondos Vermelho Borda Pregueada Xadrez (42 x 42 cm).',
      heightCm: 1,
      widthCm: 42,
      lengthCm: 42,
      weightGrams: 50,
    }),
    catalog_short_description:
      'Lugar americano redondo vermelho com imponente borda pregueada em xadrez natalino e fios dourados, trazendo sofisticação e aconchego para a Ceia de Natal.',
    catalog_description: `Lugar Americano Redondo Vermelho Borda Pregueada Xadrez

O Lugar Americano Redondo Vermelho Borda Pregueada Xadrez é uma criação autoral Mesa & Graça desenvolvida para transformar a decoração da mesa posta de Natal com elegância, aconchego e acabamento artesanal impecável. Confeccionado com centro liso em tricoline misto vermelho e borda pregueada em tricoline 100% algodão xadrez com fios dourados, valoriza a Ceia e os encontros festivos em família.

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
• Confeccionado em Tricoline 50% Algodão no centro e borda em Tricoline 100% Algodão Xadrez com Fios Dourados.
• Medidas: Redondo 42 × 42 cm.
• Borda pregueada estruturada de alfaiataria artesanal com caimento impecável.
• Combina perfeitamente com guardanapos, porta-guardanapos e louças coordenadas.
• Ideal para Ceia de Natal, almoços festivos, jantares e celebrações de fim de ano.
• Material: Tricoline 50% Algodão e Tricoline 100% Algodão Xadrez com Fios Dourados.

Itens inclusos: 1 Lugar Americano Redondo Vermelho Borda Pregueada Xadrez.

Medidas das peças:
• Lugar americano: 42 × 42 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 50 gramas.`,
  },

  // 2. Lugar Americano Natal 4 (293 / 127)
  {
    tray_id: 293,
    internal_id: 127,
    sku: 'MES-TEC-JAM-291',
    is_kit: false,
    category_id: '35',
    tray_price: '67.80',
    catalog_price: 33.90,
    catalog_wholesale: 28.80,
    tray_name: 'Lugar Americano Natal Redondo Xadrez Vermelho Borda Ondulada - Kit 2 Un',
    description_small: 'Jogo com 2 lugares americanos redondos em xadrez vermelho com fios dourados e borda ondulada da Coleção Natal.',
    included_items: 'Jogo com 2 Lugares Americanos Natal Redondos Xadrez Vermelho Borda Ondulada (42 x 42 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Lugar Americano Natal Redondo Xadrez Vermelho Borda Ondulada - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Tricoline 100% Algodão Xadrez Vermelho com Fios Dourados',
      dimensionsText: 'Redondo 42 x 42 cm',
      highlights: [
        'Acabamento recortado em ondas (festonê) com viés vermelho estruturado em toda a borda.',
        'Ideal para composições de mesa posta na Ceia e no almoço de Natal.',
        'Combina perfeitamente com guardanapos de tecido, porta-guardanapos natalinos e louças coordenadas.',
      ],
      includedText: 'Jogo com 2 Lugares Americanos Natal Redondos Xadrez Vermelho Borda Ondulada (42 x 42 cm).',
      heightCm: 1,
      widthCm: 42,
      lengthCm: 42,
      weightGrams: 50,
    }),
    catalog_short_description:
      'Lugar americano redondo em tricoline xadrez vermelho com fios dourados e delicada borda ondulada, trazendo encanto e tradição para a mesa de Natal.',
    catalog_description: `Lugar Americano Redondo Xadrez Vermelho Borda Ondulada

O Lugar Americano Redondo Xadrez Vermelho Borda Ondulada une a tradição do tartan natalino com fios dourados ao charme do contorno ondulado autoral Mesa & Graça. Confeccionado em tricoline 100% algodão de toque macio, ilumina a composição da mesa posta com elegância e afeto.

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
• Confeccionado em Tricoline 100% Algodão Xadrez Vermelho com Fios Dourados.
• Medidas: Redondo 42 × 42 cm.
• Contorno ondulado festonê com viés vermelho estruturado de alta durabilidade.
• Combina perfeitamente com guardanapos, porta-guardanapos e louças coordenadas.
• Ideal para Ceia de Natal, almoços festivos, jantares e celebrações de fim de ano.
• Material: Tricoline 100% Algodão Xadrez com Fios Dourados.

Itens inclusos: 1 Lugar Americano Redondo Xadrez Vermelho Borda Ondulada.

Medidas das peças:
• Lugar americano: 42 × 42 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 50 gramas.`,
  },

  // 3. Lugar Americano Natal 3 (295 / 128)
  {
    tray_id: 295,
    internal_id: 128,
    sku: 'MES-TEC-JAM-292',
    is_kit: false,
    category_id: '35',
    tray_price: '65.80',
    catalog_price: 32.90,
    catalog_wholesale: 28.00,
    tray_name: 'Lugar Americano Natal Retangular Xadrez Verde Borda Ondulada - Kit 2 Un',
    description_small: 'Jogo com 2 lugares americanos retangulares em xadrez verde com fios dourados e borda ondulada vermelha da Coleção Natal.',
    included_items: 'Jogo com 2 Lugares Americanos Natal Retangulares Xadrez Verde Borda Ondulada (44 x 36 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Lugar Americano Natal Retangular Xadrez Verde Borda Ondulada - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Tricoline 100% Algodão Xadrez Verde com Fios Dourados',
      dimensionsText: 'Retangular 44 x 36 cm',
      highlights: [
        'Borda ondulada festiva com acabamento em viés vermelho contrastante.',
        'Ideal para composições de mesa posta na Ceia e no almoço de Natal.',
        'Combina perfeitamente com guardanapos de tecido, porta-guardanapos natalinos e louças coordenadas.',
      ],
      includedText: 'Jogo com 2 Lugares Americanos Natal Retangulares Xadrez Verde Borda Ondulada (44 x 36 cm).',
      heightCm: 1,
      widthCm: 36,
      lengthCm: 44,
      weightGrams: 50,
    }),
    catalog_short_description:
      'Lugar americano retangular em tricoline xadrez verde com fios dourados e borda ondulada vermelha, perfeito para compor mesas natalinas clássicas e acolhedoras.',
    catalog_description: `Lugar Americano Retangular Xadrez Verde Borda Ondulada

O Lugar Americano Retangular Xadrez Verde Borda Ondulada celebra as cores clássicas do Natal com padronagem xadrez enriquecida por fios dourados e acabamento ondulado em viés vermelho contrastante. Confeccionado em tricoline 100% algodão, acomoda com folga pratos, talheres e taças em recepções inesquecíveis.

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
• Confeccionado em Tricoline 100% Algodão Xadrez Verde com Fios Dourados.
• Medidas: 44 × 36 cm.
• Acabamento ondulado elegante com viés vermelho reforçado.
• Combina perfeitamente com guardanapos, porta-guardanapos e louças coordenadas.
• Ideal para Ceia de Natal, almoços festivos, jantares e celebrações de fim de ano.
• Material: Tricoline 100% Algodão Xadrez com Fios Dourados.

Itens inclusos: 1 Lugar Americano Retangular Xadrez Verde Borda Ondulada.

Medidas das peças:
• Lugar americano: 44 × 36 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 50 gramas.`,
  },

  // 4. Guardanapo Verde Pinheiro (297 / 129)
  {
    tray_id: 297,
    internal_id: 129,
    sku: 'MES-TEC-GUA-293',
    is_kit: false,
    category_id: '37',
    tray_price: '32.00',
    catalog_price: 16.00,
    catalog_wholesale: 13.60,
    tray_name: 'Guardanapo de Tecido Verde Pinheiro Liso 44x44cm - Kit 2 Un',
    description_small: 'Jogo com 2 guardanapos de tecido verde pinheiro liso 44x44 cm com toque macio e acabamento de alfaiataria.',
    included_items: 'Jogo com 2 Guardanapos de Tecido Verde Pinheiro Liso (44 x 44 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Guardanapo de Tecido Verde Pinheiro Liso 44x44cm - Kit 2 Un',
      collectionLabel: 'Coleção Natal e Clássicos Mesa & Graça',
      material: 'Tricoline Misto 50% Algodão de toque macio',
      dimensionsText: '44 x 44 cm',
      highlights: [
        'Bainha delicada e costura alinhada de alfaiataria em todas as laterais.',
        'Ideal para composições de mesa posta natalinas, botânicas e clássicas durante todo o ano.',
        'Combina perfeitamente com lugares americanos, porta-guardanapos e louças coordenadas.',
      ],
      includedText: 'Jogo com 2 Guardanapos de Tecido Verde Pinheiro Liso (44 x 44 cm).',
      heightCm: 1,
      widthCm: 44,
      lengthCm: 44,
      weightGrams: 25,
    }),
    catalog_short_description:
      'Guardanapo em tecido verde pinheiro com toque macio e caimento impecável, perfeito para harmonizar com composições natalinas, botânicas e clássicas.',
    catalog_description: `Guardanapo de Tecido Verde Pinheiro Liso

O Guardanapo de Tecido Verde Pinheiro Liso é uma peça versátil e indispensável da Mesa & Graça para composições de mesa posta natalinas, clássicas e botânicas. Confeccionado em tricoline misto de toque macio, oferece excelente estrutura para uso com porta-guardanapos bordados e alta durabilidade.

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
• Confeccionado em Tricoline 50% Algodão na cor Verde Pinheiro.
• Medidas: 44 × 44 cm.
• Bainha reta reforçada com costura alinhada de alfaiataria.
• Combina perfeitamente com lugares americanos, porta-guardanapos e louças coordenadas.
• Ideal para Ceia de Natal, almoços em família, jantares e datas comemorativas.
• Material: Tricoline 50% Algodão.

Itens inclusos: 1 Guardanapo de Tecido Verde Pinheiro Liso.

Medidas das peças:
• Guardanapo: 44 × 44 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 25 gramas.`,
  },

  // 5. Guardanapo Vermelho Clássico (299 / 130)
  {
    tray_id: 299,
    internal_id: 130,
    sku: 'MES-TEC-GUA-294',
    is_kit: false,
    category_id: '37',
    tray_price: '32.00',
    catalog_price: 16.00,
    catalog_wholesale: 13.60,
    tray_name: 'Guardanapo de Tecido Vermelho Clássico Liso 44x44cm - Kit 2 Un',
    description_small: 'Jogo com 2 guardanapos de tecido vermelho clássico liso 44x44 cm com toque macio e acabamento de alfaiataria.',
    included_items: 'Jogo com 2 Guardanapos de Tecido Vermelho Clássico Liso (44 x 44 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Guardanapo de Tecido Vermelho Clássico Liso 44x44cm - Kit 2 Un',
      collectionLabel: 'Coleção Natal e Clássicos Mesa & Graça',
      material: 'Tricoline Misto 50% Algodão de toque macio',
      dimensionsText: '44 x 44 cm',
      highlights: [
        'Bainha delicada e costura alinhada de alfaiataria em todas as laterais.',
        'Ideal para composições de mesa posta natalinas, jantares especiais e celebrações em família.',
        'Combina perfeitamente com lugares americanos, porta-guardanapos e louças coordenadas.',
      ],
      includedText: 'Jogo com 2 Guardanapos de Tecido Vermelho Clássico Liso (44 x 44 cm).',
      heightCm: 1,
      widthCm: 44,
      lengthCm: 44,
      weightGrams: 25,
    }),
    catalog_short_description:
      'Guardanapo em tecido vermelho clássico com toque macio e caimento impecável, ideal para iluminar composições de Natal e ocasiões festivas.',
    catalog_description: `Guardanapo de Tecido Vermelho Clássico Liso

O Guardanapo de Tecido Vermelho Clássico Liso traz cor vibrante e sofisticação para valorizar sua mesa posta de Natal, jantares especiais e momentos de celebração. Confeccionado em tricoline misto de toque macio, proporciona caimento elegante com porta-guardanapos artesanais e fácil manutenção.

Destaques do produto:
• Peça individual para compor 1 lugar à mesa com elegância.
• Confeccionado em Tricoline 50% Algodão na cor Vermelho Clássico.
• Medidas: 44 × 44 cm.
• Bainha reta reforçada com costura alinhada de alfaiataria.
• Combina perfeitamente com lugares americanos, porta-guardanapos e louças coordenadas.
• Ideal para Ceia de Natal, almoços em família, jantares e datas comemorativas.
• Material: Tricoline 50% Algodão.

Itens inclusos: 1 Guardanapo de Tecido Vermelho Clássico Liso.

Medidas das peças:
• Guardanapo: 44 × 44 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 25 gramas.`,
  },

  // 6. Porta-Guardanapo Quebra-Nozes (301 / 131)
  {
    tray_id: 301,
    internal_id: 131,
    sku: 'MES-BOR-PGU-295',
    is_kit: false,
    category_id: '13',
    tray_price: '27.80',
    catalog_price: 13.90,
    catalog_wholesale: 11.80,
    tray_name: 'Porta-Guardanapo Natal Quebra-Nozes Bordado - Kit 2 Un',
    description_small: 'Jogo com 2 porta-guardanapos natalinos Soldadinho Quebra-Nozes bordados da Coleção Natal.',
    included_items: 'Jogo com 2 Porta-Guardanapos Natal Quebra-Nozes Bordados (07 x 05 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Porta-Guardanapo Natal Quebra-Nozes Bordado - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Aplique em Bordado Computadorizado de Alta Definição com Fios Acetinados e Argola Estruturada',
      dimensionsText: '07 x 05 cm',
      highlights: [
        'Design natalino exclusivo de Soldadinho Quebra-Nozes ricamente bordado com fios dourados.',
        'Argola traseira firme e delicada que acomoda o guardanapo de tecido sem amassar.',
        'Combina perfeitamente com guardanapos verdes, vermelhos ou brancos e lugares americanos natalinos.',
      ],
      includedText: 'Jogo com 2 Porta-Guardanapos Natal Quebra-Nozes Bordados (07 x 05 cm).',
      heightCm: 7,
      widthCm: 5,
      lengthCm: 5,
      weightGrams: 25,
    }),
    catalog_short_description:
      'Porta-guardanapo artesanal com bordado exclusivo de Soldadinho Quebra-Nozes, trazendo o encanto clássico do Natal para finalizar a composição da mesa posta.',
    catalog_description: `Porta-Guardanapo Quebra-Nozes Bordado

O Porta-Guardanapo Quebra-Nozes Bordado é o detalhe autoral Mesa & Graça que coroa a composição da mesa posta de Natal com encanto, tradição e acabamento impecável. Produzido com bordado computadorizado de alta densidade e fios acetinados, possui argola estruturada que harmoniza com guardanapos lisos ou xadrez.

Destaques do produto:
• Argola decorativa artesanal para finalizar a composição com guardanapo.
• Bordado computadorizado de alta definição do clássico Soldadinho Quebra-Nozes.
• Versátil: combina perfeitamente com guardanapos verdes, vermelhos ou brancos.
• Ideal para Ceia de Natal, almoços festivos e celebrações em família.
• Material: aplique bordado estruturado com argola revestida.

Itens inclusos: 1 Porta-Guardanapo Quebra-Nozes Bordado.

Medidas das peças:
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 25 gramas.`,
  },

  // 7. Porta-Guardanapo Gengibre Marrom (303 / 132)
  {
    tray_id: 303,
    internal_id: 132,
    sku: 'MES-BOR-PGU-296',
    is_kit: false,
    category_id: '13',
    tray_price: '27.80',
    catalog_price: 13.90,
    catalog_wholesale: 11.80,
    tray_name: 'Porta-Guardanapo Natal Gengibre Marrom Bordado - Kit 2 Un',
    description_small: 'Jogo com 2 porta-guardanapos natalinos Biscoito de Gengibre Marrom bordados da Coleção Natal.',
    included_items: 'Jogo com 2 Porta-Guardanapos Natal Gengibre Marrom Bordados (07 x 05 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Porta-Guardanapo Natal Gengibre Marrom Bordado - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Aplique em Bordado Computadorizado de Alta Definição com Fios Acetinados e Argola Estruturada',
      dimensionsText: '07 x 05 cm',
      highlights: [
        'Design natalino afetivo de Biscoito de Gengibre (Gingerbread) marrom caramelo com gravatinha vermelha.',
        'Argola traseira firme e delicada que acomoda o guardanapo de tecido com perfeição.',
        'Combina perfeitamente com guardanapos verdes, vermelhos ou brancos e lugares americanos natalinos.',
      ],
      includedText: 'Jogo com 2 Porta-Guardanapos Natal Gengibre Marrom Bordados (07 x 05 cm).',
      heightCm: 7,
      widthCm: 5,
      lengthCm: 5,
      weightGrams: 25,
    }),
    catalog_short_description:
      'Porta-guardanapo artesanal com bordado exclusivo de Biscoito de Gengibre marrom, trazendo ternura e charme natalino para finalizar a composição da mesa posta.',
    catalog_description: `Porta-Guardanapo Gengibre Marrom Bordado

O Porta-Guardanapo Gengibre Marrom Bordado é o detalhe autoral Mesa & Graça inspirado nos tradicionais biscoitos natalinos para coroar a mesa posta com ternura, afeto e acabamento impecável. Ricamente bordado na cor marrom caramelo com gravatinha vermelha, possui argola firme que valoriza o guardanapo de tecido.

Destaques do produto:
• Argola decorativa artesanal para finalizar a composição com guardanapo.
• Bordado computadorizado de alta definição no tema Biscoito de Gengibre Marrom.
• Versátil: combina perfeitamente com guardanapos verdes, vermelhos ou brancos.
• Ideal para Ceia de Natal, almoços festivos e celebrações em família.
• Material: aplique bordado estruturado com argola revestida.

Itens inclusos: 1 Porta-Guardanapo Gengibre Marrom Bordado.

Medidas das peças:
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 25 gramas.`,
  },

  // 8. Porta-Guardanapo Gengibre Branco (305 / 133)
  {
    tray_id: 305,
    internal_id: 133,
    sku: 'MES-BOR-PGU-297',
    is_kit: false,
    category_id: '13',
    tray_price: '27.80',
    catalog_price: 13.90,
    catalog_wholesale: 11.80,
    tray_name: 'Porta-Guardanapo Natal Gengibre Branco Bordado - Kit 2 Un',
    description_small: 'Jogo com 2 porta-guardanapos natalinos Biscoito de Gengibre Branco bordados da Coleção Natal.',
    included_items: 'Jogo com 2 Porta-Guardanapos Natal Gengibre Branco Bordados (07 x 05 cm)',
    tray_description: buildTrayIndividualDescription({
      trayName: 'Porta-Guardanapo Natal Gengibre Branco Bordado - Kit 2 Un',
      collectionLabel: 'Coleção Natal',
      material: 'Aplique em Bordado Computadorizado de Alta Definição em Tons Off-White e Dourado com Argola Estruturada',
      dimensionsText: '07 x 05 cm',
      highlights: [
        'Releitura iluminada do Biscoito de Gengibre em tons off-white e bege dourado com gravatinha vermelha.',
        'Argola traseira firme e delicada que destaca o guardanapo verde ou vermelho na composição.',
        'Combina perfeitamente com guardanapos de tecido e lugares americanos da Coleção Natal.',
      ],
      includedText: 'Jogo com 2 Porta-Guardanapos Natal Gengibre Branco Bordados (07 x 05 cm).',
      heightCm: 7,
      widthCm: 5,
      lengthCm: 5,
      weightGrams: 25,
    }),
    catalog_short_description:
      'Porta-guardanapo artesanal com bordado iluminado de Biscoito de Gengibre branco e dourado, trazendo delicadeza e brilho natalino para a mesa posta.',
    catalog_description: `Porta-Guardanapo Gengibre Branco Bordado

O Porta-Guardanapo Gengibre Branco Bordado é uma releitura iluminada e sofisticada do clássico biscoito natalino desenvolvida pela Mesa & Graça. Bordado em tons off-white e bege dourado com gravatinha vermelha, cria um contraste encantador sobre guardanapos verde-pinheiro ou vermelhos.

Destaques do produto:
• Argola decorativa artesanal para finalizar a composição com guardanapo.
• Bordado computadorizado de alta definição no tema Biscoito de Gengibre Branco.
• Versátil: combina perfeitamente com guardanapos verdes, vermelhos ou brancos.
• Ideal para Ceia de Natal, almoços festivos e celebrações em família.
• Material: aplique bordado estruturado com argola revestida.

Itens inclusos: 1 Porta-Guardanapo Gengibre Branco Bordado.

Medidas das peças:
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso aproximado: 25 gramas.`,
  },

  // 9. Kit Natal 5 (307 / 134)
  {
    tray_id: 307,
    internal_id: 134,
    sku: 'MES-TEC-KIT-298',
    is_kit: true,
    category_id: '59',
    tray_price: '131.60',
    catalog_price: 65.80,
    catalog_wholesale: 55.90,
    tray_name: 'Kit Mesa Posta Natal Vermelho Borda Pregueada e Gengibre Branco 2 Lugares - Completo',
    description_small: 'Kit Mesa Posta Natal 2 Lugares (6 peças): 2 lugares americanos vermelhos borda pregueada xadrez, 2 guardanapos e 2 porta-guardanapos gengibre branco.',
    included_items: '2 Lugares Americanos Vermelho Borda Pregueada Xadrez (42 x 42 cm), 2 Guardanapos de Tecido Verde Pinheiro (44 x 44 cm) e 2 Porta-Guardanapos Gengibre Branco Bordados (07 x 05 cm)',
    tray_description: buildTrayKitDescription({
      trayName: 'Kit Mesa Posta Natal Vermelho Borda Pregueada e Gengibre Branco 2 Lugares - Completo',
      laHighlight: '2 Lugares Americanos Redondos Vermelhos com Borda Pregueada Xadrez e Fios Dourados (42 x 42 cm).',
      guaHighlight: '2 Guardanapos de Tecido Verde Pinheiro Liso em Tricoline Misto com toque suave e excelente caimento (44 x 44 cm).',
      pgHighlight: '2 Porta-Guardanapos exclusivos Biscoito de Gengibre Branco Bordado com aro reforçado (07 x 05 cm).',
      laIncluded: '2 Lugares Americanos Natal Redondos Vermelho Borda Pregueada Xadrez (42 x 42 cm).',
      guaIncluded: '2 Guardanapos de Tecido Verde Pinheiro Liso (44 x 44 cm).',
      pgIncluded: '2 Porta-Guardanapos Natal Gengibre Branco Bordados (07 x 05 cm).',
    }),
    catalog_short_description:
      'Composição natalina sofisticada em vermelho com borda pregueada xadrez e fios dourados, com lugar americano, guardanapo e porta-guardanapo Gengibre Branco coordenados para celebrar a Ceia de Natal com encanto.',
    catalog_description: `Kit Mesa Posta Vermelho Borda Pregueada Xadrez e Gengibre Branco

O Kit Mesa Posta Vermelho Borda Pregueada Xadrez e Gengibre Branco celebra a magia do Natal em uma composição autoral de alfaiataria artesanal e brilho sutil. Combinando o lugar americano redondo vermelho de borda pregueada xadrez com fios dourados, o guardanapo verde pinheiro e o porta-guardanapo Gengibre Branco bordado, veste a mesa para momentos inesquecíveis em família.

Destaques do produto:
• Kit completo para compor 1 lugar à mesa com harmonia e afeto.
• Lugar americano redondo em Tricoline Vermelho com Borda Pregueada Xadrez e Fios Dourados, medindo 42 × 42 cm.
• Guardanapo coordenado em Tricoline Verde Pinheiro, medindo 44 × 44 cm.
• Inclui porta-guardanapo artesanal Gengibre Branco Bordado para finalizar a composição com requinte.
• Peça autoral Mesa & Graça, ideal para Ceia de Natal, almoços festivos e celebrações de fim de ano.
• Material: lugar americano em Tricoline Misto e 100% Algodão com Fios Dourados; guardanapo em Tricoline 50% Algodão; porta-guardanapo bordado artesanal.

Itens inclusos: 1 lugar americano + 1 guardanapo + 1 porta-guardanapo.

Medidas das peças:
• Lugar americano: 42 × 42 cm.
• Guardanapo: 44 × 44 cm.
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso total aproximado: 100 gramas.`,
    game_items: [
      {
        label: 'Lugar Americano Vermelho Borda Pregueada (42 x 42 cm)',
        product_id: 'lugar-americano-redondo-vermelho-borda-pregueada-xadrez',
        retail_price: 35.90,
        wholesale_price: 30.50,
      },
      {
        label: 'Guardanapo de Tecido (44 x 44 cm)',
        product_id: 'guardanapo-tecido-verde-pinheiro-liso',
        retail_price: 16.00,
        wholesale_price: 13.60,
      },
      {
        label: 'Porta-Guardanapo Gengibre Branco Bordado (05 x 07 cm)',
        product_id: 'porta-guardanapo-gengibre-branco-bordado',
        retail_price: 13.90,
        wholesale_price: 11.80,
      },
    ],
  },

  // 10. Kit Natal 4 (309 / 135)
  {
    tray_id: 309,
    internal_id: 135,
    sku: 'MES-TEC-KIT-299',
    is_kit: true,
    category_id: '59',
    tray_price: '127.60',
    catalog_price: 63.80,
    catalog_wholesale: 54.20,
    tray_name: 'Kit Mesa Posta Natal Redondo Xadrez Vermelho e Gengibre Marrom 2 Lugares - Completo',
    description_small: 'Kit Mesa Posta Natal 2 Lugares (6 peças): 2 lugares americanos redondos xadrez vermelho, 2 guardanapos de tecido e 2 porta-guardanapos gengibre marrom.',
    included_items: '2 Lugares Americanos Redondos Xadrez Vermelho Borda Ondulada (42 x 42 cm), 2 Guardanapos de Tecido (44 x 44 cm) e 2 Porta-Guardanapos Gengibre Marrom Bordados (07 x 05 cm)',
    tray_description: buildTrayKitDescription({
      trayName: 'Kit Mesa Posta Natal Redondo Xadrez Vermelho e Gengibre Marrom 2 Lugares - Completo',
      laHighlight: '2 Lugares Americanos Redondos em Tricoline 100% Algodão Xadrez Vermelho com Fios Dourados e Borda Ondulada (42 x 42 cm).',
      guaHighlight: '2 Guardanapos de Tecido em Tricoline Misto com toque suave e excelente caimento (44 x 44 cm).',
      pgHighlight: '2 Porta-Guardanapos exclusivos Biscoito de Gengibre Marrom Bordado com aro reforçado (07 x 05 cm).',
      laIncluded: '2 Lugares Americanos Natal Redondos Xadrez Vermelho Borda Ondulada (42 x 42 cm).',
      guaIncluded: '2 Guardanapos de Tecido Coordenados (44 x 44 cm).',
      pgIncluded: '2 Porta-Guardanapos Natal Gengibre Marrom Bordados (07 x 05 cm).',
    }),
    catalog_short_description:
      'Composição natalina acolhedora em xadrez vermelho com fios dourados e borda ondulada, com lugar americano, guardanapo e porta-guardanapo Gengibre Marrom coordenados para reunir a família com afeto.',
    catalog_description: `Kit Mesa Posta Redondo Xadrez Vermelho e Gengibre Marrom

O Kit Mesa Posta Redondo Xadrez Vermelho e Gengibre Marrom une o encanto do xadrez natalino com fios dourados ao charme afetivo do Biscoito de Gengibre bordado. Com lugar americano redondo de acabamento ondulado, guardanapo de toque macio e porta-guardanapo artesanal, transforma a Ceia e os almoços de Natal em memórias inesquecíveis.

Destaques do produto:
• Kit completo para compor 1 lugar à mesa com harmonia e afeto.
• Lugar americano redondo em Tricoline 100% Algodão Xadrez Vermelho com Fios Dourados e Borda Ondulada, medindo 42 × 42 cm.
• Guardanapo coordenado em Tricoline de toque macio, medindo 44 × 44 cm.
• Inclui porta-guardanapo artesanal Gengibre Marrom Bordado para finalizar a composição com requinte.
• Peça autoral Mesa & Graça, ideal para Ceia de Natal, almoços festivos e celebrações de fim de ano.
• Material: lugar americano em Tricoline 100% Algodão com Fios Dourados; guardanapo em Tricoline 50% Algodão; porta-guardanapo bordado artesanal.

Itens inclusos: 1 lugar americano + 1 guardanapo + 1 porta-guardanapo.

Medidas das peças:
• Lugar americano: 42 × 42 cm.
• Guardanapo: 44 × 44 cm.
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso total aproximado: 100 gramas.`,
    game_items: [
      {
        label: 'Lugar Americano Redondo Xadrez Vermelho (42 x 42 cm)',
        product_id: 'lugar-americano-redondo-xadrez-vermelho-borda-ondulada',
        retail_price: 33.90,
        wholesale_price: 28.80,
      },
      {
        label: 'Guardanapo de Tecido (44 x 44 cm)',
        product_id: 'guardanapo-tecido-verde-pinheiro-liso',
        retail_price: 16.00,
        wholesale_price: 13.60,
      },
      {
        label: 'Porta-Guardanapo Gengibre Marrom Bordado (05 x 07 cm)',
        product_id: 'porta-guardanapo-gengibre-marrom-bordado',
        retail_price: 13.90,
        wholesale_price: 11.80,
      },
    ],
  },

  // 11. Kit Natal 3 (311 / 136)
  {
    tray_id: 311,
    internal_id: 136,
    sku: 'MES-TEC-KIT-300',
    is_kit: true,
    category_id: '59',
    tray_price: '125.60',
    catalog_price: 62.80,
    catalog_wholesale: 53.40,
    tray_name: 'Kit Mesa Posta Natal Retangular Xadrez Verde e Quebra-Nozes 2 Lugares - Completo',
    description_small: 'Kit Mesa Posta Natal 2 Lugares (6 peças): 2 lugares americanos retangulares xadrez verde, 2 guardanapos vermelhos e 2 porta-guardanapos Quebra-Nozes.',
    included_items: '2 Lugares Americanos Retangulares Xadrez Verde Borda Ondulada (44 x 36 cm), 2 Guardanapos de Tecido Vermelho Clássico (44 x 44 cm) e 2 Porta-Guardanapos Quebra-Nozes Bordados (07 x 05 cm)',
    tray_description: buildTrayKitDescription({
      trayName: 'Kit Mesa Posta Natal Retangular Xadrez Verde e Quebra-Nozes 2 Lugares - Completo',
      laHighlight: '2 Lugares Americanos Retangulares em Tricoline 100% Algodão Xadrez Verde com Fios Dourados e Borda Ondulada (44 x 36 cm).',
      guaHighlight: '2 Guardanapos de Tecido Vermelho Clássico Liso em Tricoline Misto com toque suave e excelente caimento (44 x 44 cm).',
      pgHighlight: '2 Porta-Guardanapos exclusivos Soldadinho Quebra-Nozes Bordado com aro reforçado (07 x 05 cm).',
      laIncluded: '2 Lugares Americanos Natal Retangulares Xadrez Verde Borda Ondulada (44 x 36 cm).',
      guaIncluded: '2 Guardanapos de Tecido Vermelho Clássico Liso (44 x 44 cm).',
      pgIncluded: '2 Porta-Guardanapos Natal Quebra-Nozes Bordados (07 x 05 cm).',
    }),
    catalog_short_description:
      'Composição natalina clássica em xadrez verde com fios dourados e borda ondulada vermelha, com lugar americano, guardanapo e porta-guardanapo Quebra-Nozes coordenados para uma mesa posta inesquecível.',
    catalog_description: `Kit Mesa Posta Retangular Xadrez Verde e Quebra-Nozes

O Kit Mesa Posta Retangular Xadrez Verde e Quebra-Nozes traz toda a tradição do Natal clássico para a sua mesa posta. Combinando o lugar americano retangular em xadrez verde com fios dourados e borda ondulada vermelha, o guardanapo vermelho clássico e o icônico porta-guardanapo Soldadinho Quebra-Nozes bordado, cria uma atmosfera mágica e acolhedora.

Destaques do produto:
• Kit completo para compor 1 lugar à mesa com harmonia e afeto.
• Lugar americano retangular em Tricoline 100% Algodão Xadrez Verde com Fios Dourados e Borda Ondulada, medindo 44 × 36 cm.
• Guardanapo coordenado em Tricoline Vermelho Clássico, medindo 44 × 44 cm.
• Inclui porta-guardanapo artesanal Quebra-Nozes Bordado para finalizar a composição com requinte.
• Peça autoral Mesa & Graça, ideal para Ceia de Natal, almoços festivos e celebrações de fim de ano.
• Material: lugar americano em Tricoline 100% Algodão com Fios Dourados; guardanapo em Tricoline 50% Algodão; porta-guardanapo bordado artesanal.

Itens inclusos: 1 lugar americano + 1 guardanapo + 1 porta-guardanapo.

Medidas das peças:
• Lugar americano: 44 × 36 cm.
• Guardanapo: 44 × 44 cm.
• Porta-guardanapo: 07 × 05 cm.

Observação: as cores podem variar levemente conforme a iluminação e a tela do dispositivo.

Características do produto:
• Peso total aproximado: 100 gramas.`,
    game_items: [
      {
        label: 'Lugar Americano Retangular Xadrez Verde (44 x 36 cm)',
        product_id: 'lugar-americano-retangular-xadrez-verde-borda-ondulada',
        retail_price: 32.90,
        wholesale_price: 28.00,
      },
      {
        label: 'Guardanapo de Tecido (44 x 44 cm)',
        product_id: 'guardanapo-tecido-vermelho-classico-liso',
        retail_price: 16.00,
        wholesale_price: 13.60,
      },
      {
        label: 'Porta-Guardanapo Quebra-Nozes Bordado (05 x 07 cm)',
        product_id: 'porta-guardanapo-quebra-nozes-bordado',
        retail_price: 13.90,
        wholesale_price: 11.80,
      },
    ],
  },
];

async function main() {
  console.log('=== 1. Atualizando Produtos Base e Kits na Tray Commerce (IDs 291..311) ===');

  // Primeiro atualiza os 8 avulsos (para que 297 e 299 já estejam com R$ 32,00 antes de recalcular os Kits)
  for (const item of ITEMS.filter((i) => !i.is_kit)) {
    const body = {
      Product: {
        category_id: Number(item.category_id),
        related_categories: [],
        price: Number(item.tray_price),
        description: item.tray_description,
        description_small: item.description_small,
        included_items: item.included_items,
      },
    };
    const res = await trayRequest('PUT', `/products/${item.tray_id}`, body);
    console.log(`[Tray Base] ID ${item.tray_id} (${item.sku}) -> Preço R$ ${item.tray_price} | related_categories=[] | Status: ${res.code}`);
  }

  // Atualiza os vínculos ProductKit dos guardanapos (IDs de vínculo 355, 361, 367) para refletir R$ 32,00
  const kitGuardanapoLinks = [
    { kit_link_id: 355, product_parent_id: 307, product_id: 297 },
    { kit_link_id: 361, product_parent_id: 309, product_id: 299 },
    { kit_link_id: 367, product_parent_id: 311, product_id: 299 },
  ];

  for (const link of kitGuardanapoLinks) {
    try {
      await trayRequest('PUT', `/products/kits/${link.kit_link_id}`, {
        ProductKit: {
          product_parent_id: link.product_parent_id,
          product_id: link.product_id,
          quantity: 1,
          price_rule: 1,
        },
      });
      console.log(`[Tray Kit Link] Vínculo ${link.kit_link_id} (Parent ${link.product_parent_id} -> Guardanapo ${link.product_id}) sincronizado para R$ 32,00.`);
    } catch (err) {
      console.warn(`[Tray Kit Link] Aviso no vínculo ${link.kit_link_id}:`, err.message);
    }
  }

  // Agora atualiza os 3 Kits (307, 309, 311)
  for (const item of ITEMS.filter((i) => i.is_kit)) {
    const body = {
      Product: {
        category_id: Number(item.category_id),
        related_categories: [],
        price: Number(item.tray_price),
        description: item.tray_description,
        description_small: item.description_small,
        included_items: item.included_items,
      },
    };
    const res = await trayRequest('PUT', `/products/${item.tray_id}`, body);
    console.log(`[Tray Kit] ID ${item.tray_id} (${item.sku}) -> Preço R$ ${item.tray_price} | Categoria 59 exclusiva | Status: ${res.code}`);
  }

  console.log('\n=== 2. Atualizando Catálogo Atacado no Supabase (internal_id 126..136) ===');
  for (const item of ITEMS) {
    const patchPayload = {
      price: item.catalog_price,
      wholesale_price: item.catalog_wholesale,
      short_description: item.catalog_short_description,
      description: item.catalog_description,
    };
    if (item.game_items) {
      patchPayload.game_items = item.game_items;
    }
    await updateSupabaseRow(item.internal_id, patchPayload);
    console.log(
      `[Supabase] internal_id=${item.internal_id} (${item.sku}) -> Varejo: R$ ${item.catalog_price.toFixed(2)} | Atacado: R$ ${item.catalog_wholesale.toFixed(2)}`
    );
  }

  console.log('\n=== Concluído com sucesso! ===');
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
