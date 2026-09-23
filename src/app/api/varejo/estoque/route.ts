import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";
const types = new Set(["receipt", "sale", "adjustment", "return"]);

export async function GET(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const skuId = request.nextUrl.searchParams.get("skuId");
  if (!skuId) return NextResponse.json({ message: "Informe o SKU." }, { status: 400 });
  const admin = getRetailAdmin();
  const { data, error } = await admin
    .from("inventory_movements")
    .select("id,quantity,type,note,reference,occurred_at")
    .eq("sku_id", skuId)
    .order("occurred_at", { ascending: false })
    .limit(12);
  if (error) return NextResponse.json({ message: error.message }, { status: 422 });
  return NextResponse.json({ movements: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json() as { skuId?: string; quantity?: number; type?: string; note?: string };
  const quantity = Number(body.quantity);
  if (!body.skuId || !Number.isInteger(quantity) || quantity === 0 || !body.type || !types.has(body.type)) {
    return NextResponse.json({ message: "Informe um movimento inteiro, diferente de zero, e seu tipo." }, { status: 400 });
  }
  const admin = getRetailAdmin();
  const { data: sku, error: skuError } = await admin.from("catalog_skus").select("stock_policy").eq("id", body.skuId).single();
  if (skuError) return NextResponse.json({ message: skuError.message }, { status: 422 });
  if (sku.stock_policy === "component") return NextResponse.json({ message: "Kit composto calcula o saldo pelos componentes e não aceita ajuste direto." }, { status: 409 });
  const normalizedQuantity = body.type === "sale"
    ? -Math.abs(quantity)
    : body.type === "receipt" || body.type === "return"
      ? Math.abs(quantity)
      : quantity;
  const { error } = await admin.from("inventory_movements").insert({ sku_id: body.skuId, quantity: normalizedQuantity, type: body.type, note: body.note?.trim() || null, reference: "Painel varejo" });
  if (error) return NextResponse.json({ message: error.message }, { status: 422 });
  return NextResponse.json({ ok: true });
}
