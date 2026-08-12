"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, FEATURED_PRODUCTS, type Category, type Product } from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { ProductCard } from "./product-card";
import { ProductDetail } from "./product-detail";

type Filter = "Todos" | Category;

export function CatalogClient({ print = false }: { print?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (!supabase) { setProducts(FEATURED_PRODUCTS); setLoading(false); return; }
    supabase.from("products").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => { setProducts((data as Product[])?.length ? data as Product[] : FEATURED_PRODUCTS); setLoading(false); });
  }, []);
  const results = useMemo(() => products.filter(p => (filter === "Todos" || p.category === filter) && `${p.name} ${p.category} ${p.collection ?? ""} ${p.color_name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [products, filter, search]);
  const collections = [...new Set(products.map(p => p.collection).filter(Boolean))] as string[];

  if (print) return <main className="print-shell">{CATEGORIES.map(category => <section className="category-section" key={category}><h2>{category}</h2><div className="product-grid">{products.filter(p => p.category === category).map(p => <ProductCard key={p.id} product={p} print />)}</div></section>)}</main>;
  return <main className="catalog-shell"><header className="catalog-nav"><Link className="wordmark" href="/">Mesa <span>&amp;</span> Graça</Link><div><a href="https://wa.me/5511977007234" target="_blank">Atendimento ↗</a></div></header>
    <section className="shop-header"><p className="eyebrow">CATÁLOGO ATACADO</p><h1>Encontre a peça certa para sua loja.</h1><p>Variações, preços e disponibilidade confirmados pela nossa equipe.</p></section>
    <section className="shop-toolbar" aria-label="Filtros do catálogo"><label className="search-field"><span>⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por produto, coleção ou cor" aria-label="Buscar produtos" /></label><div className="filter-row">{(["Todos", ...CATEGORIES] as Filter[]).map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></section>
    <div className="shop-meta"><p><strong>{results.length}</strong> {results.length === 1 ? "produto encontrado" : "produtos encontrados"}</p><div>{collections.map(collection => <button key={collection} onClick={() => setSearch(collection)}>{collection}</button>)}</div></div>
    {loading ? <p className="loading">Carregando catálogo…</p> : results.length ? <section className="commerce-grid">{results.map(product => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}</section> : <section className="no-results"><strong>Nenhum produto encontrado.</strong><p>Tente outra busca ou limpe os filtros.</p><button onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpar filtros</button></section>}
    {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    {!isSupabaseReady && <p className="phase-note">Vitrine de atacado · preços e disponibilidade sujeitos à confirmação.</p>}
  </main>;
}
