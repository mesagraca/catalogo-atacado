import { NextResponse } from "next/server";
import { getCanonicalProducts } from "@/lib/catalog-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const categoria = url.searchParams.get("categoria");
  const status = url.searchParams.get("status"); // "pendente_tray" | "vinculado_tray"
  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");
  const format = url.searchParams.get("format"); // "tray" | "full"

  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 100) : 50;
  const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

  const result = await getCanonicalProducts({
    categoria,
    status,
    limit,
    offset,
    baseUrl,
  });

  return NextResponse.json(
    {
      source: result.source,
      summary: result.summary,
      pagination: result.pagination,
      filters_applied: {
        category: categoria ?? null,
        status: status ?? null,
        format: format ?? "canonical",
      },
      products: result.products,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
