"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURED_PRODUCTS, type Product, type Variation } from "@/types/catalog";
import { supabase } from "@/lib/supabase";
import { whatsappUrl } from "@/lib/whatsapp";
import { ProductCard } from "./product-card";
import { BrandLogo } from "./brand-logo";
import { SiteFooter } from "./site-footer";
import { ArrowUpRightIcon, MinusIcon, PlusIcon } from "./ui-icons";

const money = (value: number | null) => value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function ProductPageClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(FEATURED_PRODUCTS.find(item => item.id === id) ?? null);
  const [loading, setLoading] = useState(!product);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [variation, setVariation] = useState<Variation | undefined>(product?.variations?.[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    Promise.all([supabase.from("products").select("*").eq("id", id).maybeSingle(), supabase.from("products").select("*").eq("is_visible", true).order("sort_order")]).then(([productResult, catalogResult]) => {
      if (productResult.data) { const item = productResult.data as Product; setProduct(item); setVariation(item.variations?.[0]); }
      if (catalogResult.data?.length) setCatalogProducts(catalogResult.data as Product[]);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main className="product-page-shell"><div className="product-page-skeleton" /></main>;
  if (!product) return <main className="product-page-shell"><section className="product-not-found"><p className="eyebrow">CATÁLOGO ATACADO</p><h1>Produto não encontrado.</h1><Link href="/catalogo">Voltar ao catálogo</Link></section></main>;
  const selectedName = variation ? `${variation.pattern === "xadrez" ? "Xadrez" : "Liso"} ${variation.name}` : product.color_name;
  const href = whatsappUrl({ ...product, color_name: selectedName }, quantity);
  const groups = ["xadrez", "liso"] as const;
  const related = catalogProducts.filter(item => item.id !== product.id).sort((a, b) => Number(b.collection === product.collection) - Number(a.collection === product.collection) || Number(b.category === product.category) - Number(a.category === product.category) || a.sort_order - b.sort_order).slice(0, 3);
  const hasColorInfo = Boolean(product.variations?.length) || Boolean(product.color_name);
  return <main className="product-page-shell"><header className="catalog-nav"><Link className="wordmark" href="/" aria-label="Mesa & Graça"><BrandLogo priority /></Link><nav aria-label="Navegação principal"><Link href="/catalogo">Catálogo</Link><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">Atendimento <ArrowUpRightIcon /></a></nav></header><nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span>/</span><Link href="/catalogo">Catálogo</Link><span>/</span><span>{product.name}</span></nav><article className="product-page"><section className="product-page-image">{product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className="image-placeholder">Imagem em atualização</div>}</section><section className="product-page-info"><p className="eyebrow">{product.collection || product.category}</p><h1>{product.name}</h1>{product.wholesale_price != null && <div className="product-page-price"><span>Preço atacado</span><strong>{money(product.wholesale_price)}</strong>{product.retail_price != null && <small>Varejo: <s>{money(product.retail_price)}</s></small>}</div>}{hasColorInfo && (product.variations?.length ? <section className="product-page-variations"><b>Escolha a variação</b>{groups.map(pattern => { const items = product.variations?.filter(item => item.pattern === pattern) ?? []; return items.length ? <div className="product-page-option-row" key={pattern}><span>{pattern === "xadrez" ? "Xadrez" : "Liso"}</span><div className="product-page-options">{items.map(item => <button className={`product-page-swatch ${pattern} ${variation?.name === item.name && variation.pattern === item.pattern ? "selected" : ""}`} style={{ "--swatch": item.hex } as React.CSSProperties} onClick={() => setVariation(item)} key={`${pattern}-${item.name}`}>{item.name}</button>)}</div></div> : null; })}</section> : <section className="product-page-variations"><b>Cor disponível</b><p className="product-page-color">{product.color_hex && <i style={{ backgroundColor: product.color_hex }} />} {product.color_name}</p></section>)}<div className="product-page-quantity"><span>Quantidade</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade"><MinusIcon /></button><strong>{quantity}</strong><button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade"><PlusIcon /></button></div></div><a className="product-page-action" target="_blank" rel="noreferrer" href={href}><svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor"><path d="M19.1 17.4c-.3-.2-.7-.2-1 .1l-1.4 1.8c-2.1-1-3.7-2.7-4.8-4.7l1.8-1.4c.3-.2.4-.7.1-1l-2.2-3.5c-.2-.4-.7-.5-1.1-.3l-2.5 1.2c-.4.2-.6.6-.5 1 .6 4.4 2.7 8.4 6.1 11.3 2.9 2.5 6.5 4 10.3 4.3.4 0 .8-.2 1-.6l1.1-2.5c.2-.4 0-.9-.4-1.1l-3.5-1.6Z" /><path d="M16 3.1a12.9 12.9 0 0 0-11.2 19.3L3.3 28l5.8-1.5A12.9 12.9 0 1 0 16 3.1Zm0 23.5c-2.2 0-4.3-.6-6.1-1.7l-.4-.2-3.4.9.9-3.3-.2-.4A10.8 10.8 0 1 1 16 26.6Z" /></svg>Solicitar pelo WhatsApp</a><p className="product-page-note">Pedido sem checkout. Nossa equipe confirma disponibilidade, mínimo e prazo.</p></section></article><section className="product-page-reference"><p className="eyebrow">REFERÊNCIA VISUAL</p><p>As imagens apresentam a peça em uso. As cores e os acabamentos podem variar conforme a tela.</p></section>{related.length > 0 && <section className="related-products"><div className="related-heading"><div><p className="eyebrow">CONTINUE EXPLORANDO</p><h2>Produtos relacionados</h2></div><Link href="/catalogo">Ver catálogo completo <ArrowUpRightIcon /></Link></div><div className="related-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}<SiteFooter /></main>;
}
