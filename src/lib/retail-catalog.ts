import { getRetailAdmin } from "./retail-server";

export type RetailCatalogCard = {
  id: string;
  productId: string;
  name: string;
  category: string | null;
  sku: string;
  price: number | null;
  stock: number;
  imageUrl: string | null;
  visible: boolean;
  active: boolean;
};

export async function getRetailCatalogCards(): Promise<{
  products: RetailCatalogCard[];
  configured: boolean;
}> {
  try {
    const admin = getRetailAdmin();
    const { data: products, error: productsError } = await admin
      .from("catalog_products")
      .select("id,name,category_level_1,retail_visible,lifecycle_status")
      .eq("retail_visible", true)
      .eq("lifecycle_status", "active")
      .order("name");
    if (productsError) throw productsError;
    const productIds = (products ?? []).map((product) => product.id);
    if (!productIds.length) return { products: [], configured: true };
    const [{ data: skus, error: skusError }, { data: media, error: mediaError }] = await Promise.all([
      admin.from("catalog_skus").select("id,product_id,sku").in("product_id", productIds),
      admin.from("catalog_media").select("product_id,sku_id,url,role,position").eq("is_active", true).in("product_id", productIds),
    ]);
    if (skusError) throw skusError;
    if (mediaError) throw mediaError;
    const skuIds = (skus ?? []).map((sku) => sku.id);
    const [{ data: prices, error: pricesError }, { data: stock, error: stockError }] = await Promise.all([
      admin.from("catalog_prices").select("sku_id,list_price,sale_price").eq("channel", "retail").in("sku_id", skuIds),
      admin.from("catalog_stock_availability").select("sku_id,available_quantity").in("sku_id", skuIds),
    ]);
    if (pricesError) throw pricesError;
    if (stockError) throw stockError;
    const priceBySku = new Map((prices ?? []).map((price) => [price.sku_id, price]));
    const stockBySku = new Map((stock ?? []).map((item) => [item.sku_id, item.available_quantity]));

    return {
      configured: true,
      products: (products ?? []).flatMap((product) => {
        const productSkus = (skus ?? []).filter((sku) => sku.product_id === product.id);
        return productSkus.map((sku) => {
          const image = (media ?? [])
            .filter((asset) => asset.product_id === product.id && (!asset.sku_id || asset.sku_id === sku.id))
            .sort((a, b) => Number(a.position) - Number(b.position))
            .find((asset) => asset.role === "editorial" || asset.role === "studio");
          const price = priceBySku.get(sku.id);
          return {
            id: sku.id,
            productId: product.id,
            name: product.name,
            category: product.category_level_1,
            sku: sku.sku,
            price: price?.sale_price ?? price?.list_price ?? null,
            stock: stockBySku.get(sku.id) ?? 0,
            imageUrl: image?.url ?? null,
            visible: product.retail_visible,
            active: product.lifecycle_status === "active",
          };
        });
      }),
    };
  } catch {
    return { products: [], configured: false };
  }
}
