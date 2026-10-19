"use client";

import Link from "next/link";

interface CollectionHeaderProps {
  category?: string;
  collection?: string;
  title?: string;
  imageUrl: string;
}

/**
 * Banner contextual do catálogo Mesa & Graça.
 * 
 * @description
 * Renderiza o breadcrumb e hero banner editorial sem repetições de texto.
 * Adapta dinamicamente o título e a sobrelinha (eyebrow) de acordo com
 * a categoria e coleção selecionadas pelo usuário.
 * 
 * @param {CollectionHeaderProps} props - Propriedades de cabeçalho e imagem de fundo
 * @returns {JSX.Element} Seção de cabeçalho com navegação estrutural e hero
 * @since v2.4.0
 * @category CatalogUI
 */
export function CollectionHeader({
  category,
  collection,
  title,
  imageUrl,
}: CollectionHeaderProps) {
  const isAll = !category || category === "Todos";
  const displayTitle = collection || (isAll ? "Catálogo de Atacado" : (title || category));
  const eyebrow = collection
    ? "Coleção Exclusiva"
    : isAll
      ? "Mesa Posta & Decoração"
      : "Linha Atacado";

  return (
    <section className="collection-header">
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <Link href="/catalogo">Catálogo</Link>
        {!isAll && (
          <>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </>
        )}
        {collection && (
          <>
            <span aria-hidden="true">/</span>
            <span>{collection}</span>
          </>
        )}
      </nav>
      <div
        className="collection-hero"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{displayTitle}</h1>
        </div>
      </div>
    </section>
  );
}
