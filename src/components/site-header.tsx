"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, FEATURED_PRODUCTS } from "@/types/catalog";
import { BrandLogo } from "./brand-logo";
import { CollectionsMegaMenu } from "./collections-mega-menu";
import { ArrowUpRightIcon } from "./ui-icons";

export function SiteHeader() {
  const [search, setSearch] = useState("");
  const goToCatalog = () =>
    window.location.assign(
      `/catalogo${search.trim() ? `?busca=${encodeURIComponent(search.trim())}` : ""}`,
    );
  return (
    <header className="catalog-nav catalog-header">
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
        <Link href="/catalogo">Jogos americanos</Link>
        <Link href="/catalogo">Porta-guardanapos</Link>
        <CollectionsMegaMenu
          products={FEATURED_PRODUCTS}
          categories={CATEGORIES}
          onSelect={() => goToCatalog()}
        />
        <a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">
          Atendimento <ArrowUpRightIcon />
        </a>
      </nav>
    </header>
  );
}
