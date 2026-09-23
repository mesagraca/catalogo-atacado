import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const price = (value: unknown) => value === null || value === "" ? null : Number(value);
const date = (value: unknown) => {
  const raw = text(value);
  return raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
};
const validPrice = (value: number | null) => value == null || (Number.isFinite(value) && value >= 0);

export async function PATCH(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const skuId = text(body.skuId);
  const productId = text(body.productId);
  const name = text(body.name);
  const category = text(body.category);
  const retailPrice = price(body.retailPrice);
  const wholesalePrice = price(body.wholesalePrice);
  const marketplacePrice = price(body.marketplacePrice);
  const promotionPrice = price(body.promotionPrice);
  const promotionStartsAt = date(body.promotionStartsAt);
  const promotionEndsAt = date(body.promotionEndsAt);
  if (!skuId || !productId || !name || !validPrice(retailPrice) || !validPrice(wholesalePrice) || !validPrice(marketplacePrice) || !validPrice(promotionPrice)) {
    return NextResponse.json({ message: "Nome, produto e SKU são obrigatórios. O preço pode ficar em branco para Sob consulta." }, { status: 400 });
  }
  if (promotionPrice != null && (retailPrice == null || promotionPrice > retailPrice)) {
    return NextResponse.json({ message: "O preço promocional deve ser menor ou igual ao preço de varejo." }, { status: 400 });
  }
  if ((promotionStartsAt && !promotionEndsAt) || (!promotionStartsAt && promotionEndsAt) || (promotionStartsAt && promotionEndsAt && promotionStartsAt > promotionEndsAt)) {
    return NextResponse.json({ message: "Informe início e fim válidos para a promoção." }, { status: 400 });
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
  const { error: priceError } = await admin.from("catalog_prices").upsert([
    { sku_id: skuId, channel: "retail", list_price: retailPrice, sale_price: promotionPrice, sale_starts_at: promotionStartsAt, sale_ends_at: promotionEndsAt },
    { sku_id: skuId, channel: "wholesale", list_price: wholesalePrice, sale_price: null, sale_starts_at: null, sale_ends_at: null },
    { sku_id: skuId, channel: "marketplace", list_price: marketplacePrice, sale_price: null, sale_starts_at: null, sale_ends_at: null },
  ], { onConflict: "sku_id,channel" });
  if (priceError) return NextResponse.json({ message: priceError.message }, { status: 422 });
  return NextResponse.json({ ok: true });
}
