import type { TrayImportResult } from "./tray-import";
import { getRetailAdmin } from "./retail-server";

export async function applyRetailImport(
  result: TrayImportResult,
  sourceFilename: string,
) {
  const blockingIssues = result.issues.filter((issue) => issue.severity === "error");
  if (blockingIssues.length) {
    throw new Error("A importação tem erros críticos. Corrija-os antes de aplicar.");
  }

  const admin = getRetailAdmin();
  const usedSlugs = new Set<string>();
  const productRows = result.products.map((product) => {
    const slug = product.slug && usedSlugs.has(product.slug)
      ? `${product.slug}-${product.sourceId}`
      : product.slug;
    if (slug) usedSlugs.add(slug);
    return {
    source_product_id: product.sourceId,
    name: product.name,
    slug,
    category_level_1: product.categoryLevel1,
    category_level_2: product.categoryLevel2,
    collection: product.collection,
    brand: product.brand,
    description_html: product.descriptionHtml,
    seo_title: product.seoTitle,
    seo_description: product.seoDescription,
    seo_keywords: product.seoKeywords,
    lifecycle_status: product.active ? "active" : "inactive",
    retail_visible: product.visible,
    wholesale_visible: false,
    };
  });
  const { data: storedProducts, error: productsError } = await admin
    .from("catalog_products")
    .upsert(productRows, { onConflict: "source_product_id" })
    .select("id,source_product_id");
  if (productsError) throw productsError;

  const productIds = new Map(
    (storedProducts ?? []).map((product) => [product.source_product_id, product.id]),
  );
  const skuRows = result.products.map((product) => ({
    product_id: productIds.get(product.sourceId),
    sku: product.sku,
    kind: product.categoryLevel1 === "Kits e Coleções" ? "kit" : "single",
    stock_policy: product.categoryLevel1 === "Kits e Coleções" ? "component" : "independent",
    attributes: {
      material: product.material,
      legacy_media: {
        editorial: product.editorialImageUrl,
        studio: product.studioImageUrl,
        gallery: product.galleryUrls,
      },
    },
    cost_price: product.costPrice,
    weight_grams: product.weightGrams,
    height_cm: product.heightCm,
    width_cm: product.widthCm,
    length_cm: product.lengthCm,
    minimum_stock: product.minimumStock,
  }));
  if (skuRows.some((sku) => !sku.product_id)) {
    throw new Error("Não foi possível relacionar todos os SKUs aos produtos importados.");
  }
  const { data: storedSkus, error: skusError } = await admin
    .from("catalog_skus")
    .upsert(skuRows, { onConflict: "sku" })
    .select("id,sku");
  if (skusError) throw skusError;

  const skuIds = new Map((storedSkus ?? []).map((sku) => [sku.sku, sku.id]));
  const prices = result.products.flatMap((product) => {
    const skuId = skuIds.get(product.sku);
    return skuId
      ? [
          {
            sku_id: skuId,
            channel: "retail",
            list_price: product.retailPrice,
            sale_price: product.salePrice,
            sale_starts_at: product.saleStartsAt,
            sale_ends_at: product.saleEndsAt,
          },
        ]
      : [];
  });
  const { error: pricesError } = await admin
    .from("catalog_prices")
    .upsert(prices, { onConflict: "sku_id,channel" });
  if (pricesError) throw pricesError;

  const nonKitSkuIds = result.products
    .filter((product) => product.categoryLevel1 !== "Kits e Coleções" && product.stock != null)
    .map((product) => skuIds.get(product.sku))
    .filter((id): id is string => Boolean(id));
  const { data: existingMovements, error: movementsError } = await admin
    .from("inventory_movements")
    .select("sku_id")
    .in("sku_id", nonKitSkuIds);
  if (movementsError) throw movementsError;
  const existingSkuIds = new Set((existingMovements ?? []).map((movement) => movement.sku_id));
  const openingBalances = result.products
    .filter(
      (product) =>
        product.categoryLevel1 !== "Kits e Coleções" &&
        product.stock != null &&
        product.stock !== 0 &&
        product.stock !== 50 &&
        !existingSkuIds.has(skuIds.get(product.sku)),
    )
    .map((product) => ({
      sku_id: skuIds.get(product.sku),
      quantity: product.stock,
      type: "opening_balance",
      reference: `Importação inicial: ${sourceFilename}`,
    }));
  if (openingBalances.length) {
    const { error: openingError } = await admin
      .from("inventory_movements")
      .insert(openingBalances);
    if (openingError) throw openingError;
  }

  const { error: runError } = await admin.from("catalog_import_runs").insert({
    source_name: sourceFilename.toLowerCase().endsWith(".csv") ? "Tray CSV" : "Tray XLSX",
    source_filename: sourceFilename,
    mode: "apply",
    totals: result.summary,
    issues: result.issues,
  });
  if (runError) throw runError;

  return {
    importedProducts: productRows.length,
    openingBalances: openingBalances.length,
    pendingStockConfirmation: result.products.filter((product) => product.stock === 50).length,
  };
}
