import type { Product, Variation } from "@/types/catalog";

export interface CanonicalMediaImage {
  url: string; // JPEG sRGB otimizada para Tray (< 350 KB)
  url_webp: string; // WebP para canais que suportam
  alt: string;
  is_cover: boolean;
  type: "studio" | "editorial";
}

export interface DataProvenance {
  has_estimates: boolean;
  estimated_fields: string[];
  verified_fields: string[];
  notes: Record<string, string>;
}

export interface CanonicalProduct {
  sync_control: {
    catalog_product_id: string;
    tray_product_id: number | null;
    sku: string | null;
    status: "synced" | "pending";
    last_sync_at: string;
  };
  general: {
    name: string;
    sku: string | null;
    brand: string;
    category: string;
    collection: string | null;
    active: boolean;
    available_in_store: boolean;
    description: string;
    short_description: string;
    included_items: string;
    warranty: string;
    warranty_days: number;
    stock: number;
  };
  pricing: {
    price: number | null;
    wholesale_price: number | null;
    cost_price: number;
    promotional_price: number | null;
  };
  logistics: {
    weight_grams: number;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    free_shipping: boolean;
    production_days: number;
    availability_text: string;
  };
  fiscal: {
    ncm: string;
    ean: string;
    origin: number;
    cest: string;
    cfop_internal: string;
    cfop_external: string;
    csosn: string;
    tax_group_tray: string;
  };
  technical_specifications: Record<string, string>;
  google_shopping: {
    category_id: number;
    category_name: string;
    condition: "new";
    availability: "in_stock";
    brand: string;
    identifier_exists: boolean;
  };
  media: {
    images: CanonicalMediaImage[];
  };
  variants: Array<{
    tray_variant_id: number | null;
    sku: string;
    stock: number;
    price: number | null;
    cost_price: number;
    ncm: string;
    ean: string;
    attributes: Record<string, string>;
    image_url: string;
  }>;
  data_provenance: DataProvenance;
}

