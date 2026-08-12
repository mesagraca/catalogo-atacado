"use client";

import type { Category, Product } from "@/types/catalog";
import { ChevronDownIcon } from "./ui-icons";

type Props = { products: Product[]; categories: readonly Category[]; onSelect: (category: Category | "Todos", collection?: string) => void };

export function CollectionsMegaMenu({ products, categories, onSelect }: Props) {
  const groups = categories.map(category => ({ category, collections: [...new Set(products.filter(product => product.category === category).map(product => product.collection).filter(Boolean))] as string[] })).filter(group => group.collections.length);
  return <details className="collections-mega-menu"><summary>Coleções <ChevronDownIcon /></summary><div className="mega-panel"><div className="mega-intro"><span>Explore o catálogo</span><strong>Peças para compor<br />uma mesa especial.</strong><button onClick={() => { onSelect("Todos"); (document.activeElement?.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open"); }}>Ver todos os produtos</button></div>{groups.map(group => <section key={group.category}><b>{group.category}</b>{group.collections.map(collection => <button key={collection} onClick={event => { onSelect(group.category, collection); (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open"); }}>{collection}<small>Ver coleção</small></button>)}</section>)}</div></details>;
}
