"use client";

import { ChangeEvent, useMemo, useState } from "react";
import type { RetailCatalogCard } from "@/lib/retail-catalog";

const money = (value: number | null) =>
  value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function RetailCatalogGrid({ products }: { products: RetailCatalogCard[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [mediaRole, setMediaRole] = useState("editorial");
  const [uploading, setUploading] = useState<string | null>(null);
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
          </article>
        ))}
      </div>
    </section>
  );
}
