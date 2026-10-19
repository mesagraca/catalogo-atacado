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
import { MobileCatalogMenu } from "./mobile-catalog-menu";

type Filter = "Todos" | Category;
const normalizeProduct = (product: Product): Product => {
  const fallback = FEATURED_PRODUCTS.find(
    (featured) => featured.id === product.id || featured.name === product.name,
  );
  return {
    ...product,
    kit_quantity: product.kit_quantity ?? fallback?.kit_quantity,
    game_items: product.game_items ?? fallback?.game_items,
    description: product.description ?? fallback?.description,
    materials: product.materials ?? fallback?.materials,
    dimensions: product.dimensions ?? fallback?.dimensions,
    collection:
      product.category === "Porta-guardanapos" ? null : product.collection,
    category:
      (product as { category: string }).category === "Jogos Americanos"
        ? "Lugar Americano"
        : product.category,
  };
};
const mergeCatalog = (items: Product[]) => [
  ...items.map(normalizeProduct),
  ...FEATURED_PRODUCTS.filter(
    (featured) =>
      !items.some(
        (item) => item.id === featured.id || item.name === featured.name,
      ),
  ),
];

export function CatalogClient({
  print = false,
  initialProducts,
}: {
  print?: boolean;
  initialProducts?: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [collection, setCollection] = useState("");
  const [color, setColor] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("categoria");
    const collection = params.get("colecao");
    const query = params.get("busca");
    if (category && CATEGORIES.includes(category as Category)) {
      setFilter(category as Category);
    }
    if (collection) setCollection(collection);
    if (query) setSearch(query);
  }, []);
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }
    // Caso o componente seja instanciado sem initialProducts, busca da API dinâmica
    fetch("/api/produtos?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          // Converter do canonical para Product da UI se necessário ou usar diretamente
          setProducts(data.products.map((p: any) => ({
            id: p.sync_control?.catalog_product_id || p.id,
            name: p.general?.name || p.name,
            category: p.general?.category || p.category,
            sku: p.general?.sku || p.sku,
            tray_id: p.sync_control?.tray_product_id ?? p.tray_id ?? null,
            collection: p.general?.collection ?? p.collection ?? null,
            color_name: p.general?.color_name ?? p.color_name ?? null,
            color_hex: p.general?.color_hex ?? p.color_hex ?? null,
            retail_price: p.pricing?.price ?? p.retail_price ?? null,
            wholesale_price: p.pricing?.wholesale_price ?? p.wholesale_price ?? null,
            image_url: p.media?.images?.find((img: any) => img.is_cover)?.url_webp || p.media?.images?.[0]?.url_webp || p.media?.images?.[0]?.url || p.image_url || null,
            editorial_image_url: p.media?.images?.find((img: any) => !img.is_cover)?.url_webp || p.media?.images?.[1]?.url_webp || p.editorial_image_url || null,
            description: p.general?.short_description || p.general?.description || p.description || "",
            image_status: "final",
            sort_order: p.sort_order ?? 0,
            is_visible: p.general?.active ?? true,
            kit_quantity: p.kit_quantity ?? null,
            game_items: p.game_items,
            variations: p.variants,
          })));
        } else {
          setProducts(FEATURED_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(FEATURED_PRODUCTS);
        setLoading(false);
      });
  }, [initialProducts]);
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
          // Mais recentes: prioriza produtos mais novos cadastrados
          if (b.created_at && a.created_at) {
            const timeDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (timeDiff !== 0) return timeDiff;
          } else if (b.created_at) {
            return 1;
          } else if (a.created_at) {
            return -1;
          }
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
    filter === "Lugar Americano"
      ? "/produtos/dupla-face-rosa-bebe.webp"
      : filter === "Porta-guardanapos"
        ? "/produtos/laco-elegance.webp"
        : "/produtos/laco-charm.webp";

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
    <>
      <header className="catalog-nav catalog-header">
        <div className="catalog-header-inner">
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
        <MobileCatalogMenu
          products={products}
          categories={CATEGORIES}
          onSelect={chooseCollection}
        />
        </div>
      </header>
      <main className="catalog-shell">
      <CollectionHeader
        category={filter}
        collection={collection}
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
    </>
  );
}
