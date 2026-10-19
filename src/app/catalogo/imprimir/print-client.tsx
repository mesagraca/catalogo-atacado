"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type Product } from "@/types/catalog";

type PrintLayout = "grid-3" | "grid-2" | "single" | "list";
type PrintOrientation = "landscape" | "portrait";

interface PrintCatalogClientProps {
  products: Product[];
}

/**
 * Cliente interativo da página de impressão e exportação em PDF.
 * 
 * @description
 * Oferece controle completo de diagramação do catálogo para folhas A4 e PDFs:
 * 1. Escolha de orientação: Paisagem (Horizontal - Padrão) ou Retrato (Vertical)
 * 2. Escolha de layout: 3 por linha, 2 por linha, 1 por linha (lookbook) ou lista compacta
 * 3. Rotina de pré-carregamento de imagens para evitar falhas no preview de impressão
 * 4. Quebra de página controlada por categoria
 * 
 * @param {PrintCatalogClientProps} props - Lista de produtos do catálogo
 * @returns {JSX.Element} Visualização completa e interativa para impressão
 * @since v2.4.0
 * @category CatalogPrint
 */
export function PrintCatalogClient({ products }: PrintCatalogClientProps) {
  const [layout, setLayout] = useState<PrintLayout>("grid-3");
  const [orientation, setOrientation] = useState<PrintOrientation>("landscape");
  const [isPreloading, setIsPreloading] = useState(false);

  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const activeProducts = products.filter((p) => p.is_visible !== false);

  const handlePrint = async () => {
    setIsPreloading(true);

    // Pré-carregar todas as imagens no DOM antes de chamar window.print()
    const images = Array.from(document.querySelectorAll(".print-shell img")) as HTMLImageElement[];
    const promises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    await Promise.all(promises);
    setIsPreloading(false);

    // Pequeno atraso para garantir renderização do layout
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className={`print-page-wrapper layout-${layout} orientation-${orientation}`}>
      {/* Estilo dinâmico para a folha A4 e orientação de impressão */}
      <style jsx global>{`
        @page {
          size: ${orientation === "landscape" ? "A4 landscape" : "A4 portrait"};
          margin: 10mm 12mm;
        }
      `}</style>

      {/* Barra de controle em tela (oculta na impressão) */}
      <aside className="print-toolbar" aria-label="Ações e configurações de impressão">
        <div className="print-toolbar-inner">
          <Link href="/catalogo" className="print-back-link">
            ← Voltar ao catálogo online
          </Link>

          {/* Seletor de Orientação da Folha */}
          <div className="print-control-group">
            <span className="control-label">Orientação da folha:</span>
            <div className="control-pill-group">
              <button
                type="button"
                className={`control-pill ${orientation === "landscape" ? "active" : ""}`}
                onClick={() => setOrientation("landscape")}
                title="Folha na horizontal (Paisagem) - Padrão"
              >
                Horizontal (Paisagem)
              </button>
              <button
                type="button"
                className={`control-pill ${orientation === "portrait" ? "active" : ""}`}
                onClick={() => setOrientation("portrait")}
                title="Folha na vertical (Retrato)"
              >
                Vertical (Retrato)
              </button>
            </div>
          </div>

          {/* Seletor de Formato / Layout */}
          <div className="print-control-group">
            <span className="control-label">Layout:</span>
            <div className="control-pill-group">
              <button
                type="button"
                className={`control-pill ${layout === "grid-3" ? "active" : ""}`}
                onClick={() => setLayout("grid-3")}
                title="3 produtos por linha"
              >
                3 por linha
              </button>
              <button
                type="button"
                className={`control-pill ${layout === "grid-2" ? "active" : ""}`}
                onClick={() => setLayout("grid-2")}
                title="2 produtos por linha (fotos maiores)"
              >
                2 por linha
              </button>
              <button
                type="button"
                className={`control-pill ${layout === "single" ? "active" : ""}`}
                onClick={() => setLayout("single")}
                title="1 produto por linha (Ficha Lookbook)"
              >
                1 por linha
              </button>
              <button
                type="button"
                className={`control-pill ${layout === "list" ? "active" : ""}`}
                onClick={() => setLayout("list")}
                title="Lista compacta tipo tabela"
              >
                Lista
              </button>
            </div>
          </div>

          {/* Botão de Disparo */}
          <button
            type="button"
            className="print-action-btn"
            onClick={handlePrint}
            disabled={isPreloading}
          >
            {isPreloading ? "Carregando fotos..." : "🖨️ Salvar em PDF / Imprimir"}
          </button>
        </div>
      </aside>

      {/* Conteúdo do Catálogo Formatado */}
      <main className={`print-shell shell-${layout} shell-${orientation}`}>
        {/* Cabeçalho Institucional de Capa */}
        <header className="print-header">
          <div className="print-header-brand">
            <BrandLogo priority />
            <div>
              <h1>Catálogo Oficial de Atacado</h1>
              <p>Mesa Posta &amp; Decoração Premium</p>
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
              <div className={`print-product-grid layout-${layout}`}>
                {categoryProducts.map((p) => (
                  <ProductCard key={p.id} product={p} print />
                ))}
              </div>
            </section>
          );
        })}

        {/* Rodapé da Impressão */}
        <footer className="print-footer">
          <p>Mesa &amp; Graça — Comércio de Artigos de Mesa Posta e Decoração</p>
          <p>
            Preços e condições exclusivos para revendedores e compras no atacado.
            Disponibilidade sujeita à confirmação de estoque no momento do pedido.
          </p>
        </footer>
      </main>
    </div>
  );
}
