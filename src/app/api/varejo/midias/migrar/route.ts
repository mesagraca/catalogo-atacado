import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { processCatalogImage } from "@/lib/retail-image";
import { getRetailAdmin, getRetailAssetUrl } from "@/lib/retail-server";

export const runtime = "nodejs";

type LocalImage = { absolutePath: string; relativePath: string; filename: string };
type CatalogSku = { id: string; product_id: string; sku: string | null };
type CatalogProduct = { id: string; name: string };
type Candidate = LocalImage & { productId: string; productName: string; skuId: string; sku: string | null; role: "editorial" | "studio"; position: 0 };
type ManualRequest = { sourcePath?: unknown; skuId?: unknown; slot?: unknown };

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const safeName = (value: string) => value.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");
const mimeType = (filename: string) => ({ ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" })[path.extname(filename).toLowerCase()] ?? "application/octet-stream";

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageKey(filename: string) {
  return slug(path.basename(filename, path.extname(filename)))
    .replace(/^(editorial|estudio|studio|foto|imagem)-/, "")
    .replace(/-(0?1|0?2)$/, "");
}

function comparableProductName(name: string) {
  const ignoredWords = new Set(["kit", "jogo", "lugar", "americano", "porta", "guardanapo", "com", "de", "em", "para", "mesa", "posta", "colecao", "redondo", "convencional", "tecido", "individual"]);
  return slug(name)
    .split("-")
    .filter((word) => !ignoredWords.has(word))
    .join("-");
}

function imageRole(filename: string): Candidate["role"] {
  return /(?:-|_)(?:0?2)\.[^.]+$/i.test(filename) || /(?:estudio|studio)/i.test(filename) ? "studio" : "editorial";
}

async function findLocalImages(directory: string, root = directory): Promise<LocalImage[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const images: LocalImage[] = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) images.push(...await findLocalImages(absolutePath, root));
    else if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      images.push({ absolutePath, relativePath: path.relative(root, absolutePath).replaceAll("\\", "/"), filename: entry.name });
    }
  }
  return images;
}

