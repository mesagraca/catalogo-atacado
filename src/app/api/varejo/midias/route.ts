import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { processCatalogImage } from "@/lib/retail-image";
import { getRetailAdmin, getRetailAssetUrl } from "@/lib/retail-server";

export const runtime = "nodejs";

const validRoles = new Set(["editorial", "studio", "gallery"]);
const extension = (filename: string) => filename.split(".").pop()?.toLowerCase() || "bin";
const safeName = (value: string) => value.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");

export async function POST(request: NextRequest) {
  if (!(await hasRetailAccess())) {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  const productId = String(formData.get("productId") ?? "");
  const skuId = String(formData.get("skuId") ?? "") || null;
  const role = String(formData.get("role") ?? "");
  const position = Number(formData.get("position") ?? 0);
  if (!(file instanceof File) || !productId || !validRoles.has(role)) {
    return NextResponse.json({ message: "Produto, função da imagem e arquivo são obrigatórios." }, { status: 400 });
  }
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    return NextResponse.json({ message: "Envie JPG, PNG ou WebP." }, { status: 400 });
  }

  try {
    const admin = getRetailAdmin();
    const original = Buffer.from(await file.arrayBuffer());
    const processed = await processCatalogImage(original);
    const version = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const folder = `${productId}/${skuId ?? "produto"}/${role}`;
    const originalPath = `${folder}/originais/${version}.${safeName(extension(file.name))}`;
    const assetPath = `${folder}/${version}.jpg`;
    const [{ error: originalError }, { error: assetError }] = await Promise.all([
      admin.storage.from("retail-originals").upload(originalPath, original, {
        contentType: file.type,
        upsert: false,
      }),
      admin.storage.from("retail-assets").upload(assetPath, processed.buffer, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: false,
      }),
    ]);
    if (originalError) throw originalError;
    if (assetError) throw assetError;

    const url = getRetailAssetUrl(assetPath);
    let previousMedia = admin
      .from("catalog_media")
      .update({ is_active: false })
      .eq("product_id", productId)
      .eq("role", role)
      .eq("position", Number.isFinite(position) ? position : 0);
    previousMedia = skuId ? previousMedia.eq("sku_id", skuId) : previousMedia.is("sku_id", null);
    const { error: previousMediaError } = await previousMedia;
    if (previousMediaError) throw previousMediaError;
    const { error: mediaError } = await admin.from("catalog_media").insert({
      product_id: productId,
      sku_id: skuId,
      url,
      role,
      position: Number.isFinite(position) ? position : 0,
      alt_text: file.name.replace(/\.[^.]+$/, ""),
      is_active: true,
    });
    if (mediaError) throw mediaError;

    return NextResponse.json({ url, ...processed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao processar a imagem.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
