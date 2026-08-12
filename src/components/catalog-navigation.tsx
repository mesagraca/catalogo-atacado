"use client";

import type { Category } from "@/types/catalog";

type Props = {
  categories: readonly Category[];
  collections: string[];
  activeCategory: "Todos" | Category;
  activeCollection: string;
  categoryCounts: Record<Category, number>;
  onCategory: (category: "Todos" | Category) => void;
  onCollection: (collection: string) => void;
};

export function CatalogNavigation({ categories, collections, activeCategory, activeCollection, categoryCounts, onCategory, onCollection }: Props) {
  return <nav className="catalog-discovery" aria-label="Navegar pelo catálogo">
    <div className="discovery-group"><span>Comprar por categoria</span><div>{(["Todos", ...categories] as const).map(category => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => onCategory(category)}>{category === "Todos" ? "Tudo" : category}<small>{category === "Todos" ? categoryCounts[categories[0]] + categoryCounts[categories[1]] : categoryCounts[category]}</small></button>)}</div></div>
    {collections.length > 0 && <div className="discovery-group collections-group"><span>Comprar por coleção</span><div>{collections.map(item => <button key={item} className={activeCollection === item ? "active" : ""} onClick={() => onCollection(activeCollection === item ? "" : item)}>{item}</button>)}</div></div>}
  </nav>;
}
