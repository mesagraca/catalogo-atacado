"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import type { RetailCatalogCard } from "@/lib/retail-catalog";

export function RetailProductEditor({ product }: { product: RetailCatalogCard }) {
  const [role, setRole] = useState("editorial");
  const [position, setPosition] = useState("0");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setNotice(null);
    const form = new FormData();
    form.set("file", file); form.set("productId", product.productId); form.set("skuId", product.id); form.set("role", role); form.set("position", position);
    const response = await fetch("/api/varejo/midias", { method: "POST", body: form });
    setBusy(false);
    if (response.ok) window.location.reload(); else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível enviar a imagem.");
  };
  const remove = async (mediaId: string) => {
    if (!window.confirm("Remover esta imagem da galeria? O original continua preservado no acervo.")) return;
    setBusy(true); setNotice(null);
    const response = await fetch("/api/varejo/midias", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaId }) });
    setBusy(false);
    if (response.ok) window.location.reload(); else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível remover a imagem.");
  };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setNotice(null);
    const response = await fetch("/api/varejo/produtos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      skuId: product.id, productId: product.productId,
      name: data.get("name"), category: data.get("category"), description: data.get("description"), material: data.get("material"),
      retailPrice: data.get("retailPrice"), wholesalePrice: data.get("wholesalePrice"), marketplacePrice: data.get("marketplacePrice"), promotionPrice: data.get("promotionPrice"), promotionStartsAt: data.get("promotionStartsAt"), promotionEndsAt: data.get("promotionEndsAt"),
      costPrice: data.get("costPrice"), minimumStock: data.get("minimumStock"), weightGrams: data.get("weightGrams"), heightCm: data.get("heightCm"), widthCm: data.get("widthCm"), lengthCm: data.get("lengthCm"), visible: data.get("visible") === "on", active: data.get("active") === "on",
    }) });
    setBusy(false);
    if (response.ok) window.location.reload(); else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível salvar o produto.");
  };
  return <main className="retail-product-page">
    <Link className="retail-back" href="/varejo">← Voltar ao catálogo</Link>
    <header><p className="eyebrow">{product.category ?? "SEM CATEGORIA"}</p><h1>{product.name}</h1><p>{product.sku} · {product.kind === "kit" ? "Kit composto" : "Item avulso"}</p></header>
    {notice && <p className="retail-feedback" role="alert">{notice}</p>}
    <section className="retail-product-media"><div><h2>Imagens do produto</h2><p>Envie as imagens finais. Cada versão é convertida para o padrão do catálogo e hospedada no domínio.</p></div><div className="retail-media-controls"><select value={role} onChange={(event) => setRole(event.target.value)}><option value="editorial">Editorial</option><option value="studio">Estúdio</option><option value="gallery">Galeria</option></select><select value={position} onChange={(event) => setPosition(event.target.value)}><option value="0">Principal</option><option value="1">Segunda</option><option value="2">Terceira</option></select><label>{busy ? "Processando…" : "Adicionar imagem"}<input accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={upload} type="file" /></label></div>
      <div className="retail-product-gallery">{product.media.length ? product.media.map((media) => <figure key={media.id}><img alt={`${product.name} — ${media.role}`} src={media.url} /><figcaption>{media.role} · posição {media.position + 1}<button disabled={busy} onClick={() => remove(media.id)} type="button">Remover</button></figcaption></figure>) : <p>Nenhuma imagem canônica cadastrada.</p>}</div>
    </section>
    <form className="retail-product-form" onSubmit={save}><h2>Dados comerciais e técnicos</h2><label>Nome<input defaultValue={product.name} name="name" required /></label><label>Categoria<input defaultValue={product.category ?? ""} name="category" /></label><label>Descrição comercial<textarea defaultValue={product.description ?? ""} name="description" rows={4} /></label><label>Material<input defaultValue={product.material ?? ""} name="material" /></label><div className="retail-form-grid"><label>Preço varejo<input defaultValue={product.retailListPrice ?? ""} min="0" name="retailPrice" step="0.01" type="number" /></label><label>Preço atacado<input defaultValue={product.wholesalePrice ?? ""} min="0" name="wholesalePrice" step="0.01" type="number" /></label><label>Marketplace<input defaultValue={product.marketplacePrice ?? ""} min="0" name="marketplacePrice" step="0.01" type="number" /></label><label>Promoção<input defaultValue={product.promotionPrice ?? ""} min="0" name="promotionPrice" step="0.01" type="number" /></label><label>Início promo<input defaultValue={product.promotionStartsAt ?? ""} name="promotionStartsAt" type="date" /></label><label>Fim promo<input defaultValue={product.promotionEndsAt ?? ""} name="promotionEndsAt" type="date" /></label><label>Custo<input defaultValue={product.costPrice ?? ""} min="0" name="costPrice" step="0.01" type="number" /></label><label>Estoque mínimo<input defaultValue={product.minimumStock} min="0" name="minimumStock" step="1" type="number" /></label><label>Peso g<input defaultValue={product.weightGrams ?? ""} min="0" name="weightGrams" step="0.01" type="number" /></label><label>Altura cm<input defaultValue={product.heightCm ?? ""} min="0" name="heightCm" step="0.01" type="number" /></label><label>Largura cm<input defaultValue={product.widthCm ?? ""} min="0" name="widthCm" step="0.01" type="number" /></label><label>Comprimento cm<input defaultValue={product.lengthCm ?? ""} min="0" name="lengthCm" step="0.01" type="number" /></label></div><div className="retail-switches"><label><input defaultChecked={product.visible} name="visible" type="checkbox" /> Exibir no varejo</label><label><input defaultChecked={product.active} name="active" type="checkbox" /> Produto ativo</label></div><button disabled={busy} type="submit">{busy ? "Salvando…" : "Salvar produto"}</button></form>
  </main>;
}
