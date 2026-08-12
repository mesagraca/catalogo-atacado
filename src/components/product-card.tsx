"use client";

import { useState } from "react";
import type { Product, Variation } from "@/types/catalog";
import { whatsappUrl } from "@/lib/whatsapp";

const money = (value: number | null) => value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function Swatch({ variation, selected, onClick }: { variation: Variation; selected: boolean; onClick: () => void }) {
  return <button className={`swatch ${variation.pattern} ${selected ? "selected" : ""}`} onClick={onClick} title={`${variation.pattern} ${variation.name}`} aria-label={`${variation.pattern} ${variation.name}`} style={{ "--swatch": variation.hex } as React.CSSProperties} />;
}

export function ProductCard({ product, print = false }: { product: Product; print?: boolean }) {
  const hasImage = product.image_status === "final" && product.image_url;
  const [selected, setSelected] = useState<Variation | undefined>(product.variations?.[0]);
  const xadrez = product.variations?.filter(v => v.pattern === "xadrez") ?? [];
  const lisos = product.variations?.filter(v => v.pattern === "liso") ?? [];
  const href = whatsappUrl({ ...product, color_name: selected ? `${selected.pattern === "xadrez" ? "Xadrez" : "Liso"} ${selected.name}` : product.color_name });
  return <article className={`product-card ${print ? "print-card" : ""}`}>
    <div className="product-image">{hasImage ? <img src={product.image_url!} alt={product.name} /> : <div className="image-placeholder"><strong>IMAGEM EM ATUALIZAÇÃO</strong><span>Consulte detalhes no WhatsApp</span></div>}</div>
    <div className="product-info"><p className="product-category">{product.collection || product.category}</p><h3>{product.name}</h3>
      {product.variations ? <div className="variation-picker"><span>Variações no mesmo preço</span>
        {xadrez.length > 0 && <div className="variation-line"><b>Xadrez</b>{xadrez.map(v => <Swatch key={`x-${v.name}`} variation={v} selected={selected?.name === v.name && selected?.pattern === v.pattern} onClick={() => setSelected(v)} />)}</div>}
        {lisos.length > 0 && <div className="variation-line"><b>Liso</b>{lisos.map(v => <Swatch key={`l-${v.name}`} variation={v} selected={selected?.name === v.name && selected?.pattern === v.pattern} onClick={() => setSelected(v)} />)}</div>}
        {selected && <small>Selecionado: {selected.pattern === "xadrez" ? "Xadrez" : "Liso"} {selected.name}</small>
      }</div> : product.color_name && <div className="color-row"><span>Cor / variação</span><b>{product.color_hex && <i style={{ backgroundColor: product.color_hex }} />} {product.color_name}</b></div>}
      {product.sku && <p className="sku">SKU: {product.sku}</p>}
      <div className="prices"><div><span>Varejo</span><s>{money(product.retail_price)}</s></div><div><span>Atacado</span><strong>{money(product.wholesale_price)}</strong></div></div>
      {!print && <a className="whatsapp" target="_blank" rel="noreferrer" href={href}>Solicitar no WhatsApp <em>↗</em></a>}
    </div>
  </article>;
}
