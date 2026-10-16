import { NextResponse } from "next/server";
import { getCanonicalProductById } from "@/lib/catalog-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const product = await getCanonicalProductById(id, baseUrl);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", requested_identifier: id },
      { status: 404 },
    );
  }

  return NextResponse.json(product, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
