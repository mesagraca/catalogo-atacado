"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import type { RetailCatalogCard } from "@/lib/retail-catalog";

type ImageSlot = "primary" | "second" | "gallery";
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function slotFor(slot: ImageSlot) {
  if (slot === "primary") return { role: "editorial", position: "0" };
  if (slot === "second") return { role: "studio", position: "0" };
  return { role: "gallery", position: "0" };
}

export function RetailProductEditor({ product }: { product: RetailCatalogCard }) {
  const [slot, setSlot] = useState<ImageSlot>("primary");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const principalMedia = product.media.find((media) => media.role === "editorial" && media.position === 0);
  const shownPrice = product.promotionPrice ?? product.retailListPrice;

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setNotice(null);
    const selectedSlot = slotFor(slot);
    const form = new FormData();
    form.set("file", file); form.set("productId", product.productId); form.set("skuId", product.id);
    form.set("role", selectedSlot.role); form.set("position", selectedSlot.position);
    const response = await fetch("/api/varejo/midias", { method: "POST", body: form });
    setBusy(false);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível enviar a imagem.");
  };

  const remove = async (mediaId: string) => {
    if (!window.confirm("Remover esta imagem do anúncio? O original continua preservado no acervo.")) return;
    setBusy(true); setNotice(null);
    const response = await fetch("/api/varejo/midias", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaId }) });
    setBusy(false);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível remover a imagem.");
  };

  const makePrimary = async (mediaId: string) => {
    setBusy(true); setNotice(null);
    const response = await fetch("/api/varejo/midias", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaId }) });
    setBusy(false);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível definir a imagem principal.");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setNotice(null);
    const response = await fetch("/api/varejo/produtos", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skuId: product.id, productId: product.productId,
        name: data.get("name"), category: data.get("category"), description: data.get("description"), material: data.get("material"),
        retailPrice: data.get("retailPrice"), wholesalePrice: data.get("wholesalePrice"), marketplacePrice: data.get("marketplacePrice"), promotionPrice: data.get("promotionPrice"), promotionStartsAt: data.get("promotionStartsAt"), promotionEndsAt: data.get("promotionEndsAt"),
        costPrice: data.get("costPrice"), minimumStock: data.get("minimumStock"), weightGrams: data.get("weightGrams"), heightCm: data.get("heightCm"), widthCm: data.get("widthCm"), lengthCm: data.get("lengthCm"),
        visible: data.get("visible") === "on", active: data.get("active") === "on",
      }),
    });
    setBusy(false);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível salvar o produto.");
  };

  return <main className="retail-product-page">
    <Link className="retail-back" href="/varejo">← Voltar ao catálogo</Link>
    <header><p className="eyebrow">{product.category ?? "SEM CATEGORIA"}</p><h1>{product.name}</h1><p>{product.sku} · {product.kind === "kit" ? "Kit composto" : "Item avulso"}</p></header>
    {notice && <p className="retail-feedback" role="alert">{notice}</p>}
    <section className="retail-product-media" aria-labelledby="media-title">
      <div><h2 id="media-title">Imagens do produto</h2><p>Envie uma foto por vez. A principal aparece no card e no anúncio; a segunda foto é usada no hover.</p></div>
      <div className="retail-media-controls"><select aria-label="Destino da imagem" onChange={(event) => setSlot(event.target.value as ImageSlot)} value={slot}><option value="primary">Imagem principal</option><option value="second">Segunda imagem / hover</option><option value="gallery">Galeria</option></select><label>{busy ? "Processando…" : "Adicionar uma imagem"}<input accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={upload} type="file" /></label></div>
      <div className="retail-product-gallery">{product.media.length ? product.media.map((media) => {
        const isPrimary = media.id === principalMedia?.id;
        return <figure className={isPrimary ? "retail-media-primary" : ""} key={media.id}><img alt={`${product.name} — ${isPrimary ? "imagem principal" : media.role}`} src={media.url} /><figcaption><span>{isPrimary ? "Imagem principal" : media.role === "studio" ? "Segunda imagem" : "Galeria"}</span><div>{!isPrimary && <button disabled={busy} onClick={() => makePrimary(media.id)} type="button">Tornar principal</button>}<button disabled={busy} onClick={() => remove(media.id)} type="button">Remover</button></div></figcaption></figure>;
      }) : <p>Nenhuma imagem canônica cadastrada.</p>}</div>
    </section>
    <section className="retail-ad-preview" aria-labelledby="preview-title"><div><p className="eyebrow">PRÉVIA</p><h2 id="preview-title">Como o anúncio será visto</h2><p>A prévia usa a imagem principal e os dados comerciais salvos abaixo.</p></div><article><div className="retail-ad-preview-image">{product.imageUrl ? <img alt="" src={product.imageUrl} /> : <span>Defina a imagem principal</span>}</div><div><p className="eyebrow">{product.category ?? "MESA & GRAÇA"}</p><h3>{product.name}</h3><p className="retail-ad-preview-price">{shownPrice !== null ? currency.format(shownPrice) : "Sob consulta"}</p>{product.retailListPrice && product.promotionPrice && <del>{currency.format(product.retailListPrice)}</del>}</div></article></section>
    <form className="retail-product-form" onSubmit={save}><h2>Dados comerciais e técnicos</h2><label>Nome<input defaultValue={product.name} name="name" required /></label><label>Categoria<input defaultValue={product.category ?? ""} name="category" /></label><label>Descrição comercial<textarea defaultValue={product.description ?? ""} name="description" rows={4} /></label><label>Material<input defaultValue={product.material ?? ""} name="material" /></label><div className="retail-form-grid"><label>Preço varejo<input defaultValue={product.retailListPrice ?? ""} min="0" name="retailPrice" step="0.01" type="number" /></label><label>Preço atacado<input defaultValue={product.wholesalePrice ?? ""} min="0" name="wholesalePrice" step="0.01" type="number" /></label><label>Marketplace<input defaultValue={product.marketplacePrice ?? ""} min="0" name="marketplacePrice" step="0.01" type="number" /></label><label>Promoção<input defaultValue={product.promotionPrice ?? ""} min="0" name="promotionPrice" step="0.01" type="number" /></label><label>Início promo<input defaultValue={product.promotionStartsAt ?? ""} name="promotionStartsAt" type="date" /></label><label>Fim promo<input defaultValue={product.promotionEndsAt ?? ""} name="promotionEndsAt" type="date" /></label><label>Custo<input defaultValue={product.costPrice ?? ""} min="0" name="costPrice" step="0.01" type="number" /></label><label>Estoque mínimo<input defaultValue={product.minimumStock} min="0" name="minimumStock" step="1" type="number" /></label><label>Peso g<input defaultValue={product.weightGrams ?? ""} min="0" name="weightGrams" step="0.01" type="number" /></label><label>Altura cm<input defaultValue={product.heightCm ?? ""} min="0" name="heightCm" step="0.01" type="number" /></label><label>Largura cm<input defaultValue={product.widthCm ?? ""} min="0" name="widthCm" step="0.01" type="number" /></label><label>Comprimento cm<input defaultValue={product.lengthCm ?? ""} min="0" name="lengthCm" step="0.01" type="number" /></label></div><div className="retail-switches"><label><input defaultChecked={product.visible} name="visible" type="checkbox" /> Exibir no varejo</label><label><input defaultChecked={product.active} name="active" type="checkbox" /> Produto ativo</label></div><button disabled={busy} type="submit">{busy ? "Salvando…" : "Salvar produto"}</button></form>
  </main>;
}
