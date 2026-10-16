import { NextResponse } from "next/server";
import { FEATURED_PRODUCTS } from "@/types/catalog";
import { toCanonicalProduct } from "@/lib/catalog-canonical";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const product = FEATURED_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === decodedId ||
      p.sku?.toLowerCase() === decodedId ||
      String(p.tray_id) === decodedId,
  );

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", requested_identifier: id },
      { status: 404 },
    );
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const canonical = toCanonicalProduct(product, baseUrl);

  return NextResponse.json(canonical, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
