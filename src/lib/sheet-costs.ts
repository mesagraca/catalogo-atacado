/**
 * Catálogo canônico de custos de confecção e tecidos extraídos da Planilha Oficial Google Sheets da Mesa & Graça.
 *
 * @description
 * Mapeia os 27 temas e coleções com custos unitários, kit 2 unidades e kits de 6 peças completos.
 * Fonte: https://docs.google.com/spreadsheets/d/1qha8s1eOs3pbv1fp7PUeaoWF37lwTm9ZolJdUx3hnjA
 *
 * @category Costs
 * @since v3.1.0
 */

export interface SheetCollectionCost {
  title: string;
  lugar_americano: { unit: number; kit2: number };
  guardanapo: { unit: number; kit2: number };
  porta_guardanapo: { unit: number; kit2: number };
  kit_completo_6pecas: number;
}

export const SHEET_COSTS_CATALOG: Record<string, SheetCollectionCost> = {
  "FUNDO DO MAR - PREMIUM": {
    title: "FUNDO DO MAR - PREMIUM",
    lugar_americano: { unit: 17.26, kit2: 34.52 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 68.42,
  },
  "BRIDGERTON AZUL": {
    title: "BRIDGERTON AZUL",
    lugar_americano: { unit: 18.06, kit2: 36.12 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 68.02,
  },
  "BRIDGERTON VERDE": {
    title: "BRIDGERTON VERDE",
    lugar_americano: { unit: 18.06, kit2: 36.12 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 68.02,
  },
  "FEIJOADA": {
    title: "FEIJOADA",
    lugar_americano: { unit: 13.98, kit2: 27.96 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 59.86,
  },
  "HOTDOG": {
    title: "HOTDOG",
    lugar_americano: { unit: 13.98, kit2: 27.96 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 59.86,
  },
  "CHURRASCO": {
    title: "CHURRASCO",
    lugar_americano: { unit: 13.98, kit2: 27.96 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 59.86,
  },
  "HAMBURGUER": {
    title: "HAMBURGUER",
    lugar_americano: { unit: 13.98, kit2: 27.96 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 59.86,
  },
  "PIZZA": {
    title: "PIZZA",
    lugar_americano: { unit: 15.49, kit2: 30.98 },
    guardanapo: { unit: 13.03, kit2: 26.06 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 69.74,
  },
  "LIMÃO AZUL": {
    title: "LIMÃO AZUL",
    lugar_americano: { unit: 12.31, kit2: 24.62 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 56.52,
  },
  "LIMÃO BRANCO": {
    title: "LIMÃO BRANCO",
    lugar_americano: { unit: 12.31, kit2: 24.62 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 56.52,
  },
  "ROSE IMPERIAL": {
    title: "ROSE IMPERIAL",
    lugar_americano: { unit: 15.35, kit2: 30.7 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 8.9, kit2: 17.8 },
    kit_completo_6pecas: 67.7,
  },
  "FOLHAS VERDE": {
    title: "FOLHAS VERDE",
    lugar_americano: { unit: 14.89, kit2: 29.78 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 61.68,
  },
  "MAGNÓLIA": {
    title: "MAGNÓLIA",
    lugar_americano: { unit: 13.13, kit2: 26.26 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 58.16,
  },
  "FLOR MARROM": {
    title: "FLOR MARROM",
    lugar_americano: { unit: 13.13, kit2: 26.26 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 58.16,
  },
  "CEREJINHA": {
    title: "CEREJINHA",
    lugar_americano: { unit: 15.4, kit2: 30.8 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 62.7,
  },
  "ABELINHA": {
    title: "ABELINHA",
    lugar_americano: { unit: 15.4, kit2: 30.8 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 62.7,
  },
  "OVINHO": {
    title: "OVINHO",
    lugar_americano: { unit: 15.42, kit2: 30.84 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 62.74,
  },
  "FLOR DE LÓTUS": {
    title: "FLOR DE LÓTUS",
    lugar_americano: { unit: 13.13, kit2: 26.26 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 58.16,
  },
  "NATAL 1": {
    title: "NATAL 1 - FLORESTA",
    lugar_americano: { unit: 16.14, kit2: 32.28 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 66.18,
  },
  "NATAL 2": {
    title: "NATAL 2 - LAÇO",
    lugar_americano: { unit: 16.14, kit2: 32.28 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 66.18,
  },
  "NATAL 3": {
    title: "NATAL 3 - QUEBRA NOZES",
    lugar_americano: { unit: 20.14, kit2: 40.28 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 74.18,
  },
  "NATAL 4": {
    title: "NATAL 4 - GENGIBRE MARROM",
    lugar_americano: { unit: 20.32, kit2: 40.64 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 74.54,
  },
  "NATAL 5": {
    title: "NATAL 5 - PREGUEADO",
    lugar_americano: { unit: 17.1, kit2: 34.2 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 7.35, kit2: 14.7 },
    kit_completo_6pecas: 68.1,
  },
  "ALECRIM": {
    title: "ALECRIM",
    lugar_americano: { unit: 14.89, kit2: 29.78 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 61.68,
  },
  "LAVANDA": {
    title: "LAVANDA",
    lugar_americano: { unit: 14.89, kit2: 29.78 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 61.68,
  },
  "COSTELA DE ADÃO": {
    title: "COSTELA DE ADÃO",
    lugar_americano: { unit: 14.89, kit2: 29.78 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 61.68,
  },
  "RAMO DE OLIVEIRA": {
    title: "RAMO DE OLIVEIRA",
    lugar_americano: { unit: 14.89, kit2: 29.78 },
    guardanapo: { unit: 9.6, kit2: 19.2 },
    porta_guardanapo: { unit: 6.35, kit2: 12.7 },
    kit_completo_6pecas: 61.68,
  },
};

/**
 * Tabela de custos de SKUs específicos vendidos na loja.
 * Mapeia diretamente produtos de terceiros e kits canônicos com custos auditados.
 */
export const SPECIFIC_SKU_COSTS: Record<string, number> = {
  "MES-MAD-AFE-080": 17.80, // Porta Guardanapo Dália Rosé Provence - Kit 2 Un (Planilha ROSE IMPERIAL)
  "MES-TEC-KIT-298": 68.10, // Kit Mesa Posta Natal Completo Pregueado 6 Peças (NATAL 5)
  "MES-TEC-JAM-291": 40.64, // Kit Mesa Posta Natal 2x Lugar Americano Redondo
  "MES-NYL-JAM-159": 30.98, // Lugar Americano Xadrez Verde - Kit 2 Un
  "MES-NYL-JAM-165": 30.98, // Lugar Americano Xadrez Bordô - Kit 2 Un
  "MES-TEC-GUA-166": 26.06, // Guardanapo de Tecido Xadrez Bordô - Kit 2 Un
  "MES-PGU-CHA-153": 12.00, // Porta Guardanapo Chapéu de Palha - Kit 2 Un (2 x 6.00)
  "MES-TEC-KIT-300": 74.18, // Kit Mesa Posta Natal Completo Verde 6 Peças (NATAL 3)
  "MES-PGU-PER-152": 11.20, // Porta Guardanapo Dourado com Pérolas - Kit 2 Un (2 x 5.60)
  "MES-CER-NAU-049": 22.00, // Prato Raso de Cerâmica Caranguejo Mesa Posta
  "MES-PGU-SUC-155": 14.70, // Porta Guardanapo Suculenta Verde com Fibra - Kit 2 Un (2 x 7.35)
  "MES-MET-PGU-211": 16.50, // Porta Guardanapo Orelle Dourado Lyor - Kit 2 Un
  "MES-BOR-PGU-214": 12.70, // Porta Guardanapo Pizza Bordado - Kit 2 Un (2 x 6.35)
  "KIT-TEC-KMP-251": 62.74, // Kit Mesa Posta Ovinho 6 Peças (Planilha OVINHO)
  "KIT-TEC-KMP-250": 62.70, // Kit Mesa Posta Abelinha 6 Peças (Planilha ABELINHA)
  "MES-KIT-MPT-176": 60.00, // Kit Mesa Posta Limão Siciliano 2 Lugares Completo (Tray cost_price)
  "KIT-MPT-176": 60.00,
};

/**
 * Determina se o produto é têxtil e de confecção própria da Mesa & Graça.
 *
 * @param {string} [name] - Nome do produto
 * @param {string} [sku] - Referência/SKU
 * @returns {boolean} True se for confecção têxtil própria
 * @category Costs
 * @since v3.2.0
 */
export function isOwnProductionTextile(name?: string, sku?: string): boolean {
  const norm = (name || "").toLowerCase();
  const skuUp = (sku || "").toUpperCase();

  // Excluir expressamente produtos de terceiros (cerâmicas, vidros, enfeites e Lyor)
  if (
    norm.includes("cerâmica") ||
    norm.includes("ceramica") ||
    norm.includes("bowl") ||
    norm.includes("tigelinha") ||
    norm.includes("prato") ||
    norm.includes("taça") ||
    norm.includes("taca") ||
    norm.includes("leiteira") ||
    norm.includes("copo") ||
    norm.includes("lyor") ||
    norm.includes("enfeite") ||
    norm.includes("relax navy") ||
    norm.includes("conchas") ||
    skuUp.includes("CER") ||
    skuUp.includes("VID") ||
    skuUp.includes("CRI") ||
    skuUp.includes("MAD-NAU")
  ) {
    return false;
  }

  // Têxteis de produção própria da Mesa & Graça
  if (
    norm.includes("lugar americano") ||
    norm.includes("guardanapo") ||
    norm.includes("porta guardanapo") ||
    norm.includes("kit mesa posta") ||
    norm.includes("jogo americano") ||
    norm.includes("abelinha") ||
    norm.includes("ovinho") ||
    norm.includes("limão") ||
    norm.includes("flor de lótus") ||
    norm.includes("flor de lottus") ||
    norm.includes("pizza") ||
    norm.includes("natal") ||
    norm.includes("bridgerton") ||
    norm.includes("cerejinha") ||
    norm.includes("magnólia") ||
    norm.includes("feijoada") ||
    norm.includes("churrasco") ||
    norm.includes("hambúrguer") ||
    norm.includes("hotdog") ||
    skuUp.includes("LAM") ||
    skuUp.includes("JAM") ||
    skuUp.includes("GUA") ||
    skuUp.includes("PGU") ||
    skuUp.includes("KMP") ||
    skuUp.includes("TEC") ||
    skuUp.includes("COU") ||
    skuUp.includes("NYL") ||
    skuUp.includes("KIT-")
  ) {
    return true;
  }

  return false;
}

export interface ProductCostResult {
  cost: number;
  is_own_production: boolean;
  has_missing_cost: boolean;
  pack_description: string;
}

/**
 * Resolve o custo exato de um produto vendido com base na planilha e catálogo,
 * diferenciando vendas unitárias avulsas de vendas em kit/par e kits completos.
 *
 * @param {string} name - Nome completo do produto
 * @param {string} sku - Referência ou SKU
 * @param {number} [fallbackCost] - Custo cadastrado no Supabase ou Tray
 * @param {number} [effectivePrice] - Preço efetivo de venda
 * @returns {ProductCostResult} Resultado com custo, classificação e status
 * @category Costs
 * @since v3.2.0
 */
export function resolveExactProductCostDetails(
  name: string,
  sku?: string,
  fallbackCost?: number,
  effectivePrice?: number,
): ProductCostResult {
  const norm = (name || "").toLowerCase();
  const skuUp = (sku || "").toUpperCase().trim();
  const isOwn = isOwnProductionTextile(name, sku);
  const effPrice = Number(effectivePrice || 0);

  // 1. Verificação direta por SKU override (apenas se não conflitar com venda unitária)
  if (skuUp && SPECIFIC_SKU_COSTS[skuUp]) {
    const rawCost = SPECIFIC_SKU_COSTS[skuUp];
    // Se o preço de venda for muito inferior ao custo do kit (ex: venda unitária avulsa)
    if (effPrice > 0 && effPrice < rawCost * 0.75) {
      return {
        cost: Number((rawCost / 2).toFixed(2)),
        is_own_production: isOwn,
        has_missing_cost: false,
        pack_description: "Unidade Avulsa (1 un)",
      };
    }
    return {
      cost: rawCost,
      is_own_production: isOwn,
      has_missing_cost: false,
      pack_description: "Kit / Par (2 un)",
    };
  }

  // 2. Kit Fundo do Mar Premium
  if (norm.includes("fundo do mar") && (norm.includes("kit") || norm.includes("premium"))) {
    return {
      cost: 34.52,
      is_own_production: true,
      has_missing_cost: false,
      pack_description: "Kit 2 Lugares",
    };
  }

  // 3. Mapeamento por tema da planilha
  let sheetKey: string | null = null;
  if (norm.includes("pizza") || skuUp.includes("PIZZ") || skuUp.includes("214")) sheetKey = "PIZZA";
  else if (norm.includes("dália") || norm.includes("dalia") || skuUp.includes("080")) sheetKey = "ROSE IMPERIAL";
  else if (norm.includes("itália") || norm.includes("italia") || skuUp.includes("168") || skuUp.includes("167")) sheetKey = "PIZZA";
  else if (norm.includes("suculenta") || skuUp.includes("155")) sheetKey = "RAMO DE OLIVEIRA";
  else if (norm.includes("fundo do mar")) sheetKey = "FUNDO DO MAR - PREMIUM";
  else if (norm.includes("bridgerton azul")) sheetKey = "BRIDGERTON AZUL";
  else if (norm.includes("bridgerton verde")) sheetKey = "BRIDGERTON VERDE";
  else if (norm.includes("quebra-nozes") || norm.includes("natal 3") || skuUp.includes("300")) sheetKey = "NATAL 3";
  else if (norm.includes("gengibre marrom") || norm.includes("natal 4") || skuUp.includes("299") || skuUp.includes("291")) sheetKey = "NATAL 4";
  else if (norm.includes("pregueado") || norm.includes("natal 5") || skuUp.includes("298") || skuUp.includes("297")) sheetKey = "NATAL 5";
  else if (norm.includes("natal 1") || norm.includes("floresta")) sheetKey = "NATAL 1";
  else if (norm.includes("natal 2")) sheetKey = "NATAL 2";
  else if (norm.includes("xadrez verde") || skuUp.includes("159")) sheetKey = "PIZZA";
  else if (norm.includes("xadrez bordô") || skuUp.includes("165") || skuUp.includes("166")) sheetKey = "PIZZA";
  else if (norm.includes("limão azul") || norm.includes("limão siciliano azul") || skuUp.includes("179")) sheetKey = "LIMÃO AZUL";
  else if (norm.includes("limão branco") || norm.includes("limão siciliano branco")) sheetKey = "LIMÃO BRANCO";
  else if (norm.includes("limão") || skuUp.includes("176")) sheetKey = "LIMÃO BRANCO";
  else if (norm.includes("flor de lóttus") || norm.includes("flor de lotus") || skuUp.includes("230")) sheetKey = "FLOR DE LÓTUS";
  else if (norm.includes("ovinho") || skuUp.includes("251")) sheetKey = "OVINHO";
  else if (norm.includes("abelinha") || skuUp.includes("250")) sheetKey = "ABELINHA";
  else if (norm.includes("cerejinha") || skuUp.includes("252")) sheetKey = "CEREJINHA";
  else if (norm.includes("magnólia") || norm.includes("magnolia") || skuUp.includes("254")) sheetKey = "MAGNÓLIA";
  else if (norm.includes("hambúrguer") || norm.includes("hamburguer") || skuUp.includes("142")) sheetKey = "HAMBURGUER";
  else if (norm.includes("churrasco") || skuUp.includes("139")) sheetKey = "CHURRASCO";
  else if (norm.includes("feijoada") || skuUp.includes("141")) sheetKey = "FEIJOADA";
  else if (norm.includes("hotdog") || skuUp.includes("140")) sheetKey = "HOTDOG";
  else if (norm.includes("alecrim") || skuUp.includes("121")) sheetKey = "ALECRIM";
  else if (norm.includes("lavanda") || skuUp.includes("119")) sheetKey = "LAVANDA";
  else if (norm.includes("costela de adão") || skuUp.includes("120")) sheetKey = "COSTELA DE ADÃO";
  else if (norm.includes("oliveira") || skuUp.includes("122")) sheetKey = "RAMO DE OLIVEIRA";

  if (sheetKey && SHEET_COSTS_CATALOG[sheetKey]) {
    const s = SHEET_COSTS_CATALOG[sheetKey];

    // 1. Kit Completo de 2 Lugares (6 peças completas)
    const is6Pecas =
      norm.includes("6 peças") ||
      norm.includes("6 pçs") ||
      norm.includes("6pcs") ||
      norm.includes("2 lugares") ||
      norm.includes("2lugares");

    if (is6Pecas) {
      return {
        cost: s.kit_completo_6pecas,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Kit Mesa Posta 2 Lugares (6 peças)",
      };
    }

    // 2. Kit Completo de 1 Lugar (3 peças: Lugar Americano + Guardanapo + Porta-Guardanapo)
    const hasLA = norm.includes("lugar americano") || norm.includes("jogo americano") || skuUp.includes("LAM") || skuUp.includes("JAM");
    const hasGUA = norm.includes("guardanapo") || skuUp.includes("GUA");
    const hasPGU = norm.includes("porta") || skuUp.includes("PGU");

    if (hasLA && hasGUA && hasPGU) {
      const kit3Cost = Number((s.lugar_americano.unit + s.guardanapo.unit + s.porta_guardanapo.unit).toFixed(2));
      return {
        cost: kit3Cost,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Kit Mesa Posta 1 Lugar (3 peças)",
      };
    }

    // 3. Kit genérico de mesa posta
    if (norm.includes("kit mesa posta") && !norm.includes("lugar americano") && !norm.includes("guardanapo") && !norm.includes("porta")) {
      return {
        cost: s.kit_completo_6pecas,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Kit Mesa Posta 2 Lugares (6 peças)",
      };
    }

    // Lugar Americano
    if (norm.includes("lugar americano") || skuUp.includes("LAM") || skuUp.includes("JAM") || skuUp.includes("LAF")) {
      const isExplicitKit = norm.includes("kit 2") || norm.includes("2 un") || norm.includes("2un") || norm.includes("par ");
      const isUnitaryByPrice = effPrice > 0 && effPrice < s.lugar_americano.kit2 * 0.70;

      if (isUnitaryByPrice && !isExplicitKit) {
        return {
          cost: s.lugar_americano.unit,
          is_own_production: true,
          has_missing_cost: false,
          pack_description: "Lugar Americano (1 un avulsa)",
        };
      }
      return {
        cost: s.lugar_americano.kit2,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Par de Lugar Americano (2 un)",
      };
    }

    // Guardanapo
    if (norm.includes("guardanapo") && !norm.includes("porta guardanapo")) {
      const isExplicitKit = norm.includes("kit 2") || norm.includes("2 un") || norm.includes("2un") || norm.includes("par ");
      const isUnitaryByPrice = effPrice > 0 && effPrice < s.guardanapo.kit2 * 0.70;

      if (isUnitaryByPrice && !isExplicitKit) {
        return {
          cost: s.guardanapo.unit,
          is_own_production: true,
          has_missing_cost: false,
          pack_description: "Guardanapo (1 un avulsa)",
        };
      }
      return {
        cost: s.guardanapo.kit2,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Par de Guardanapos (2 un)",
      };
    }

    // Porta Guardanapo
    if (norm.includes("porta guardanapo") || skuUp.includes("PGU")) {
      const isExplicitKit = norm.includes("kit 2") || norm.includes("2 un") || norm.includes("2un") || norm.includes("par ");
      const isUnitaryByPrice = effPrice > 0 && effPrice < s.porta_guardanapo.kit2 * 0.70;

      if (isUnitaryByPrice && !isExplicitKit) {
        return {
          cost: s.porta_guardanapo.unit,
          is_own_production: true,
          has_missing_cost: false,
          pack_description: "Porta Guardanapo (1 un avulsa)",
        };
      }
      return {
        cost: s.porta_guardanapo.kit2,
        is_own_production: true,
        has_missing_cost: false,
        pack_description: "Par de Porta Guardanapo (2 un)",
      };
    }
  }

  // 4. Fallback de custo cadastrado no Supabase ou Tray
  const base = Number(fallbackCost || 0);
  if (base > 0) {
    return {
      cost: base,
      is_own_production: isOwn,
      has_missing_cost: false,
      pack_description: isOwn ? "Confecção Própria" : "Produto de Terceiro",
    };
  }

  // 5. Produto de terceiro sem custo cadastrado na Tray
  return {
    cost: 0,
    is_own_production: isOwn,
    has_missing_cost: true,
    pack_description: "Produto s/ Custo Cadastrado",
  };
}

/**
 * Função mantida para retrocompatibilidade com chamadas simples.
 */
export function resolveExactProductCost(
  name: string,
  sku?: string,
  fallbackCost?: number,
  effectivePrice?: number,
): number {
  return resolveExactProductCostDetails(name, sku, fallbackCost, effectivePrice).cost;
}
