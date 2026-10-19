"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type Product } from "@/types/catalog";

interface PrintCatalogClientProps {
  products: Product[];
}

/**
 * Cliente da página de catálogo para impressão e exportação em PDF.
 * 
 * @description
 * Apresenta a visualização limpa do catálogo Mesa & Graça otimizada para folhas A4 e PDFs:
 * 1. Barra de ferramentas em tela (oculta na impressão) com atalhos de retorno e comando de impressão
 * 2. Cabeçalho institucional com marca, dados de contato e data de emissão
 * 3. Grade de 3 colunas por categoria com quebra de página controlada
 * 4. Rodapé comercial com regras e observações para revendedores
 * 
 * @param {PrintCatalogClientProps} props - Lista de produtos canônicos do catálogo
 * @returns {JSX.Element} Visualização completa para impressão
 * @since v2.4.0
 * @category CatalogPrint
 */
export function PrintCatalogClient({ products }: PrintCatalogClientProps) {
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const activeProducts = products.filter((p) => p.is_visible !== false);

  return (
    <div className="print-page-wrapper">
      {/* Barra de controle em tela (oculta na impressão) */}
      <aside className="print-toolbar" aria-label="Ações de impressão">
        <div className="print-toolbar-inner">
          <Link href="/catalogo" className="print-back-link">
            ← Voltar ao catálogo online
          </Link>
          <div className="print-toolbar-center">
            <span>Visualização Otimizada para PDF / Impressão A4</span>
          </div>
          <button
            type="button"
            className="print-action-btn"
            onClick={() => window.print()}
          >
            🖨️ Salvar em PDF / Imprimir
          </button>
        </div>
      </aside>

      {/* Conteúdo do Catálogo Formatado */}
      <main className="print-shell">
        {/* Cabeçalho Institucional de Capa */}
        <header className="print-header">
          <div className="print-header-brand">
            <BrandLogo priority />
            <div>
              <h1>Catálogo Oficial de Atacado</h1>
              <p>Mesa Posta & Decoração Premium</p>
            </div>
          </div>
          <div className="print-header-info">
            <p>
              <strong>Emissão:</strong> {currentDate}
            </p>
            <p>
              <strong>Atendimento Comercial:</strong> (11) 97700-7234
            </p>
            <p>
              <strong>Site Oficial:</strong> mesaegraca.com.br
            </p>
          </div>
        </header>

        {/* Listagem de Produtos Agrupados por Categoria */}
        {CATEGORIES.map((category) => {
          const categoryProducts = activeProducts.filter(
            (p) => p.category === category
          );
          if (categoryProducts.length === 0) return null;

          return (
            <section className="print-category-section" key={category}>
              <div className="print-category-heading">
                <h2>{category}</h2>
                <span>{categoryProducts.length} itens</span>
              </div>
              <div className="print-product-grid">
                {categoryProducts.map((p) => (
                  <ProductCard key={p.id} product={p} print />
                ))}
              </div>
            </section>
          );
        })}

        {/* Rodapé da Impressão */}
        <footer className="print-footer">
          <p>Mesa & Graça — Comércio de Artigos de Mesa Posta e Decoração</p>
          <p>
            Preços e condições exclusivos para revendedores e compras no atacado.
            Disponibilidade sujeita à confirmação de estoque no momento do pedido.
          </p>
        </footer>
      </main>
    </div>
  );
}
