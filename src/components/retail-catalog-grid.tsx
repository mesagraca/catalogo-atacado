"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type { RetailCatalogCard } from "@/lib/retail-catalog";

const money = (value: number | null) =>
  value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const dateTime = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

type InventoryMovement = {
  id: string;
  quantity: number;
  type: string;
  note: string | null;
  reference: string | null;
  occurred_at: string;
};

export function RetailCatalogGrid({ products }: { products: RetailCatalogCard[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [mediaRole, setMediaRole] = useState("editorial");
  const [mediaPosition, setMediaPosition] = useState("0");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [kitDrafts, setKitDrafts] = useState<Record<string, RetailCatalogCard["components"]>>({});
  const [componentSelections, setComponentSelections] = useState<Record<string, string>>({});
  const [componentQuantities, setComponentQuantities] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Record<string, InventoryMovement[] | undefined>>({});
  const [historyLoading, setHistoryLoading] = useState<string | null>(null);
  const categories = useMemo(
    () => ["Todos", ...new Set(products.map((product) => product.category).filter(Boolean))] as string[],
    [products],
  );
  const results = products.filter((product) =>
    (category === "Todos" || product.category === category) &&
    `${product.name} ${product.sku} ${product.category ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const componentOptions = useMemo(() => products.filter((product) => product.kind === "single"), [products]);
  const componentsFor = (product: RetailCatalogCard) => kitDrafts[product.id] ?? product.components;
  const uploadMedia = async (product: RetailCatalogCard, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(product.id);
    const form = new FormData();
    form.set("file", file);
    form.set("productId", product.productId);
    form.set("skuId", product.id);
    form.set("role", mediaRole);
    form.set("position", mediaPosition);
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
        costPrice: data.get("costPrice"),
        minimumStock: data.get("minimumStock"),
        weightGrams: data.get("weightGrams"),
        heightCm: data.get("heightCm"),
        widthCm: data.get("widthCm"),
        lengthCm: data.get("lengthCm"),
        material: data.get("material"),
        description: data.get("description"),
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

  const addComponent = (kit: RetailCatalogCard) => {
    const componentSkuId = componentSelections[kit.id];
    const quantity = componentQuantities[kit.id] ?? 1;
    const component = componentOptions.find((item) => item.id === componentSkuId);
    if (!component || !Number.isInteger(quantity) || quantity < 1) return;
    const current = componentsFor(kit);
    const next = current.some((item) => item.skuId === component.id)
      ? current.map((item) => item.skuId === component.id ? { ...item, quantity } : item)
      : [...current, { skuId: component.id, sku: component.sku, name: component.name, quantity }];
    setKitDrafts((drafts) => ({ ...drafts, [kit.id]: next }));
    setComponentSelections((selections) => ({ ...selections, [kit.id]: "" }));
    setComponentQuantities((quantities) => ({ ...quantities, [kit.id]: 1 }));
  };

  const removeComponent = (kit: RetailCatalogCard, componentSkuId: string) => {
    setKitDrafts((drafts) => ({ ...drafts, [kit.id]: componentsFor(kit).filter((item) => item.skuId !== componentSkuId) }));
  };

  const saveKitComposition = async (kit: RetailCatalogCard) => {
    const components = componentsFor(kit);
    if (!components.length) {
      setNotice("Inclua ao menos um item antes de salvar a composição do kit.");
      return;
    }
    setSaving(`kit-${kit.id}`);
    setNotice(null);
    const response = await fetch("/api/varejo/kits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kitSkuId: kit.id, components: components.map((item) => ({ skuId: item.skuId, quantity: item.quantity })) }),
    });
    setSaving(null);
    if (response.ok) window.location.reload();
    else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível salvar a composição do kit.");
  };

  const loadHistory = async (product: RetailCatalogCard) => {
    if (history[product.id] || historyLoading === product.id) return;
    setHistoryLoading(product.id);
    const response = await fetch(`/api/varejo/estoque?skuId=${encodeURIComponent(product.id)}`);
    setHistoryLoading(null);
    if (response.ok) {
      const payload = await response.json() as { movements: InventoryMovement[] };
      setHistory((items) => ({ ...items, [product.id]: payload.movements }));
    } else setNotice((await response.json().catch(() => null))?.message ?? "Não foi possível carregar o histórico.");
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
        <label className="retail-media-role">
          Posição
          <select value={mediaPosition} onChange={(event) => setMediaPosition(event.target.value)}>
            <option value="0">Principal</option>
            <option value="1">Segunda</option>
            <option value="2">Terceira</option>
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
            <small>{product.sku} · {product.kind === "kit" ? "Kit composto" : "Item avulso"}</small>
            <div className="retail-product-meta"><strong>{money(product.price)}</strong><span className={product.stock <= 0 ? "unavailable" : product.minimumStock > 0 && product.stock <= product.minimumStock ? "low-stock" : "available"}>{product.stock <= 0 ? "Sem estoque" : product.minimumStock > 0 && product.stock <= product.minimumStock ? `Estoque baixo: ${product.stock}` : `${product.stock} disponíveis`}</span></div>
            <div className="retail-media-status" aria-label="Cobertura de fotos">
              {(["editorial", "studio", "gallery"] as const).map((role) => <span className={product.media.some((asset) => asset.role === role) ? "done" : "pending"} key={role}>{role === "editorial" ? "Editorial" : role === "studio" ? "Estúdio" : "Galeria"}</span>)}
            </div>
            <label className="retail-media-upload">
              {uploading === product.id ? "Processando imagem…" : `Enviar foto ${mediaRole === "studio" ? "de estúdio" : mediaRole === "gallery" ? "de galeria" : "editorial"} · ${mediaPosition === "0" ? "principal" : `${mediaPosition}ª posição`}`}
              <input accept="image/jpeg,image/png,image/webp" disabled={uploading === product.id} onChange={(event) => uploadMedia(product, event)} type="file" />
            </label>
            <details className="retail-product-editor" onToggle={(event) => { if (event.currentTarget.open && product.kind === "single") void loadHistory(product); }}>
              <summary>Editar produto e estoque</summary>
              <form onSubmit={(event) => saveProduct(product, event)}>
                <label>Nome<input defaultValue={product.name} name="name" required /></label>
                <label>Categoria<input defaultValue={product.category ?? ""} name="category" /></label>
                <label>Descrição comercial<textarea defaultValue={product.description ?? ""} name="description" placeholder="Características e diferenciais do produto" rows={3} /></label>
                <label>Material<input defaultValue={product.material ?? ""} name="material" placeholder="Ex.: Nylon, Tricoline" /></label>
                <label>Preço varejo<input defaultValue={product.retailListPrice ?? ""} min="0" name="retailPrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço atacado<input defaultValue={product.wholesalePrice ?? ""} min="0" name="wholesalePrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço marketplace<input defaultValue={product.marketplacePrice ?? ""} min="0" name="marketplacePrice" placeholder="Sob consulta" step="0.01" type="number" /></label>
                <label>Preço promocional<input defaultValue={product.promotionPrice ?? ""} min="0" name="promotionPrice" step="0.01" type="number" /></label>
                <div className="retail-date-fields">
                  <label>Início<input defaultValue={product.promotionStartsAt ?? ""} name="promotionStartsAt" type="date" /></label>
                  <label>Fim<input defaultValue={product.promotionEndsAt ?? ""} name="promotionEndsAt" type="date" /></label>
                </div>
                <div className="retail-date-fields">
                  <label>Custo<input defaultValue={product.costPrice ?? ""} min="0" name="costPrice" step="0.01" type="number" /></label>
                  <label>Estoque mínimo<input defaultValue={product.minimumStock} min="0" name="minimumStock" step="1" type="number" /></label>
                </div>
                <div className="retail-measurements">
                  <label>Peso g<input defaultValue={product.weightGrams ?? ""} min="0" name="weightGrams" step="0.01" type="number" /></label>
                  <label>Altura cm<input defaultValue={product.heightCm ?? ""} min="0" name="heightCm" step="0.01" type="number" /></label>
                  <label>Largura cm<input defaultValue={product.widthCm ?? ""} min="0" name="widthCm" step="0.01" type="number" /></label>
                  <label>Compr. cm<input defaultValue={product.lengthCm ?? ""} min="0" name="lengthCm" step="0.01" type="number" /></label>
                </div>
                <div className="retail-switches">
                  <label><input defaultChecked={product.visible} name="visible" type="checkbox" /> Exibir no varejo</label>
                  <label><input defaultChecked={product.active} name="active" type="checkbox" /> Produto ativo</label>
                </div>
                <button disabled={saving === `product-${product.id}`} type="submit">{saving === `product-${product.id}` ? "Salvando…" : "Salvar dados"}</button>
              </form>
              {product.kind === "kit" ? (
                <div className="retail-kit-form">
                  <strong>Composição do kit</strong>
                  <p>O saldo exibido é calculado pelo item que estiver mais próximo de acabar.</p>
                  <div className="retail-kit-add">
                    <select onChange={(event) => setComponentSelections((items) => ({ ...items, [product.id]: event.target.value }))} value={componentSelections[product.id] ?? ""}>
                      <option value="">Selecione o item avulso</option>
                      {componentOptions.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.sku}</option>)}
                    </select>
                    <input min="1" onChange={(event) => setComponentQuantities((items) => ({ ...items, [product.id]: Number(event.target.value) }))} step="1" type="number" value={componentQuantities[product.id] ?? 1} />
                    <button onClick={() => addComponent(product)} type="button">Adicionar</button>
                  </div>
                  <ul className="retail-kit-components">
                    {componentsFor(product).map((component) => <li key={component.skuId}><span>{component.quantity}× {component.name}</span><button aria-label={`Remover ${component.name}`} onClick={() => removeComponent(product, component.skuId)} type="button">Remover</button></li>)}
                  </ul>
                  <button disabled={saving === `kit-${product.id}`} onClick={() => saveKitComposition(product)} type="button">{saving === `kit-${product.id}` ? "Salvando…" : "Salvar composição"}</button>
                </div>
              ) : <>
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
                <section className="retail-stock-history" aria-label="Últimos movimentos">
                  <strong>Últimos movimentos</strong>
                  {historyLoading === product.id ? <p>Carregando…</p> : history[product.id]?.length ? <ul>{history[product.id]?.map((movement) => <li key={movement.id}><b className={movement.quantity > 0 ? "positive" : "negative"}>{movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}</b><span>{movement.type} · {dateTime(movement.occurred_at)}{movement.note ? ` · ${movement.note}` : ""}</span></li>)}</ul> : <p>Nenhum movimento registrado.</p>}
                </section>
              </>}
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
