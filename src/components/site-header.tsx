"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, FEATURED_PRODUCTS } from "@/types/catalog";
import { BrandLogo } from "./brand-logo";
import { CollectionsMegaMenu } from "./collections-mega-menu";
import { MobileCatalogMenu } from "./mobile-catalog-menu";
import { WhatsAppIcon } from "./ui-icons";

import type { Product } from "@/types/catalog";

export function SiteHeader({ products }: { products?: Product[] } = {}) {
  const [search, setSearch] = useState("");
  const catalogList = products && products.length > 0 ? products : FEATURED_PRODUCTS;
  const goToCatalog = () =>
    window.location.assign(
      `/catalogo${search.trim() ? `?busca=${encodeURIComponent(search.trim())}` : ""}`,
    );
  return (
    <header className="catalog-nav catalog-header">
      <div className="catalog-header-inner">
      <Link className="wordmark" href="/catalogo" aria-label="Mesa & Graça">
        <BrandLogo priority />
      </Link>
      <label className="header-search">
        <span aria-hidden="true">⌕</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") goToCatalog();
          }}
          placeholder="Buscar produtos, coleções ou cores"
          aria-label="Buscar produtos"
        />
      </label>
      <nav aria-label="Navegação principal">
        <CollectionsMegaMenu
          products={catalogList}
          categories={CATEGORIES}
          onSelect={(category, collection) =>
            window.location.assign(
              `/catalogo?${new URLSearchParams({
                ...(category !== "Todos" ? { categoria: category } : {}),
                ...(collection ? { colecao: collection } : {}),
              }).toString()}`,
            )
          }
        />
        <a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">
          Atendimento <WhatsAppIcon />
        </a>
      </nav>
      <MobileCatalogMenu
        products={catalogList}
        categories={CATEGORIES}
        onSelect={(category, collection) =>
          window.location.assign(
            `/catalogo?${new URLSearchParams({
              ...(category !== "Todos" ? { categoria: category } : {}),
              ...(collection ? { colecao: collection } : {}),
            }).toString()}`,
          )
        }
      />
      </div>
    </header>
  );
}
