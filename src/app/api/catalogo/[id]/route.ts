import { NextResponse } from "next/server";
import { FEATURED_PRODUCTS } from "@/types/catalog";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", id },
      { status: 404 },
    );
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const absoluteImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${baseUrl}${path}`;
  };

  const payload = {
    id: product.id,
    sku: product.sku,
    tray_id: product.tray_id,
    name: product.name,
    category: product.category,
    collection: product.collection,
    prices: {
      retail: product.retail_price,
      wholesale: product.wholesale_price,
    },
    kit_quantity: product.kit_quantity ?? null,
    images: {
      primary: absoluteImageUrl(product.image_url),
      editorial: absoluteImageUrl(product.editorial_image_url),
    },
    game_items: product.game_items ?? null,
    variations: product.variations ?? null,
    description: product.description ?? null,
    materials: product.materials ?? [],
    dimensions: product.dimensions ?? [],
    color: {
      name: product.color_name,
      hex: product.color_hex,
    },
    metadata: {
      catalog_url: `${baseUrl}/catalogo/${product.id}`,
      api_url: `${baseUrl}/api/catalogo/${product.id}`,
      is_visible: product.is_visible,
      sort_order: product.sort_order,
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
