import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCanonicalProductById, updateProductSyncData } from "@/lib/catalog-db";

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

/**
 * Atualiza o vínculo com a Tray ou estoque no catálogo.
 * Endpoint consumido pelo integrador ao receber resposta da Tray API.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { tray_product_id, stock, variants, sync_status } = body;

    const updated = await updateProductSyncData(id, {
      tray_product_id,
      stock,
      sync_status,
      variants,
    });

    // Invalidação de cache on-demand na Vercel Edge
    revalidatePath("/api/produtos");
    revalidatePath(`/api/produtos/${id}`);
    revalidatePath("/catalogo");

    return NextResponse.json({
      success: true,
      message: "Produto atualizado com sucesso no banco de dados.",
      product_id: updated.id,
      tray_product_id: updated.tray_product_id,
      stock: updated.stock,
      last_sync_at: updated.last_sync_at,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Erro ao atualizar produto." },
      { status: 500 },
    );
  }
}
