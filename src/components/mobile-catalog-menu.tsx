"use client";

import { useState } from "react";
import type { Category, Product } from "@/types/catalog";
import { WhatsAppIcon } from "./ui-icons";

type Props = {
  products: Product[];
  categories: readonly Category[];
  onSelect: (category: Category | "Todos", collection?: string) => void;
};

export function MobileCatalogMenu({ products, categories, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const groups = categories.map((category) => ({
    category,
    collections: [...new Set(products.filter((item) => item.category === category).map((item) => item.collection).filter(Boolean))] as string[],
  })).filter((group) => group.collections.length);
  const select = (category: Category | "Todos", collection?: string) => {
    onSelect(category, collection);
    setOpen(false);
  };

  return <div className="mobile-catalog-menu"><button type="button" className="mobile-menu-trigger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)}><i /><i /><i /></button>{open && <div className="mobile-menu-layer" role="dialog" aria-modal="true"><button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} /><aside className="mobile-menu-sheet"><div className="mobile-menu-heading"><span>Menu</span><button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}>×</button></div><button type="button" className="mobile-menu-all" onClick={() => select("Todos")}>Ver todo o catálogo</button>{groups.map((group) => <section key={group.category}><b>{group.category}</b>{group.collections.map((collection) => <button type="button" key={collection} onClick={() => select(group.category, collection)}>{collection}</button>)}</section>)}<a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">Atendimento <WhatsAppIcon /></a></aside></div>}</div>;
}
