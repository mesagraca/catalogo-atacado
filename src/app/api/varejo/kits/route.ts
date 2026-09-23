import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";

type ComponentInput = { skuId?: unknown; quantity?: unknown };

export async function PUT(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json() as { kitSkuId?: unknown; components?: ComponentInput[] };
  const kitSkuId = typeof body.kitSkuId === "string" ? body.kitSkuId : "";
  const components = Array.isArray(body.components)
    ? body.components.map((component) => ({
      skuId: typeof component.skuId === "string" ? component.skuId : "",
      quantity: Number(component.quantity),
    }))
    : [];
  if (!kitSkuId || !components.length || components.some((component) => !component.skuId || !Number.isInteger(component.quantity) || component.quantity < 1)) {
    return NextResponse.json({ message: "Inclua ao menos um item, com quantidade inteira maior que zero." }, { status: 400 });
  }
  if (new Set(components.map((component) => component.skuId)).size !== components.length) {
    return NextResponse.json({ message: "Um item só pode aparecer uma vez na composição do kit." }, { status: 400 });
  }

  const admin = getRetailAdmin();
  const [{ data: kit, error: kitError }, { data: componentSkus, error: componentError }] = await Promise.all([
    admin.from("catalog_skus").select("id,kind,stock_policy").eq("id", kitSkuId).single(),
    admin.from("catalog_skus").select("id,kind,stock_policy").in("id", components.map((component) => component.skuId)),
  ]);
  if (kitError || !kit || kit.kind !== "kit" || kit.stock_policy !== "component") {
    return NextResponse.json({ message: "Este SKU não é um kit composto." }, { status: 400 });
  }
  if (componentError || (componentSkus ?? []).length !== components.length || (componentSkus ?? []).some((item) => item.kind !== "single" || item.stock_policy !== "independent")) {
    return NextResponse.json({ message: "A composição aceita somente SKUs avulsos com estoque próprio." }, { status: 400 });
  }

  const { data: previous, error: previousError } = await admin
    .from("kit_components")
    .select("kit_sku_id,component_sku_id,quantity")
    .eq("kit_sku_id", kitSkuId);
  if (previousError) return NextResponse.json({ message: previousError.message }, { status: 422 });

  const { error: deleteError } = await admin.from("kit_components").delete().eq("kit_sku_id", kitSkuId);
  if (deleteError) return NextResponse.json({ message: deleteError.message }, { status: 422 });
  const { error: insertError } = await admin.from("kit_components").insert(
    components.map((component) => ({ kit_sku_id: kitSkuId, component_sku_id: component.skuId, quantity: component.quantity })),
  );
  if (insertError) {
    if (previous?.length) await admin.from("kit_components").insert(previous);
    return NextResponse.json({ message: "A composição não foi salva; a versão anterior foi restaurada." }, { status: 422 });
  }
  return NextResponse.json({ ok: true });
}
