"use client";

import { useRef, useState } from "react";
import type { Category, Product } from "@/types/catalog";
import { ChevronDownIcon } from "./ui-icons";

type Props = {
  products: Product[];
  categories: readonly Category[];
  onSelect: (category: Category | "Todos", collection?: string) => void;
};

export function CollectionsMegaMenu({ products, categories, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const groups = categories
    .map((category) => ({
      category,
      collections: [
        ...new Set(
          products
            .filter((product) => product.category === category)
            .map((product) => product.collection)
            .filter(Boolean),
        ),
      ] as string[],
    }))
    .filter((group) => group.collections.length);
  const select = (category: Category | "Todos", collection?: string) => {
    onSelect(category, collection);
    setOpen(false);
  };

  return (
    <div
      className="collections-mega-menu"
      ref={menuRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="mega-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        Coleções <ChevronDownIcon />
      </button>
      {open && (
        <div className="mega-panel" role="menu">
          <div className="mega-intro">
            <div>
              <span>Explore o catálogo</span>
              <strong>Encontre a peça ideal para sua mesa.</strong>
            </div>
            <button type="button" onClick={() => select("Todos")}>Ver todo o catálogo</button>
          </div>
          {groups.map((group) => (
            <section key={group.category}>
              <b>{group.category}</b>
              {group.collections.map((collection) => (
                <button
                  type="button"
                  key={collection}
                  onClick={() => select(group.category, collection)}
                >
                  {collection}<small>Ver coleção</small>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
