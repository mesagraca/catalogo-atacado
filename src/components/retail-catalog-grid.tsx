"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type { RetailCatalogCard } from "@/lib/retail-catalog";

const money = (value: number | null) =>
  value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function RetailCatalogGrid({ products }: { products: RetailCatalogCard[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [mediaRole, setMediaRole] = useState("editorial");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const categories = useMemo(
    () => ["Todos", ...new Set(products.map((product) => product.category).filter(Boolean))] as string[],
    [products],
  );
  const results = products.filter((product) =>
    (category === "Todos" || product.category === category) &&
    `${product.name} ${product.sku} ${product.category ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const uploadMedia = async (product: RetailCatalogCard, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(product.id);
    const form = new FormData();
    form.set("file", file);
    form.set("productId", product.productId);
    form.set("skuId", product.id);
    form.set("role", mediaRole);
    form.set("position", "0");
    const response = await fetch("/api/varejo/midias", { method: "POST", body: form });
    setUploading(null);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível enviar a imagem.");
  };

  const saveProduct = async (product: RetailCatalogCard, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(`product-${product.id}`);
    setNotice(null);
    const response = await fetch("/api/varejo/produtos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skuId: product.id,
        productId: product.productId,
        name: data.get("name"),
        category: data.get("category"),
        retailPrice: data.get("retailPrice"),
        wholesalePrice: data.get("wholesalePrice"),
        marketplacePrice: data.get("marketplacePrice"),
        promotionPrice: data.get("promotionPrice"),
        promotionStartsAt: data.get("promotionStartsAt"),
        promotionEndsAt: data.get("promotionEndsAt"),
        visible: data.get("visible") === "on",
        active: data.get("active") === "on",
      }),
    });
    setSaving(null);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível salvar o produto.");
  };

  const registerMovement = async (product: RetailCatalogCard, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(`stock-${product.id}`);
    setNotice(null);
    const response = await fetch("/api/varejo/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skuId: product.id,
        type: data.get("type"),
        quantity: Number(data.get("quantity")),
        note: data.get("note"),
      }),
    });
    setSaving(null);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível registrar o movimento.");
  };

  return (
    <section className="retail-catalog" aria-label="Produtos de varejo">
      <div className="retail-catalog-tools">
        <label>
          Buscar produto ou SKU
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no varejo" />
        </label>
        <label className="retail-media-role">
          Tipo de foto
          <select value={mediaRole} onChange={(event) => setMediaRole(event.target.value)}>
            <option value="editorial">Editorial</option>
            <option value="studio">Estúdio</option>
            <option value="gallery">Galeria</option>
          </select>
        </label>
        <div aria-label="Filtrar categoria">
          {categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>
      {notice && <p className="retail-feedback" role="alert">{notice}</p>}
      <p className="retail-result-count"><strong>{results.length}</strong> SKUs publicados no varejo</p>
      <div className="retail-product-grid">
        {results.map((product) => (
          <article key={product.id}>
            <div className="retail-product-image">
              {product.imageUrl ? <img src={product.imageUrl} alt="" /> : <span>Imagem pendente</span>}
            </div>
            <p>{product.category ?? "Sem categoria"}</p>
            <h3>{product.name}</h3>
            <small>{product.sku}</small>
            <div className="retail-product-meta"><strong>{money(product.price)}</strong><span className={product.stock > 0 ? "available" : "unavailable"}>{product.stock > 0 ? `${product.stock} disponíveis` : "Sem estoque"}</span></div>
            <label className="retail-media-upload">
              {uploading === product.id ? "Processando imagem…" : `Enviar foto ${mediaRole === "studio" ? "de estúdio" : mediaRole === "gallery" ? "de galeria" : "editorial"}`}
              <input accept="image/jpeg,image/png,image/webp" disabled={uploading === product.id} onChange={(event) => uploadMedia(product, event)} type="file" />
            </label>
            <details className="retail-product-editor">
              <summary>Editar produto e estoque</summary>
              <form onSubmit={(event) => saveProduct(product, event)}>
                <label>Nome<input defaultValue={product.name} name="name" required /></label>
                <label>Categoria<input defaultValue={product.category ?? ""} name="category" /></label>
                <label>Preço varejo<input defaultValue={product.retailListPrice ?? ""} min="0" name="retailPrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço atacado<input defaultValue={product.wholesalePrice ?? ""} min="0" name="wholesalePrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço marketplace<input defaultValue={product.marketplacePrice ?? ""} min="0" name="marketplacePrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço promocional<input defaultValue={product.promotionPrice ?? ""} min="0" name="promotionPrice" step="0.01" type="number" /></label>
                <div className="retail-date-fields">
                  <label>Início<input defaultValue={product.promotionStartsAt ?? ""} name="promotionStartsAt" type="date" /></label>
                  <label>Fim<input defaultValue={product.promotionEndsAt ?? ""} name="promotionEndsAt" type="date" /></label>
                </div>
                <div className="retail-switches">
                  <label><input defaultChecked={product.visible} name="visible" type="checkbox" /> Exibir no varejo</label>
                  <label><input defaultChecked={product.active} name="active" type="checkbox" /> Produto ativo</label>
                </div>
                <button disabled={saving === `product-${product.id}`} type="submit">{saving === `product-${product.id}` ? "Salvando…" : "Salvar dados"}</button>
              </form>
              <form className="retail-stock-form" onSubmit={(event) => registerMovement(product, event)}>
                <strong>Movimentar estoque</strong>
                <label>Tipo
                  <select defaultValue="receipt" name="type">
                    <option value="receipt">Entrada</option>
                    <option value="sale">Saída / venda</option>
                    <option value="return">Devolução</option>
                    <option value="adjustment">Ajuste (use sinal + ou -)</option>
                  </select>
                </label>
                <label>Quantidade<input defaultValue="1" name="quantity" required step="1" type="number" /></label>
                <label>Observação<input name="note" placeholder="Ex.: contagem física" /></label>
                <button disabled={saving === `stock-${product.id}`} type="submit">{saving === `stock-${product.id}` ? "Registrando…" : "Registrar movimento"}</button>
              </form>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
