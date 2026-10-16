import { NextResponse } from "next/server";
import { FEATURED_PRODUCTS, CATEGORIES, type Category } from "@/types/catalog";
import { toCanonicalProduct } from "@/lib/catalog-canonical";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const categoria = url.searchParams.get("categoria");
  const status = url.searchParams.get("status"); // "pendente_tray" | "vinculado_tray"
  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");
  const format = url.searchParams.get("format"); // "tray" | "full"

  let filtered = [...FEATURED_PRODUCTS];

  // 1. Filtro por Categoria
  if (categoria) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === categoria.toLowerCase(),
    );
  }

  // 2. Filtro por Status Tray
  if (status === "pendente_tray") {
    filtered = filtered.filter((p) => p.tray_id == null);
  } else if (status === "vinculado_tray") {
    filtered = filtered.filter((p) => p.tray_id != null);
  }

  const totalFiltered = filtered.length;

  // 3. Paginação
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 100) : 50;
  const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;
  const paginated = filtered.slice(offset, offset + limit);

  // 4. Mapeamento Canônico
  const canonicalItems = paginated.map((p) => toCanonicalProduct(p, baseUrl));

  const totalProducts = FEATURED_PRODUCTS.length;
  const pendingCount = FEATURED_PRODUCTS.filter((p) => p.tray_id == null).length;
  const syncedCount = FEATURED_PRODUCTS.filter((p) => p.tray_id != null).length;

  return NextResponse.json(
    {
      summary: {
        total_catalog_products: totalProducts,
        synced_tray_products: syncedCount,
        pending_tray_products: pendingCount,
        available_categories: CATEGORIES,
      },
      pagination: {
        total: totalFiltered,
        limit,
        offset,
        has_more: offset + limit < totalFiltered,
      },
      filters_applied: {
        category: categoria ?? null,
        status: status ?? null,
        format: format ?? "canonical",
      },
      products: canonicalItems,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    },
  );
}
