"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, FEATURED_PRODUCTS, type Product } from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { ProductCard } from "./product-card";

export function CatalogClient({ print = false }: { print?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setProducts(FEATURED_PRODUCTS); setLoading(false); return; }
    supabase.from("products").select("*").eq("is_visible", true).order("sort_order")
      .then(({ data }) => { setProducts((data as Product[])?.length ? data as Product[] : FEATURED_PRODUCTS); setLoading(false); });
  }, []);

  return <main className={print ? "print-shell" : "catalog-shell"}>
    {!print && <section className="catalog-intro">
      <p className="eyebrow">ATACADO · MESA & GRAÇA</p>
      <h1>Peças que fazem a mesa receber.</h1>
      <p>Escolha suas peças, variações e quantidades. O pedido é enviado para nossa equipe pelo WhatsApp para confirmação de disponibilidade e prazo.</p>
      <div className="catalog-steps"><span>1. Escolha</span><span>2. Personalize</span><span>3. Solicite</span></div>
    </section>}
    {!print && <nav className="category-nav" aria-label="Categorias">{CATEGORIES.map(c => <a key={c} href={`#${c.toLowerCase().replaceAll(" ", "-")}`}>{c}</a>)}</nav>}
    {CATEGORIES.map(category => {
      const items = products.filter(p => p.category === category);
      return <section className="category-section" id={category.toLowerCase().replaceAll(" ", "-")} key={category}>
        <span className="category-label">CATÁLOGO ATACADO</span><h2>{category}</h2>
        {loading ? <p className="loading">Carregando catálogo…</p> : items.length ? <div className="product-grid">{items.map(p => <ProductCard key={p.id} product={p} print={print} />)}</div> : <div className="empty-product"><strong>EM ATUALIZAÇÃO</strong><p>Consulte detalhes no WhatsApp</p></div>}
      </section>;
    })}
    {!isSupabaseReady && !print && <p className="phase-note">Fase 1 · Vitrine demonstrativa com produtos já revisados. A gestão e auditoria serão conectadas na próxima fase.</p>}
    {print && <footer className="print-footer"><h2>Mesa<span>&amp;</span>Graça</h2><p>Consulte pedidos e condições comerciais</p><a href="https://wa.me/5511977007234">+55 11 97700-7234</a></footer>}
  </main>;
}
