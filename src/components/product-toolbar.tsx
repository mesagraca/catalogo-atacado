"use client";

import type { Category } from "@/types/catalog";
import { ChevronDownIcon, MinusIcon, PlusIcon } from "./ui-icons";

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

const sortLabels: Record<SortOrder, string> = { featured: "Ordem do catálogo", name: "Nome: A a Z", "price-low": "Menor preço", "price-high": "Maior preço" };

function SortMenu({ sort, onSort }: Pick<Props, "sort" | "onSort">) {
  return <details className="sort-menu"><summary><span>Ordenar</span><strong>{sortLabels[sort]}</strong><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg></summary><div className="sort-options">{(Object.keys(sortLabels) as SortOrder[]).map(option => <button key={option} className={sort === option ? "active" : ""} onClick={event => { onSort(option); (event.currentTarget.closest("details") as HTMLDetailsElement).removeAttribute("open"); }}>{sortLabels[option]}{sort === option && <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>}</button>)}</div></details>
}

export function ProductToolbar(props: Props) {
  return <section className="product-toolbar" aria-label="Ferramentas do catálogo">
    <div className="toolbar-desktop"><div className="toolbar-actions"><SortMenu sort={props.sort} onSort={props.onSort} /><div className="view-switch" aria-label="Modo de visualização"><button className={props.view === "grid" ? "active" : ""} onClick={() => props.onView("grid")} aria-label="Visualizar em grade"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg></button><button className={props.view === "list" ? "active" : ""} onClick={() => props.onView("list")} aria-label="Visualizar em lista"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" /><circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" /></svg></button></div></div></div>
    <details className="toolbar-mobile"><summary>Filtrar{props.activeFilterCount > 0 && <b>{props.activeFilterCount}</b>}</summary><div className="mobile-filter-panel"><FilterFields {...props} /><div><button className="text-button" onClick={props.onClear}>Limpar filtros</button><button className="apply-button" onClick={event => (event.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open")}>Ver produtos</button></div></div></details><label className="mobile-sort"><span>Ordenar</span><select value={props.sort} onChange={event => props.onSort(event.target.value as SortOrder)}><option value="featured">Mais relevantes</option><option value="name">Nome: A a Z</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select></label>
    {props.activeFilterCount > 0 && <button className="clear-filters" onClick={props.onClear}>Limpar filtros</button>}
  </section>;
}

export function ProductSidebar({ open, onToggle, ...props }: SidebarProps) {
  const activePrice = props.priceRange === "all" ? "Todos os preços" : props.priceRange === "up-to-10" ? "Até R$ 10" : props.priceRange === "10-to-15" ? "R$ 10 — R$ 15" : "Acima de R$ 15";
  return <aside className={`product-sidebar ${open ? "open" : "closed"}`} aria-label="Filtros do catálogo">
    <button className="sidebar-toggle" onClick={onToggle} aria-expanded={open}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /><circle cx="9" cy="7" r="1.7" fill="var(--cream)" /><circle cx="15" cy="12" r="1.7" fill="var(--cream)" /><circle cx="11" cy="17" r="1.7" fill="var(--cream)" /></svg><span>{open ? "Filtros" : "Mostrar filtros"}</span>{open ? <MinusIcon /> : <PlusIcon />}</button>
    {open && <div className="sidebar-content"><div className="sidebar-heading"><p>Encontre sua peça</p>{props.activeFilterCount > 0 && <button onClick={props.onClear}>Limpar tudo</button>}</div><details className="filter-group" open><summary>Categoria <ChevronDownIcon /></summary><div className="filter-options"><button className={props.category === "Todos" ? "active" : ""} onClick={() => props.onCategory("Todos")}>Todos os produtos</button>{props.categories.map(item => <button className={props.category === item ? "active" : ""} onClick={() => props.onCategory(item)} key={item}>{item}</button>)}</div></details><details className="filter-group" open><summary>Coleção <ChevronDownIcon /></summary><div className="filter-options"> <button className={!props.collection ? "active" : ""} onClick={() => props.onCollection("")}>Todas as coleções</button>{props.collections.map(item => <button className={props.collection === item ? "active" : ""} onClick={() => props.onCollection(item)} key={item}>{item}</button>)}</div></details>{props.colors.length > 0 && <details className="filter-group"><summary>Cor <ChevronDownIcon /></summary><div className="filter-options color-options"><button className={!props.color ? "active" : ""} onClick={() => props.onColor("")}>Todas as cores</button>{props.colors.map(item => <button className={props.color === item ? "active" : ""} onClick={() => props.onColor(item)} key={item}>{item}</button>)}</div></details>}<details className="filter-group" open><summary>Preço atacado <ChevronDownIcon /></summary><div className="filter-options"><button className={props.priceRange === "all" ? "active" : ""} onClick={() => props.onPriceRange("all")}>Todos os preços</button><button className={props.priceRange === "up-to-10" ? "active" : ""} onClick={() => props.onPriceRange("up-to-10")}>Até R$ 10</button><button className={props.priceRange === "10-to-15" ? "active" : ""} onClick={() => props.onPriceRange("10-to-15")}>R$ 10 — R$ 15</button><button className={props.priceRange === "over-15" ? "active" : ""} onClick={() => props.onPriceRange("over-15")}>Acima de R$ 15</button></div></details><p className="sidebar-selection">{props.activeFilterCount > 0 ? `${props.activeFilterCount} filtro${props.activeFilterCount > 1 ? "s" : ""} aplicado${props.activeFilterCount > 1 ? "s" : ""}` : `Exibindo: ${activePrice}`}</p></div>}
  </aside>;
}
