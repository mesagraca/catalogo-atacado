"use client";

import { useState } from "react";
import type { Category, Product } from "@/types/catalog";
import { catalogMenuData } from "./collections-mega-menu";
import { WhatsAppIcon } from "./ui-icons";

type Props = {
  products: Product[];
  categories: readonly Category[];
  onSelect: (category: Category | "Todos", collection?: string) => void;
};

export function MobileCatalogMenu({ products, categories, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const { productTypes, collections } = catalogMenuData(products, categories);
  const select = (category: Category | "Todos", collection?: string) => {
    onSelect(category, collection);
    setOpen(false);
  };

  return <div className="mobile-catalog-menu"><button type="button" className="mobile-menu-trigger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)}><i /><i /><i /></button>{open && <div className="mobile-menu-layer" role="dialog" aria-modal="true"><button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} /><aside className="mobile-menu-sheet"><div className="mobile-menu-heading"><span>Menu</span><button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}>×</button></div><button type="button" className="mobile-menu-all" onClick={() => select("Todos")}>Ver todo o catálogo</button><section><b>Mesa Posta</b><small>Por tipo de produto</small>{productTypes.map((item) => <button type="button" key={item.category} onClick={() => select(item.category)}>{item.label}</button>)}</section><section><b>Kits e Coleções</b><small>Por estilo e tema</small>{collections.map((item) => <button type="button" key={item.label} onClick={() => select(item.category, item.label)}>{item.label}</button>)}</section><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">Atendimento <WhatsAppIcon /></a></aside></div>}</div>;
}
