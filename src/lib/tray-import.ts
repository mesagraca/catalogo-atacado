import ExcelJS from "exceljs";

const traySheetName = "CATÁLOGO - V2";
const thamiSheetName = "THAMI";

export type ImportIssue = {
  severity: "error" | "warning";
  code: string;
  sourceId?: number;
  message: string;
};

export type TrayProduct = {
  sourceId: number;
  name: string;
  sku: string;
  categoryLevel1: string | null;
  categoryLevel2: string | null;
  descriptionHtml: string | null;
  editorialImageUrl: string | null;
  studioImageUrl: string | null;
  galleryUrls: string[];
  costPrice: number | null;
  retailPrice: number | null;
  salePrice: number | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
  stock: number | null;
  minimumStock: number;
  weightGrams: number | null;
  heightCm: number | null;
  widthCm: number | null;
  lengthCm: number | null;
  material: string | null;
  collection: string | null;
  brand: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  slug: string | null;
  active: boolean;
  visible: boolean;
};

export type TrayImportResult = {
  products: TrayProduct[];
  issues: ImportIssue[];
  summary: {
    trayProducts: number;
    operationalProducts: number;
    catalogOnlyProducts: number;
    zeroStockProducts: number;
    provisionalStockProducts: number;
    zeroPriceProducts: number;
    missingCostProducts: number;
  };
};

type Row = Record<string, unknown>;

const clean = (value: unknown) => {
  const string = String(value ?? "").trim();
  return string || null;
};

const number = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const raw = clean(value);
  if (!raw) return null;
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const bool = (value: unknown) => /^(sim|true|1)$/i.test(clean(value) ?? "");

const date = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = clean(value);
  if (!raw) return null;
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : raw;
};

const rowsFromSheet = (sheet: ExcelJS.Worksheet): Row[] => {
  const headers = sheet.getRow(1).values as unknown[];
  const rows: Row[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const record: Row = {};
    (row.values as unknown[]).forEach((value, index) => {
      const header = clean(headers[index]);
      if (header) record[header] = value;
    });
    if (Object.values(record).some((value) => clean(value))) rows.push(record);
  });
  return rows;
};

const uniqueUrls = (...values: Array<string | null>) =>
  [...new Set(values.filter((value): value is string => Boolean(value)))];

export async function parseTrayWorkbook(buffer: Buffer): Promise<TrayImportResult> {
  const workbook = new ExcelJS.Workbook();
  // ExcelJS currently declares a narrower Node Buffer type than the one exposed
  // by the runtime bundled with Next. The bytes are unchanged.
  await workbook.xlsx.load(buffer as never);
  const tray = workbook.getWorksheet(traySheetName);
  const operational = workbook.getWorksheet(thamiSheetName);

  if (!tray) throw new Error(`A aba obrigatória “${traySheetName}” não foi encontrada.`);

  const issues: ImportIssue[] = [];
  const sourceIds = new Set<number>();
  const skus = new Set<string>();
  const products = rowsFromSheet(tray)
    .map((row) => {
      const sourceId = number(row["Cód / ID"]);
      const name = clean(row["Nome produto"]);
      const sku = clean(row["Referência (SKU)"]);
      if (!sourceId || !name || !sku) {
        issues.push({
          severity: "error",
          code: "required_fields",
          sourceId: sourceId ?? undefined,
          message: "Produto sem ID, nome ou SKU.",
        });
        return null;
      }
      if (sourceIds.has(sourceId)) {
        issues.push({ severity: "error", code: "duplicate_id", sourceId, message: "ID repetido na Tray." });
      }
      if (skus.has(sku)) {
        issues.push({ severity: "error", code: "duplicate_sku", sourceId, message: `SKU repetido: ${sku}.` });
      }
      sourceIds.add(sourceId);
      skus.add(sku);
      const stock = number(row["Estoque atual"]);
      const retailPrice = number(row["Preço de venda (R$)"]);
      const costPrice = number(row["Preço de custo (R$)"]);
      if (retailPrice === 0 || retailPrice == null) {
        issues.push({ severity: "warning", code: "missing_retail_price", sourceId, message: "Preço de varejo não informado." });
      }
      if (costPrice === 0 || costPrice == null) {
        issues.push({ severity: "warning", code: "missing_cost", sourceId, message: "Custo não informado." });
      }
      if (stock === 50) {
        issues.push({ severity: "warning", code: "provisional_stock", sourceId, message: "Estoque 50 precisa ser confirmado antes da carga." });
      }
      return {
        sourceId,
        name,
        sku,
        categoryLevel1: clean(row["Categoria - Nivel 1"]),
        categoryLevel2: clean(row["Categoria - Nivel 2"]),
        descriptionHtml: clean(row["Descrição grande com HTML simples"]),
        editorialImageUrl: clean(row["Url Imagem principal (Foto editorial)"]),
        studioImageUrl: clean(row["Url Imagem 2 (Foto estúdio)"]),
        galleryUrls: uniqueUrls(clean(row["Url Imagem 3"]), clean(row["Url Imagem 4"])),
        costPrice,
        retailPrice,
        salePrice: number(row["Preço promoção (R$)"]),
        saleStartsAt: date(row["Inicio promoção (dd/mm/yyyy)"]),
        saleEndsAt: date(row["Fim promoção (dd/mm/yyyy)"]),
        stock,
        minimumStock: number(row["Estoque mínimo"]) ?? 0,
        weightGrams: number(row["Peso (gramas)"]),
        heightCm: number(row["Altura (cm)"]),
        widthCm: number(row["Largura (cm)"]),
        lengthCm: number(row["Comprimento (cm)"]),
        material: clean(row["Característica: Material"]),
        collection: clean(row["Característica: Coleção"]),
        brand: clean(row.Marca),
        seoTitle: clean(row["SEO Título"]),
        seoDescription: clean(row["SEO descrição simplificada (160 caracteres)"]),
        seoKeywords: clean(row["SEO palavra chave (Máx 5 e separados por vírgula)"]),
        slug: clean(row["SEO - Endereço do produto (URL)"]),
        active: bool(row.Disponível),
        visible: bool(row["Exibir na loja"]),
      } satisfies TrayProduct;
    })
    .filter((product): product is TrayProduct => Boolean(product));

  const operationalRows = operational ? rowsFromSheet(operational) : [];
  const operationalIds = new Set(
    operationalRows
      .map((row) => number(row["Cód / ID"]))
      .filter((value): value is number => value != null),
  );
  const catalogOnlyProducts = products.filter((product) => !operationalIds.has(product.sourceId));
  for (const product of catalogOnlyProducts) {
    issues.push({
      severity: "warning",
      code: "missing_operational_row",
      sourceId: product.sourceId,
      message: "Produto existe na Tray, mas não está na aba THAMI.",
    });
  }

  return {
    products,
    issues,
    summary: {
      trayProducts: products.length,
      operationalProducts: operationalRows.filter((row) => number(row["Cód / ID"]) != null).length,
      catalogOnlyProducts: catalogOnlyProducts.length,
      zeroStockProducts: products.filter((product) => product.stock === 0).length,
      provisionalStockProducts: products.filter((product) => product.stock === 50).length,
      zeroPriceProducts: products.filter((product) => !product.retailPrice).length,
      missingCostProducts: products.filter((product) => !product.costPrice).length,
    },
  };
}
