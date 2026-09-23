import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailAdmin } from "@/lib/retail-server";

export const runtime = "nodejs";

const headers = [
  "Cód / ID", "Foto estúdio", "Foto editorial", "Cat. Principal (ID)", "Categoria - Nivel 1", "Categoria - Nivel 2", "Nome produto", "Referência (SKU)", "Descrição grande com HTML simples", "Url Imagem principal (Foto editorial)", "Url Imagem 2 (Foto estúdio)", "Url Imagem 3", "Url Imagem 4", "Preço de custo (R$)", "Preço de venda (R$)", "Preço promoção (R$)", "Inicio promoção (dd/mm/yyyy)", "Fim promoção (dd/mm/yyyy)", "Estoque atual", "Estoque mínimo", "Quando acabar o estoque", "Peso (gramas)", "Altura (cm)", "Largura (cm)", "Comprimento (cm)", "Selo destaque", "Selo lançamento", "Selo pré-venda", "Garantia", "Disponibilidade", "Característica: Material", "Característica: Coleção", "Marca", "SEO Título", "SEO descrição simplificada (160 caracteres)", "SEO palavra chave (Máx 5 e separados por vírgula)", "SEO - Endereço do produto (URL)", "Valor do IPI", "NCM", "Endereço do Produto (URL Tray)", "Produto relacionado 1 (ID)", "Produto relacionado 2 (ID)", "Produto relacionado 3 (ID)", "Produto relacionado 4 (ID)", "Link Concorrente", "Disponível", "Exibir na loja",
];

const asNumber = (value: number | null | undefined) => value ?? "";
const asDate = (value: string | null | undefined) =>
  value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)) : "";

export async function GET() {
  if (!(await hasRetailAccess())) {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  }

  try {
    const admin = getRetailAdmin();
    const { data: products, error: productsError } = await admin
      .from("catalog_products")
      .select("*")
      .eq("retail_visible", true)
      .eq("lifecycle_status", "active")
      .order("source_product_id");
    if (productsError) throw productsError;
    const productIds = (products ?? []).map((product) => product.id);
    const { data: skus, error: skusError } = await admin
      .from("catalog_skus")
      .select("*")
      .in("product_id", productIds);
    if (skusError) throw skusError;
    const skuIds = (skus ?? []).map((sku) => sku.id);
    const [{ data: prices, error: pricesError }, { data: stock, error: stockError }, { data: media, error: mediaError }] = await Promise.all([
      admin.from("catalog_prices").select("*").eq("channel", "retail").in("sku_id", skuIds),
      admin.from("catalog_stock_availability").select("*").in("sku_id", skuIds),
      admin.from("catalog_media").select("*").eq("is_active", true).in("product_id", productIds),
    ]);
    if (pricesError) throw pricesError;
    if (stockError) throw stockError;
    if (mediaError) throw mediaError;

    const priceBySku = new Map((prices ?? []).map((price) => [price.sku_id, price]));
    const stockBySku = new Map((stock ?? []).map((item) => [item.sku_id, item.available_quantity]));
    const mediaByProduct = new Map<string, Array<Record<string, unknown>>>();
    for (const item of media ?? []) {
      const list = mediaByProduct.get(item.product_id) ?? [];
      list.push(item);
      mediaByProduct.set(item.product_id, list);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("CATÁLOGO - V2");
    sheet.addRow(headers);
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    let skipped = 0;
    for (const sku of skus ?? []) {
      const product = (products ?? []).find((item) => item.id === sku.product_id);
      const price = priceBySku.get(sku.id);
      const assets = (mediaByProduct.get(sku.product_id) ?? [])
        .filter((asset) => !asset.sku_id || asset.sku_id === sku.id)
        .sort((a, b) => Number(a.position) - Number(b.position));
      const editorial = assets.find((asset) => asset.role === "editorial")?.url as string | undefined;
      const studio = assets.find((asset) => asset.role === "studio")?.url as string | undefined;
      const gallery = assets.filter((asset) => asset.role === "gallery").map((asset) => asset.url as string);
      if (!product || !price?.list_price || !editorial || !studio) {
        skipped += 1;
        continue;
      }
      const attributes = (sku.attributes ?? {}) as { material?: string };
      sheet.addRow([
        product.source_product_id, "", "", "", product.category_level_1, product.category_level_2, product.name, sku.sku,
        product.description_html, editorial, studio, gallery[0] ?? "", gallery[1] ?? "", asNumber(sku.cost_price), asNumber(price.list_price), asNumber(price.sale_price),
        asDate(price.sale_starts_at), asDate(price.sale_ends_at), stockBySku.get(sku.id) ?? 0, sku.minimum_stock, "Inativar o produto", asNumber(sku.weight_grams), asNumber(sku.height_cm), asNumber(sku.width_cm), asNumber(sku.length_cm),
        "Não", "Não", product.lifecycle_status === "preorder" ? "Sim" : "Não", "7 dias após o recebimento do produto", "Imediata", attributes.material ?? "", product.collection, product.brand,
        product.seo_title, product.seo_description, product.seo_keywords, product.slug, "", "", "", "", "", "", "", "", "", "Sim", "Sim",
      ]);
    }
    sheet.columns.forEach((column, index) => { column.width = index === 8 ? 48 : 20; });
    const bytes = await workbook.xlsx.writeBuffer();
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="catalogo-tray-mesa-e-graca.xlsx"',
        "X-Exported-Products": String((skus ?? []).length - skipped),
        "X-Skipped-Products": String(skipped),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao gerar o XLS da Tray.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
