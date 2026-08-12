"use client";

import { useState } from "react";
import type { Product, Variation } from "@/types/catalog";

const money = (value: number | null) => value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
function Swatch({ variation, selected, onClick }: { variation: Variation; selected: boolean; onClick: () => void }) { return <button className={`swatch ${variation.pattern} ${selected ? "selected" : ""}`} onClick={onClick} title={`${variation.pattern} ${variation.name}`} aria-label={`${variation.pattern} ${variation.name}`} style={{ "--swatch": variation.hex } as React.CSSProperties} />; }

export function ProductCard({ product, print = false, onOpen }: { product: Product; print?: boolean; onOpen?: (product: Product) => void }) {
  const [selected, setSelected] = useState<Variation | undefined>(product.variations?.[0]);
  const variations = product.variations ?? [];
  const visibleVariations = variations.slice(0, 6);
  return <article className="product-card"><button className="product-image product-open" onClick={() => onOpen?.(product)} aria-label={`Ver ${product.name}`}>{product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" /> : <div className="image-placeholder">Imagem em atualização</div>}<span>Ver produto</span></button><div className="product-info"><div className="product-topline"><span>{product.collection || product.category}</span></div><h3>{product.name}</h3><div className="product-commerce"><small>{product.sku || "SKU sob consulta"}</small><div><span>Atacado</span><strong>{money(product.wholesale_price)}</strong></div></div>
    <div className="product-divider" />
    {variations.length > 0 ? <div className="variation-picker"><span>Variações no mesmo preço</span><div className="swatch-row">{visibleVariations.map(v => <Swatch key={`${v.pattern}-${v.name}`} variation={v} selected={selected?.name === v.name && selected?.pattern === v.pattern} onClick={() => setSelected(v)} />)}{variations.length > visibleVariations.length && <button className="more-swatches" onClick={() => onOpen?.(product)} aria-label={`Ver mais ${variations.length - visibleVariations.length} variações`}>+{variations.length - visibleVariations.length}</button>}</div></div> : <div className="variation-picker single-color"><span>Cor disponível</span><p>{product.color_hex && <i style={{ backgroundColor: product.color_hex }} />} {product.color_name || "Confirmar com a equipe"}</p></div>}
    <div className="card-bottom">{product.retail_price != null && <small>Varejo: {money(product.retail_price)}</small>}{!print && <button className="product-cta" onClick={() => onOpen?.(product)}>Ver produto <em>↗</em></button>}</div></div></article>;
}