async function storeLocalImage({ image, productId, skuId, productName, role }: { image: LocalImage; productId: string; skuId: string; productName: string; role: "editorial" | "studio" }) {
  const admin = getRetailAdmin();
  const original = await readFile(image.absolutePath);
  const processed = await processCatalogImage(original);
  const version = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const extension = path.extname(image.filename).slice(1).toLowerCase();
  const folder = `${productId}/${skuId}/${role}`;
  const originalPath = `${folder}/originais/${version}.${safeName(extension)}`;
  const assetPath = `${folder}/${version}.jpg`;
  const { error: originalError } = await admin.storage.from("retail-originals").upload(originalPath, original, { contentType: mimeType(image.filename), upsert: false });
  if (originalError) throw originalError;
  const { error: assetError } = await admin.storage.from("retail-assets").upload(assetPath, processed.buffer, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (assetError) throw assetError;
  const { error: insertError } = await admin.from("catalog_media").insert({
    product_id: productId, sku_id: skuId, url: getRetailAssetUrl(assetPath), role, position: 0,
    alt_text: productName, is_active: true,
  });
  if (insertError) throw insertError;
}

export async function POST(request: NextRequest) {
  if (!(await hasRetailAccess())) return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { apply?: unknown } & ManualRequest;
  const apply = body.apply === true;

  try {
    const admin = getRetailAdmin();
    const sourcePath = typeof body.sourcePath === "string" ? body.sourcePath : "";
    const skuId = typeof body.skuId === "string" ? body.skuId : "";
    if (sourcePath || skuId) {
      if (!sourcePath || !skuId || !["primary", "second"].includes(String(body.slot))) {
        return NextResponse.json({ message: "Selecione uma foto local, um SKU e o destino da imagem." }, { status: 400 });
      }
      const root = path.resolve(process.cwd(), "public", "produtos");
      const absolutePath = path.resolve(root, sourcePath);
      if (!absolutePath.startsWith(`${root}${path.sep}`) || !imageExtensions.has(path.extname(absolutePath).toLowerCase())) {
        return NextResponse.json({ message: "A foto local informada não é válida." }, { status: 400 });
      }
      const [{ data: sku, error: skuError }, { data: targetMedia, error: targetMediaError }] = await Promise.all([
        admin.from("catalog_skus").select("id,product_id,sku").eq("id", skuId).single(),
        admin.from("catalog_media").select("id").eq("sku_id", skuId).eq("role", body.slot === "primary" ? "editorial" : "studio").eq("position", 0).eq("is_active", true).maybeSingle(),
      ]);
      if (skuError || !sku) return NextResponse.json({ message: "SKU não encontrado." }, { status: 404 });
      if (targetMediaError) throw targetMediaError;
      if (targetMedia) return NextResponse.json({ message: "Esse destino já tem uma imagem. Troque-a pela página do produto para preservar a decisão de principal." }, { status: 409 });
      const { data: product, error: productError } = await admin.from("catalog_products").select("id,name").eq("id", sku.product_id).single();
      if (productError || !product) return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
      await storeLocalImage({ image: { absolutePath, relativePath: sourcePath, filename: path.basename(absolutePath) }, productId: product.id, skuId: sku.id, productName: product.name, role: body.slot === "primary" ? "editorial" : "studio" });
      return NextResponse.json({ ok: true });
    }
    const [{ data: products, error: productsError }, { data: skus, error: skusError }, { data: media, error: mediaError }] = await Promise.all([
      admin.from("catalog_products").select("id,name").eq("lifecycle_status", "active"),
      admin.from("catalog_skus").select("id,product_id,sku"),
      admin.from("catalog_media").select("sku_id,role,position").eq("is_active", true),
    ]);
    if (productsError || skusError || mediaError) throw productsError ?? skusError ?? mediaError;

    const images = await findLocalImages(path.join(process.cwd(), "public", "produtos"));
    const typedProducts = (products ?? []) as CatalogProduct[];
    const typedSkus = (skus ?? []) as CatalogSku[];
    const skusByProduct = new Map<string, CatalogSku[]>();
    typedSkus.forEach((sku) => skusByProduct.set(sku.product_id, [...(skusByProduct.get(sku.product_id) ?? []), sku]));
    const productByExactName = new Map<string, CatalogProduct[]>();
    const productByComparableName = new Map<string, CatalogProduct[]>();
    typedProducts.forEach((product) => {
      const exact = slug(product.name);
      const comparable = comparableProductName(product.name);
      productByExactName.set(exact, [...(productByExactName.get(exact) ?? []), product]);
      productByComparableName.set(comparable, [...(productByComparableName.get(comparable) ?? []), product]);
    });

    const existingSlots = new Set((media ?? []).filter((item) => item.sku_id).map((item) => `${item.sku_id}:${item.role}:${item.position}`));
    const queuedSlots = new Set<string>();
    const candidates: Candidate[] = [];
    const ambiguous: string[] = [];
    const reviewImages: string[] = [];
    let unmatched = 0;
    for (const image of images) {
      const key = imageKey(image.filename);
      const exactMatches = productByExactName.get(key) ?? [];
      const comparableMatches = productByComparableName.get(comparableProductName(key)) ?? [];
      const matches = exactMatches.length === 1 ? exactMatches : comparableMatches.length === 1 ? comparableMatches : [];
      if (!matches.length) {
        if (exactMatches.length > 1 || comparableMatches.length > 1) ambiguous.push(image.relativePath);
        else unmatched += 1;
        reviewImages.push(image.relativePath);
        continue;
      }
      const product = matches[0];
      const productSkus = skusByProduct.get(product.id) ?? [];
      if (productSkus.length !== 1) {
        ambiguous.push(image.relativePath);
        reviewImages.push(image.relativePath);
        continue;
      }
      const sku = productSkus[0];
      const role = imageRole(image.filename);
      const slot = `${sku.id}:${role}:0`;
      if (existingSlots.has(slot) || queuedSlots.has(slot)) continue;
      queuedSlots.add(slot);
      candidates.push({ ...image, productId: product.id, productName: product.name, skuId: sku.id, sku: sku.sku, role, position: 0 });
    }

    const batch = apply ? candidates.slice(0, 20) : [];
    const failures: string[] = [];
    for (const candidate of batch) {
      try {
        await storeLocalImage({ image: candidate, productId: candidate.productId, skuId: candidate.skuId, productName: candidate.productName, role: candidate.role });
      } catch (error) {
        failures.push(`${candidate.relativePath}: ${error instanceof Error ? error.message : "falha no processamento"}`);
      }
    }

    return NextResponse.json({
      apply,
      localImages: images.length,
      safeMatches: candidates.length,
      migrated: batch.length - failures.length,
      remaining: Math.max(0, candidates.length - batch.length),
      unmatched,
      ambiguous: ambiguous.slice(0, 20),
      reviewImages: reviewImages.slice(0, 40),
      candidates: candidates.slice(0, 12).map(({ relativePath, productName, sku, role }) => ({ relativePath, productName, sku, role })),
      failures,
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error && typeof error.message === "string"
        ? error.message
        : "Não foi possível analisar as imagens locais.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
