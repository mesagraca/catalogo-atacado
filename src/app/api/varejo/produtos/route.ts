import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const price = (value: unknown) => value === null || value === "" ? null : Number(value);

export async function PATCH(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const skuId = text(body.skuId);
  const productId = text(body.productId);
  const name = text(body.name);
  const category = text(body.category);
  const retailPrice = price(body.retailPrice);
  if (!skuId || !productId || !name || !Number.isFinite(retailPrice ?? 0) || (retailPrice != null && retailPrice < 0)) {
    return NextResponse.json({ message: "Nome, produto e SKU são obrigatórios. O preço pode ficar em branco para Sob consulta." }, { status: 400 });
  }
  const admin = getRetailAdmin();
  const { data: sku, error: skuError } = await admin
    .from("catalog_skus")
    .select("product_id")
    .eq("id", skuId)
    .single();
  if (skuError || sku.product_id !== productId) {
    return NextResponse.json({ message: "O SKU informado não pertence a este produto." }, { status: 400 });
  }
  const { error: productError } = await admin.from("catalog_products").update({
    name,
    category_level_1: category || null,
    retail_visible: Boolean(body.visible),
    lifecycle_status: body.active === false ? "inactive" : "active",
  }).eq("id", productId);
  if (productError) return NextResponse.json({ message: productError.message }, { status: 422 });
  const { error: priceError } = await admin.from("catalog_prices").upsert({ sku_id: skuId, channel: "retail", list_price: retailPrice }, { onConflict: "sku_id,channel" });
  if (priceError) return NextResponse.json({ message: priceError.message }, { status: 422 });
  return NextResponse.json({ ok: true });
}
