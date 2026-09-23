import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";

const number = (value: number | null | undefined) => value ?? "";

export async function GET() {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  try {
    const admin = getRetailAdmin();
    const { data: products, error: productsError } = await admin
      .from("catalog_products")
      .select("id,name,category_level_1,lifecycle_status,retail_visible")
      .order("name");
    if (productsError) throw productsError;
    const productIds = (products ?? []).map((product) => product.id);
    if (!productIds.length) throw new Error("Não há produtos para exportar.");
    const { data: skus, error: skusError } = await admin
      .from("catalog_skus")
      .select("id,product_id,sku,kind,stock_policy,cost_price,minimum_stock")
      .in("product_id", productIds)
      .order("sku");
    if (skusError) throw skusError;
    const skuIds = (skus ?? []).map((sku) => sku.id);
    const [{ data: stock, error: stockError }, { data: prices, error: pricesError }] = await Promise.all([
      admin.from("catalog_stock_availability").select("sku_id,available_quantity").in("sku_id", skuIds),
      admin.from("catalog_prices").select("sku_id,channel,list_price,sale_price").in("sku_id", skuIds),
    ]);
    if (stockError) throw stockError;
    if (pricesError) throw pricesError;

    const productById = new Map((products ?? []).map((product) => [product.id, product]));
    const stockBySku = new Map((stock ?? []).map((item) => [item.sku_id, item.available_quantity]));
    const pricesBySku = new Map<string, Map<string, { list_price: number | null; sale_price: number | null }>>();
    for (const item of prices ?? []) {
      const channels = pricesBySku.get(item.sku_id) ?? new Map();
      channels.set(item.channel, item);
      pricesBySku.set(item.sku_id, channels);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("ESTOQUE VAREJO");
    sheet.addRow(["SKU", "Produto", "Categoria", "Tipo", "Política de estoque", "Saldo disponível", "Estoque mínimo", "Situação", "Custo", "Preço varejo", "Preço promocional", "Preço atacado", "Preço marketplace", "Ativo", "Exibir varejo"]);
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    for (const sku of skus ?? []) {
      const product = productById.get(sku.product_id);
      const available = Number(stockBySku.get(sku.id) ?? 0);
      const retail = pricesBySku.get(sku.id)?.get("retail");
      const wholesale = pricesBySku.get(sku.id)?.get("wholesale");
      const marketplace = pricesBySku.get(sku.id)?.get("marketplace");
      const status = available <= 0 ? "Sem estoque" : sku.minimum_stock > 0 && available <= sku.minimum_stock ? "Estoque baixo" : "Disponível";
      sheet.addRow([
        sku.sku, product?.name ?? "", product?.category_level_1 ?? "", sku.kind === "kit" ? "Kit" : "Avulso", sku.stock_policy === "component" ? "Calculado por componentes" : "Próprio", available,
        sku.minimum_stock, status, number(sku.cost_price), number(retail?.list_price), number(retail?.sale_price), number(wholesale?.list_price), number(marketplace?.list_price),
        product?.lifecycle_status === "active" ? "Sim" : "Não", product?.retail_visible ? "Sim" : "Não",
      ]);
    }
    sheet.columns.forEach((column, index) => { column.width = index === 1 ? 38 : 19; });
    const bytes = await workbook.xlsx.writeBuffer();
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="estoque-varejo-mesa-e-graca.xlsx"',
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Falha ao exportar o estoque." }, { status: 422 });
  }
}
