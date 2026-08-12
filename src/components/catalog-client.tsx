"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES, FEATURED_PRODUCTS, type Product } from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { ProductCard } from "./product-card";

export function CatalogClient({ print = false }: { print?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setProducts(FEATURED_PRODUCTS); setLoading(false); return; }
    supabase.from("products").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => { setProducts((data as Product[])?.length ? data as Product[] : FEATURED_PRODUCTS); setLoading(false); });
  }, []);

  return <main className={print ? "print-shell" : "catalog-shell"}>
    {!print && <><header className="catalog-nav"><Link className="wordmark" href="/">Mesa <span>&amp;</span> Graça</Link><div><a href="#produtos">Catálogo</a><a href="https://wa.me/5511977007234" target="_blank">Atendimento ↗</a></div></header>
      <section className="catalog-hero"><div><p className="eyebrow">ATACADO · MESA & GRAÇA</p><h1>Uma mesa bonita começa nos detalhes.</h1><p>Peças de mesa posta para lojistas e profissionais que valorizam acabamento, cor e acolhimento.</p><a className="hero-action" href="#produtos">Explorar catálogo <em>↓</em></a></div><aside><span>Vitrine B2B</span><strong>Produtos<br />selecionados<br />para atacado.</strong><small>Pedido e disponibilidade confirmados pela nossa equipe.</small></aside></section>
      <nav className="category-nav" aria-label="Categorias">{CATEGORIES.map(c => <a key={c} href={`#${c.toLowerCase().replaceAll(" ", "-")}`}>{c}</a>)}</nav></>}
    <div id="produtos" />
    {CATEGORIES.map((category, index) => { const items = products.filter(p => p.category === category); return <section className="category-section" id={category.toLowerCase().replaceAll(" ", "-")} key={category}>
      <div className="section-heading"><div><span className="category-label">0{index + 1} · CATÁLOGO ATACADO</span><h2>{category}</h2></div><p>{category === "Jogos Americanos" ? "Coleções para compor mesas cheias de personalidade." : "Acabamentos que fazem cada lugar à mesa ser especial."}</p></div>
      {loading ? <p className="loading">Carregando catálogo…</p> : items.length ? <div className="product-grid">{items.map(p => <ProductCard key={p.id} product={p} print={print} />)}</div> : <div className="empty-product"><strong>EM ATUALIZAÇÃO</strong><p>Consulte detalhes no WhatsApp</p></div>}
    </section>; })}
    {!isSupabaseReady && !print && <p className="phase-note">Vitrine de atacado · preços e disponibilidade sujeitos à confirmação.</p>}
  </main>;
}
