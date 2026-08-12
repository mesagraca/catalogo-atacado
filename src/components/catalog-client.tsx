"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  FEATURED_PRODUCTS,
  type Category,
  type Product,
} from "@/types/catalog";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { ProductCard } from "./product-card";
import { CollectionHeader } from "./collection-header";
import {
  ProductSidebar,
  ProductToolbar,
  type PriceRange,
  type SortOrder,
  type ViewMode,
} from "./product-toolbar";
import { BrandLogo } from "./brand-logo";
import { SiteFooter } from "./site-footer";
import { WhatsAppIcon } from "./ui-icons";
import { CollectionsMegaMenu } from "./collections-mega-menu";

type Filter = "Todos" | Category;

export function CatalogClient({ print = false }: { print?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [collection, setCollection] = useState("");
  const [color, setColor] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    if (!supabase) {
      setProducts(FEATURED_PRODUCTS);
      setLoading(false);
      return;
    }
    supabase
      .from("products")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => {
        setProducts(
          (data as Product[])?.length ? (data as Product[]) : FEATURED_PRODUCTS,
        );
        setLoading(false);
      });
  }, []);
  const collections = useMemo(
    () =>
      [
        ...new Set(products.map((p) => p.collection).filter(Boolean)),
      ] as string[],
    [products],
  );
  const colors = useMemo(
    () =>
      [
        ...new Set(
          products
            .flatMap((product) => [
              product.color_name,
              ...(product.variations?.map((item) => item.name) ?? []),
            ])
            .filter(Boolean),
        ),
      ] as string[],
    [products],
  );
  const results = useMemo(
    () =>
      products
        .filter((product) => {
          const price = product.wholesale_price ?? product.retail_price;
          const matchesPrice =
            priceRange === "all" ||
            (price != null &&
              ((priceRange === "up-to-10" && price <= 10) ||
                (priceRange === "10-to-15" && price >= 10 && price <= 15) ||
                (priceRange === "over-15" && price > 15)));
          const matchesColor =
            !color ||
            product.color_name === color ||
            product.variations?.some((item) => item.name === color);
          const searchable =
            `${product.name} ${product.category} ${product.collection ?? ""} ${product.color_name ?? ""} ${product.variations?.map((item) => item.name).join(" ") ?? ""}`.toLowerCase();
          return (
            (filter === "Todos" || product.category === filter) &&
            (!collection || product.collection === collection) &&
            matchesColor &&
            matchesPrice &&
            searchable.includes(search.toLowerCase())
          );
        })
        .sort((a, b) => {
          if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
          if (sort === "price-low")
            return (
              (a.wholesale_price ?? a.retail_price ?? Infinity) -
              (b.wholesale_price ?? b.retail_price ?? Infinity)
            );
          if (sort === "price-high")
            return (
              (b.wholesale_price ?? b.retail_price ?? -Infinity) -
              (a.wholesale_price ?? a.retail_price ?? -Infinity)
            );
          return a.sort_order - b.sort_order;
        }),
    [products, filter, collection, color, priceRange, search, sort],
  );
  const clearFilters = () => {
    setFilter("Todos");
    setCollection("");
    setColor("");
    setPriceRange("all");
    setSearch("");
  };
  const activeFilterCount =
    Number(filter !== "Todos") +
    Number(Boolean(collection)) +
    Number(Boolean(color)) +
    Number(priceRange !== "all");
  const chooseCategory = (category: Filter) => {
    setFilter(category);
    setCollection("");
  };
  const chooseCollection = (category: Filter, selectedCollection?: string) => {
    setFilter(category);
    setCollection(selectedCollection ?? "");
    setColor("");
    setPriceRange("all");
  };
  const heroImage =
    filter === "Jogos Americanos"
      ? "/produtos/Jogo%20Americano%20Redondo%20Xadrez%20%28Dupla%20Face%29.jpg"
      : filter === "Porta-guardanapos"
        ? "/produtos/laco-elegance.png"
        : "/produtos/laco-charm.png";

  if (print)
    return (
      <main className="print-shell">
        {CATEGORIES.map((category) => (
          <section className="category-section" key={category}>
            <h2>{category}</h2>
            <div className="product-grid">
              {products
                .filter((p) => p.category === category)
                .map((p) => (
                  <ProductCard key={p.id} product={p} print />
                ))}
            </div>
          </section>
        ))}
      </main>
    );
  return (
    <main className="catalog-shell">
      <header className="catalog-nav catalog-header">
        <Link className="wordmark" href="/" aria-label="Mesa & Graça">
          <BrandLogo priority />
        </Link>
        <label className="header-search">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produtos, coleções ou cores"
            aria-label="Buscar produtos"
          />
        </label>
        <nav aria-label="Navegação principal">
          <CollectionsMegaMenu
            products={products}
            categories={CATEGORIES}
            onSelect={chooseCollection}
          />
          <a
            href="https://wa.me/5511977007234"
            target="_blank"
            rel="noreferrer"
          >
            Atendimento <WhatsAppIcon />
          </a>
        </nav>
      </header>
      <CollectionHeader
        title={filter === "Todos" ? "Catálogo de atacado" : filter}
        imageUrl={heroImage}
      />
      <ProductToolbar
        categories={CATEGORIES}
        collections={collections}
        colors={colors}
        category={filter}
        collection={collection}
        color={color}
        priceRange={priceRange}
        sort={sort}
        view={view}
        activeFilterCount={activeFilterCount}
        onCategory={chooseCategory}
        onCollection={setCollection}
        onColor={setColor}
        onPriceRange={setPriceRange}
        onSort={setSort}
        onView={setView}
        onClear={clearFilters}
      />
      <div
        className={`catalog-products-layout ${sidebarOpen ? "with-sidebar" : ""}`}
      >
        <ProductSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((open) => !open)}
          categories={CATEGORIES}
          collections={collections}
          colors={colors}
          category={filter}
          collection={collection}
          color={color}
          priceRange={priceRange}
          sort={sort}
          view={view}
          activeFilterCount={activeFilterCount}
          onCategory={chooseCategory}
          onCollection={setCollection}
          onColor={setColor}
          onPriceRange={setPriceRange}
          onSort={setSort}
          onView={setView}
          onClear={clearFilters}
        />
        <div className="catalog-results">
          <div className="results-meta">
            <p>
              <strong>{results.length}</strong>{" "}
              {results.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
            {activeFilterCount > 0 && (
              <p>Filtros ativos: {activeFilterCount}</p>
            )}
          </div>
          {loading ? (
            <section className="loading-grid" aria-label="Carregando produtos">
              <i />
              <i />
              <i />
            </section>
          ) : results.length ? (
            <section
              className={`commerce-grid ${view === "list" ? "list-view" : ""}`}
            >
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          ) : (
            <section className="no-results">
              <strong>Nenhum produto encontrado.</strong>
              <p>Tente outra busca ou limpe os filtros.</p>
              <button onClick={clearFilters}>Limpar filtros</button>
            </section>
          )}
        </div>
      </div>
      {!isSupabaseReady && (
        <p className="phase-note">
          Vitrine de atacado · preços e disponibilidade sujeitos à confirmação.
        </p>
      )}
      <SiteFooter />
    </main>
  );
}
