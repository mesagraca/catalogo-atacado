"use client";

import { useRef, useState } from "react";
import type { Category, Product } from "@/types/catalog";
import { ChevronDownIcon } from "./ui-icons";

export type CatalogMenuProps = {
  products: Product[];
  categories: readonly Category[];
  onSelect: (category: Category | "Todos", collection?: string) => void;
};

export function catalogMenuData(products: Product[], categories: readonly Category[]) {
  const productTypes = categories.map((category) => ({
    label: category,
    category,
    count: products.filter((item) => item.category === category).length,
  })).filter((item) => item.count);
  const collections = [...new Map(
    products.filter((item) => item.collection && item.collection !== "Porta-guardanapos")
      .map((item) => [item.collection!, item.category]),
  )].map(([label, category]) => ({ label, category }));
  return { productTypes, collections };
}

export function CollectionsMegaMenu({ products, categories, onSelect }: CatalogMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { productTypes, collections } = catalogMenuData(products, categories);
  const select = (category: Category | "Todos", collection?: string) => {
    onSelect(category, collection);
    setOpen(false);
  };

  return <div className="collections-mega-menu" ref={menuRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button type="button" className="mega-trigger" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)}>Coleções <ChevronDownIcon /></button>
    {open && <div className="mega-panel" role="menu">
      <div className="mega-intro"><div><span>Catálogo atacado</span><strong>Organizado para facilitar sua compra.</strong></div><button type="button" onClick={() => select("Todos")}>Ver todo o catálogo</button></div>
      <section className="mega-menu-group"><b>Mesa Posta</b><small>Por tipo de produto</small>{productTypes.map((item) => <button type="button" key={item.category} onClick={() => select(item.category)}>{item.label}<small>{item.count} produtos</small></button>)}</section>
      <section className="mega-menu-group"><b>Kits e Coleções</b><small>Por estilo e tema</small>{collections.map((item) => <button type="button" key={item.label} onClick={() => select(item.category, item.label)}>{item.label}<small>Ver coleção</small></button>)}</section>
    </div>}
  </div>;
}
