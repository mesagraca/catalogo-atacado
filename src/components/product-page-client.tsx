"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURED_PRODUCTS, type Product, type Variation } from "@/types/catalog";
import { supabase } from "@/lib/supabase";
import { whatsappUrl } from "@/lib/whatsapp";

const money = (value: number | null) => value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function ProductPageClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(FEATURED_PRODUCTS.find(item => item.id === id) ?? null);
  const [loading, setLoading] = useState(!product);
  const [variation, setVariation] = useState<Variation | undefined>(product?.variations?.[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) { const item = data as Product; setProduct(item); setVariation(item.variations?.[0]); }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main className="product-page-shell"><div className="product-page-skeleton" /></main>;
  if (!product) return <main className="product-page-shell"><section className="product-not-found"><p className="eyebrow">CATÁLOGO ATACADO</p><h1>Produto não encontrado.</h1><Link href="/catalogo">Voltar ao catálogo</Link></section></main>;
  const selectedName = variation ? `${variation.pattern === "xadrez" ? "Xadrez" : "Liso"} ${variation.name}` : product.color_name;
  const href = whatsappUrl({ ...product, color_name: selectedName }, quantity);
  const groups = ["xadrez", "liso"] as const;
  return <main className="product-page-shell"><header className="catalog-nav"><Link className="wordmark" href="/">Mesa <span>&amp;</span> Graça</Link><nav aria-label="Navegação principal"><Link href="/catalogo">Catálogo</Link><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">Atendimento ↗</a></nav></header><nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span>/</span><Link href="/catalogo">Catálogo</Link><span>/</span><span>{product.name}</span></nav><article className="product-page"><section className="product-page-image">{product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className="image-placeholder">Imagem em atualização</div>}</section><section className="product-page-info"><p className="eyebrow">{product.collection || product.category}</p><h1>{product.name}</h1><p className="product-page-sku">{product.sku || "SKU sob consulta"}</p><div className="product-page-price"><span>Preço atacado</span><strong>{money(product.wholesale_price)}</strong>{product.retail_price != null && <small>Varejo: {money(product.retail_price)}</small>}</div>{product.variations?.length ? <section className="product-page-variations"><b>Escolha a variação</b>{groups.map(pattern => { const items = product.variations?.filter(item => item.pattern === pattern) ?? []; return items.length ? <div className="product-page-option-row" key={pattern}><span>{pattern === "xadrez" ? "Xadrez" : "Liso"}</span>{items.map(item => <button className={`product-page-swatch ${pattern} ${variation?.name === item.name && variation.pattern === item.pattern ? "selected" : ""}`} style={{ "--swatch": item.hex } as React.CSSProperties} onClick={() => setVariation(item)} key={`${pattern}-${item.name}`}>{item.name}</button>)}</div> : null; })}</section> : <section className="product-page-variations"><b>Cor disponível</b><p className="product-page-color">{product.color_hex && <i style={{ backgroundColor: product.color_hex }} />} {product.color_name || "Confirmar com a equipe"}</p></section>}<div className="product-page-quantity"><span>Quantidade</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade">−</button><strong>{quantity}</strong><button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade">+</button></div></div><a className="product-page-action" target="_blank" rel="noreferrer" href={href}>Solicitar pelo WhatsApp <em>↗</em></a><p className="product-page-note">Pedido sem checkout. Nossa equipe confirma disponibilidade, mínimo e prazo.</p></section></article><section className="product-page-reference"><p className="eyebrow">REFERÊNCIA VISUAL</p><p>As imagens apresentam a peça em uso. As cores e os acabamentos podem variar conforme a tela.</p></section></main>;
}