export function toCanonicalProduct(
  product: Product,
  baseUrl = "https://catalogo.mesaegraca.com.br",
): CanonicalProduct {
  const toAbsoluteUrl = (path: string | null | undefined, ext?: ".jpg" | ".webp") => {
    if (!path) return "";
    let finalPath = path.startsWith("http") ? path : `${baseUrl}${path}`;
    if (ext) {
      finalPath = finalPath.replace(/\.(png|jpg|jpeg|webp)$/i, ext);
    }
    return finalPath;
  };

  const estimatedFields: string[] = [];
  const verifiedFields: string[] = [
    "general.name",
    "general.sku",
    "general.category",
    "media.images",
  ];
  const provenanceNotes: Record<string, string> = {
    stock: "Estoque configurado em 0 por segurança até contagem física de inventário.",
    cost_price: "Preço de custo configurado em 0.00 até envio dos custos oficiais de fábrica.",
    fiscal_ean: "EAN preenchido com string vazia ('') indicando fabricação própria autoral sem GTIN.",
  };

  if (product.collection) {
    verifiedFields.push("general.collection");
  }
  if (product.tray_id) {
    verifiedFields.push("sync_control.tray_product_id");
  }

  // 1. Logística estimada com base na categoria
  let weight = 150;
  let length = 38;
  let width = 38;
  let height = 2;

  if (product.category === "Jogos") {
    weight = 450;
    length = 42;
    width = 34;
    height = 5;
  } else if (product.category === "Porta-guardanapos") {
    weight = product.kit_quantity ? 160 : 60;
    length = 18;
    width = 14;
    height = 6;
  }

  estimatedFields.push("logistics.weight_grams", "logistics.dimensions");
  provenanceNotes["logistics"] =
    "Peso e dimensões de embalagem estimados por categoria para viabilizar frete; aguarda pesagem física na expedição.";

  // 2. Preços (sem dados inventados)
  let wholesalePrice = product.wholesale_price ?? null;
  if (wholesalePrice == null && product.game_items?.length) {
    // Soma exata dos itens reais do jogo
    wholesalePrice = Math.round(
      product.game_items.reduce((acc, item) => acc + (item.wholesale_price ?? 0), 0) * 100,
    ) / 100;
    verifiedFields.push("pricing.wholesale_price");
  } else if (wholesalePrice != null) {
    verifiedFields.push("pricing.wholesale_price");
  }

  let retailPrice = product.retail_price ?? null;
  if (retailPrice != null) {
    verifiedFields.push("pricing.price");
  } else if (wholesalePrice != null) {
    // Margem padrão de varejo sugerida (1.65x)
    retailPrice = Math.round(wholesalePrice * 1.65 * 100) / 100;
    estimatedFields.push("pricing.price");
    provenanceNotes["pricing.price"] =
      "Preço de varejo calculado com margem sugerida de 1.65x sobre o atacado; aguarda definição de tabela B2C oficial.";
  }

  const costPrice = 0.0; // Zero por segurança

  // 3. Imagens (JPEG < 350 KB para Tray + WebP para canais modernos)
  const images: CanonicalMediaImage[] = [];

  if (product.image_url) {
    images.push({
      url: toAbsoluteUrl(product.image_url, ".jpg"),
      url_webp: toAbsoluteUrl(product.image_url, ".webp"),
      alt: `${product.name} - Foto de Estúdio`,
      is_cover: true,
      type: "studio",
    });
  }

  if (product.editorial_image_url) {
    images.push({
      url: toAbsoluteUrl(product.editorial_image_url, ".jpg"),
      url_webp: toAbsoluteUrl(product.editorial_image_url, ".webp"),
      alt: `${product.name} - Mesa Posta em Uso`,
      is_cover: false,
      type: "editorial",
    });
  }

  // 4. Especificações técnicas
  const specs: Record<string, string> = {
    Marca: "Mesa & Graça",
    Categoria: product.category,
    "Cuidados de Lavagem": "Lavar com sabão neutro, não usar alvejante, secar à sombra.",
  };

  if (product.collection) specs["Coleção"] = product.collection;
  if (product.color_name) specs["Cor / Estampa"] = product.color_name;
  if (product.kit_quantity) specs["Quantidade do Kit"] = `${product.kit_quantity} peças`;

  if (product.materials?.length) {
    specs["Composição"] = product.materials
      .map((m) => `${m.label}: ${m.value}`)
      .join(" | ");
    verifiedFields.push("technical_specifications.materials");
  }

  if (product.dimensions?.length) {
    specs["Medidas"] = product.dimensions
      .map((d) => `${d.label}: ${d.value}`)
      .join(" | ");
    verifiedFields.push("technical_specifications.dimensions");
  }

  if (product.game_items?.length) {
    specs["Composição do Jogo"] = product.game_items
      .map((g) => `${g.label} (Atacado: R$ ${g.wholesale_price})`)
      .join(" + ");
    verifiedFields.push("technical_specifications.game_items");
  }

  // 5. Itens inclusos
  const includedItems = product.game_items?.length
    ? product.game_items.map((i) => `1 ${i.label}`).join(", ")
    : product.kit_quantity
      ? `Kit com ${product.kit_quantity} unidades de ${product.name}`
      : `1 unidade de ${product.name}`;

  // 6. Dados Fiscais
  const ncm = product.category === "Porta-guardanapos" ? "73239300" : "63025300";

  // 7. Variantes (estoque zero por segurança)
  const variants =
    product.variations?.map((v: Variation) => ({
      tray_variant_id: null,
      sku: v.sku ?? `${product.sku}-${v.name.substring(0, 2).toUpperCase()}`,
      stock: 0,
      price: retailPrice,
      cost_price: 0.0,
      ncm,
      ean: "",
      attributes: {
        Cor: v.name,
        Estampa: v.pattern === "xadrez" ? "Xadrez" : "Liso",
      },
      image_url: toAbsoluteUrl(product.image_url, ".jpg"),
    })) ?? [];

  return {
    sync_control: {
      catalog_product_id: product.id,
      tray_product_id: product.tray_id ?? null,
      sku: product.sku ?? null,
      status: product.tray_id ? "synced" : "pending",
      last_sync_at: new Date().toISOString(),
    },
    general: {
      name: product.name,
      sku: product.sku,
      brand: "Mesa & Graça",
      category: product.category,
      collection: product.collection ?? null,
      active: product.is_visible,
      available_in_store: product.is_visible,
      description: product.description ?? `${product.name} autoral Mesa & Graça.`,
      short_description: `${product.name} autoral Mesa & Graça para mesa posta.`,
      included_items: includedItems,
      warranty: "30 dias contra defeitos de fabricação",
      warranty_days: 30,
      stock: 0,
    },
    pricing: {
      price: retailPrice,
      wholesale_price: wholesalePrice,
      cost_price: costPrice,
      promotional_price: null,
    },
    logistics: {
      weight_grams: weight,
      length_cm: length,
      width_cm: width,
      height_cm: height,
      free_shipping: false,
      production_days: 0,
      availability_text: "Pronta entrega",
    },
    fiscal: {
      ncm,
      ean: "",
      origin: 0,
      cest: "",
      cfop_internal: "5102",
      cfop_external: "6102",
      csosn: "102",
      tax_group_tray: "",
    },
    technical_specifications: specs,
    google_shopping: {
      category_id: 684,
      category_name: "Home & Garden > Linens & Bedding > Table Linens > Placemats",
      condition: "new",
      availability: "in_stock",
      brand: "Mesa & Graça",
      identifier_exists: false,
    },
    media: {
      images,
    },
    variants,
    data_provenance: {
      has_estimates: estimatedFields.length > 0,
      estimated_fields: estimatedFields,
      verified_fields: verifiedFields,
      notes: provenanceNotes,
    },
  };
}
