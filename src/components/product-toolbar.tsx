"use client";

import type { Category } from "@/types/catalog";

export type PriceRange = "all" | "up-to-10" | "10-to-15" | "over-15";
export type SortOrder = "featured" | "name" | "price-low" | "price-high";
export type ViewMode = "grid" | "list";

type Props = {
  categories: readonly Category[];
  collections: string[];
  colors: string[];
  category: "Todos" | Category;
  collection: string;
  color: string;
  priceRange: PriceRange;
  sort: SortOrder;
  view: ViewMode;
  activeFilterCount: number;
  onCategory: (value: "Todos" | Category) => void;
  onCollection: (value: string) => void;
  onColor: (value: string) => void;
  onPriceRange: (value: PriceRange) => void;
  onSort: (value: SortOrder) => void;
  onView: (value: ViewMode) => void;
  onClear: () => void;
};

export type SidebarProps = Props & { open: boolean; onToggle: () => void };

function FilterFields(props: Props) {
  return <div className="filter-fields">
    <label><span>Categoria</span><select value={props.category} onChange={event => props.onCategory(event.target.value as "Todos" | Category)}><option value="Todos">Todas as categorias</option>{props.categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    <label><span>Coleção</span><select value={props.collection} onChange={event => props.onCollection(event.target.value)}><option value="">Todas as coleções</option>{props.collections.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    {props.colors.length > 0 && <label><span>Cor</span><select value={props.color} onChange={event => props.onColor(event.target.value)}><option value="">Todas as cores</option>{props.colors.map(item => <option key={item} value={item}>{item}</option>)}</select></label>}
    <label><span>Preço atacado</span><select value={props.priceRange} onChange={event => props.onPriceRange(event.target.value as PriceRange)}><option value="all">Todos os preços</option><option value="up-to-10">Até R$ 10</option><option value="10-to-15">De R$ 10 a R$ 15</option><option value="over-15">Acima de R$ 15</option></select></label>
  </div>;
}

export function ProductToolbar(props: Props) {
  return <section className="product-toolbar" aria-label="Ferramentas do catálogo">
    <div className="toolbar-desktop"><div className="toolbar-actions"><label className="sort-select"><span>Ordenar</span><select value={props.sort} onChange={event => props.onSort(event.target.value as SortOrder)}><option value="featured">Ordem do catálogo</option><option value="name">Nome: A a Z</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select></label><div className="view-switch" aria-label="Modo de visualização"><button className={props.view === "grid" ? "active" : ""} onClick={() => props.onView("grid")} aria-label="Visualizar em grade">▦</button><button className={props.view === "list" ? "active" : ""} onClick={() => props.onView("list")} aria-label="Visualizar em lista">☷</button></div></div></div>
    <details className="toolbar-mobile"><summary>Filtrar{props.activeFilterCount > 0 && <b>{props.activeFilterCount}</b>}</summary><div className="mobile-filter-panel"><FilterFields {...props} /><div><button className="text-button" onClick={props.onClear}>Limpar filtros</button><button className="apply-button" onClick={event => (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open")}>Ver produtos</button></div></div></details><label className="mobile-sort"><span>Ordenar</span><select value={props.sort} onChange={event => props.onSort(event.target.value as SortOrder)}><option value="featured">Mais relevantes</option><option value="name">Nome: A a Z</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select></label>
    {props.activeFilterCount > 0 && <button className="clear-filters" onClick={props.onClear}>Limpar filtros</button>}
  </section>;
}

export function ProductSidebar({ open, onToggle, ...props }: SidebarProps) {
  return <aside className={`product-sidebar ${open ? "open" : "closed"}`} aria-label="Filtros do catálogo">
    <button className="sidebar-toggle" onClick={onToggle} aria-expanded={open}>{open ? "Ocultar filtros" : "Mostrar filtros"}<span aria-hidden="true">{open ? "←" : "→"}</span></button>
    {open && <div className="sidebar-content"><div className="sidebar-heading"><p>Filtrar por</p>{props.activeFilterCount > 0 && <button onClick={props.onClear}>Limpar</button>}</div><FilterFields {...props} /></div>}
  </aside>;
}
