import { supabase, supabaseAdmin } from "./supabase";
import { FEATURED_PRODUCTS, CATEGORIES, type Product } from "@/types/catalog";
import { toCanonicalProduct, type CanonicalProduct } from "./catalog-canonical";

/**
 * Converte um registro do banco de dados PostgreSQL (Supabase)
 * para o formato CanonicalProduct oficial.
 */
export function dbRecordToCanonical(record: any, baseUrl: string): CanonicalProduct {
  // Ajustar URLs relativas de imagens para absolutas se necessário
  let media = record.media;
  if (media && Array.isArray(media.images)) {
    media = {
      ...media,
      images: media.images.map((img: any) => ({
        ...img,
        url: img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`,
        url_webp: img.url_webp && !img.url_webp.startsWith("http") ? `${baseUrl}${img.url_webp}` : img.url_webp,
      })),
    };
  }

  // Mapear variantes
  const variants = (record.variants || []).map((v: any) => ({
    tray_variant_id: v.tray_variant_id ?? null,
    sku: v.sku,
    stock: Number(v.stock ?? 0),
    price: v.price != null ? Number(v.price) : null,
    cost_price: Number(v.cost_price ?? 0),
    ncm: v.ncm || record.ncm,
    ean: v.ean || "",
    attributes: v.attributes || {},
    image_url: v.image_url?.startsWith("http") ? v.image_url : `${baseUrl}${v.image_url}`,
  }));

  return {
    sync_control: {
      catalog_product_id: record.id,
      tray_product_id: record.tray_product_id ?? null,
      sku: record.sku,
      status: record.tray_product_id ? "synced" : "pending",
      last_sync_at: record.last_sync_at || new Date().toISOString(),
    },
    general: {
      name: record.name,
      sku: record.sku,
      brand: record.brand || "Mesa & Graça",
      category: record.category,
      collection: record.collection || null,
      active: record.active ?? true,
      available_in_store: record.available_in_store ?? true,
      description: record.description || "",
      short_description: record.short_description || "",
      included_items: record.included_items || "",
      warranty: record.warranty || "30 dias contra defeitos de fabricação",
      warranty_days: Number(record.warranty_days ?? 30),
      stock: Number(record.stock ?? 0),
    },
    pricing: {
      price: record.price != null ? Number(record.price) : null,
      wholesale_price: record.wholesale_price != null ? Number(record.wholesale_price) : null,
      cost_price: Number(record.cost_price ?? 0),
      promotional_price: record.promotional_price != null ? Number(record.promotional_price) : null,
    },
    logistics: {
      weight_grams: Number(record.weight_grams ?? 150),
      length_cm: Number(record.length_cm ?? 38),
      width_cm: Number(record.width_cm ?? 38),
      height_cm: Number(record.height_cm ?? 2),
      free_shipping: Boolean(record.free_shipping),
      production_days: Number(record.production_days ?? 0),
      availability_text: record.availability_text || "Pronta entrega",
    },
    fiscal: {
      ncm: record.ncm || "63025300",
      ean: record.ean || "",
      origin: Number(record.origin ?? 0),
      cest: record.cest || "",
      cfop_internal: record.cfop_internal || "5102",
      cfop_external: record.cfop_external || "6102",
      csosn: record.csosn || "102",
      tax_group_tray: record.tax_group_tray || "",
    },
    technical_specifications: record.technical_specifications || {},
    google_shopping: record.google_shopping || {
      category_id: 684,
      category_name: "Home & Garden > Linens & Bedding > Table Linens > Placemats",
      condition: "new",
      availability: "in_stock",
      brand: "Mesa & Graça",
      identifier_exists: false,
    },
    media: media || { images: [] },
    variants,
    data_provenance: record.data_provenance || {
      has_estimates: true,
      estimated_fields: ["logistics.weight_grams", "logistics.dimensions"],
      verified_fields: ["general.name", "general.sku", "general.category"],
      notes: {},
    },
  };
}

export interface ProductFilterOptions {
  categoria?: string | null;
  status?: string | null; // "pendente_tray" | "vinculado_tray"
  limit?: number;
  offset?: number;
  baseUrl: string;
}

/**
 * Busca produtos no Supabase com suporte a filtros e paginação.
 * Se o Supabase estiver indisponível, faz fallback automático para FEATURED_PRODUCTS.
 */
export async function getCanonicalProducts(options: ProductFilterOptions) {
  const { categoria, status, limit = 50, offset = 0, baseUrl } = options;

  if (supabase) {
    try {
      let query = supabase
        .from("produtos")
        .select("*, variants:variantes(*)", { count: "exact" });

      if (categoria) {
        query = query.ilike("category", `%${categoria}%`);
      }

      if (status === "pendente_tray") {
        query = query.is("tray_product_id", null);
      } else if (status === "vinculado_tray") {
        query = query.not("tray_product_id", "is", null);
      }

      query = query
        .order("sort_order", { ascending: true })
        .range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (!error && data) {
        // Estatísticas gerais
        const { count: totalCount } = await supabase
          .from("produtos")
          .select("id", { count: "exact", head: true });
        const { count: pendingCount } = await supabase
          .from("produtos")
          .select("id", { count: "exact", head: true })
          .is("tray_product_id", null);
        const { count: syncedCount } = await supabase
          .from("produtos")
          .select("id", { count: "exact", head: true })
          .not("tray_product_id", "is", null);

        const canonicalItems = data.map((item) => dbRecordToCanonical(item, baseUrl));

        return {
          source: "supabase",
          summary: {
            total_catalog_products: totalCount ?? count ?? 70,
            synced_tray_products: syncedCount ?? 40,
            pending_tray_products: pendingCount ?? 30,
            available_categories: CATEGORIES,
          },
          pagination: {
            total: count ?? data.length,
            limit,
            offset,
            has_more: offset + limit < (count ?? data.length),
          },
          products: canonicalItems,
        };
      }
    } catch (err) {
      console.warn("⚠️ Aviso: Falha ao consultar Supabase, usando fallback local:", err);
    }
  }

  // Fallback local se Supabase não responder
  let filtered = [...FEATURED_PRODUCTS];
  if (categoria) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === categoria.toLowerCase());
  }
  if (status === "pendente_tray") {
    filtered = filtered.filter((p) => p.tray_id == null);
  } else if (status === "vinculado_tray") {
    filtered = filtered.filter((p) => p.tray_id != null);
  }

  const totalFiltered = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  const canonicalItems = paginated.map((p) => toCanonicalProduct(p, baseUrl));

  return {
    source: "static_fallback",
    summary: {
      total_catalog_products: FEATURED_PRODUCTS.length,
      synced_tray_products: FEATURED_PRODUCTS.filter((p) => p.tray_id != null).length,
      pending_tray_products: FEATURED_PRODUCTS.filter((p) => p.tray_id == null).length,
      available_categories: CATEGORIES,
    },
    pagination: {
      total: totalFiltered,
      limit,
      offset,
      has_more: offset + limit < totalFiltered,
    },
    products: canonicalItems,
  };
}

/**
 * Busca um único produto pelo ID/slug, SKU ou tray_id no Supabase com fallback.
 */
export async function getCanonicalProductById(identifier: string, baseUrl: string) {
  const decoded = decodeURIComponent(identifier).trim().toLowerCase();

  if (supabase) {
    try {
      // Tentar buscar por id (slug), sku ou tray_product_id
      let query = supabase
        .from("produtos")
        .select("*, variants:variantes(*)");

      if (/^\d+$/.test(decoded)) {
        // Se for puramente numérico, pode ser tray_product_id
        query = query.or(`id.ilike.${decoded},sku.ilike.${decoded},tray_product_id.eq.${decoded}`);
      } else {
        query = query.or(`id.ilike.${decoded},sku.ilike.${decoded}`);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (!error && data) {
        return dbRecordToCanonical(data, baseUrl);
      }
    } catch (err) {
      console.warn("⚠️ Aviso: Falha ao consultar produto no Supabase, usando fallback local:", err);
    }
  }

  // Fallback local
  const local = FEATURED_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === decoded ||
      p.sku?.toLowerCase() === decoded ||
      String(p.tray_id) === decoded,
  );

  return local ? toCanonicalProduct(local, baseUrl) : null;
}

/**
 * Atualiza o vínculo com a Tray e/ou estoque no Supabase.
 */
export async function updateProductSyncData(
  idOrSku: string,
  updates: {
    tray_product_id?: number;
    stock?: number;
    sync_status?: string;
    variants?: Array<{ sku: string; tray_variant_id?: number; stock?: number }>;
  },
) {
  if (!supabaseAdmin) {
    throw new Error("Supabase não configurado com service_role para gravação.");
  }

  const { tray_product_id, stock, sync_status = "synced", variants } = updates;

  // 1. Atualizar produto pai
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
    last_sync_at: new Date().toISOString(),
  };

  if (tray_product_id !== undefined) updateData.tray_product_id = tray_product_id;
  if (stock !== undefined) updateData.stock = stock;
  if (sync_status) updateData.sync_status = sync_status;

  const { data: updatedProd, error: prodErr } = await supabaseAdmin
    .from("produtos")
    .update(updateData)
    .or(`id.ilike.${idOrSku},sku.ilike.${idOrSku}`)
    .select()
    .single();

  if (prodErr) throw prodErr;

  // 2. Atualizar variantes filhas se fornecidas
  if (variants && variants.length > 0) {
    for (const v of variants) {
      const vUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
      if (v.tray_variant_id !== undefined) vUpdate.tray_variant_id = v.tray_variant_id;
      if (v.stock !== undefined) vUpdate.stock = v.stock;

      await supabaseAdmin
        .from("variantes")
        .update(vUpdate)
        .eq("sku", v.sku);
    }
  }

  return updatedProd;
}
