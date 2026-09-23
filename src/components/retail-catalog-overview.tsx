import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { SiteFooter } from "./site-footer";
import { RetailOperations } from "./retail-operations";
import { RetailCatalogGrid } from "./retail-catalog-grid";
import { RetailCatalogHealth } from "./retail-catalog-health";
import { getRetailCatalogCards } from "@/lib/retail-catalog";

const nextSteps = [
  ["Base mestre", "253 produtos com SKU, imagens, atributos e categorias."],
  ["Estoque", "Saldo por SKU e movimentações auditáveis, sem número duplicado em kit."],
  ["Kits", "Disponibilidade calculada pelos componentes ou estoque próprio quando fechado."],
  ["Exportação Tray", "Arquivo XLS derivado e atualizável a partir da base validada."],
];

export async function RetailCatalogOverview() {
  const catalog = await getRetailCatalogCards();
  return (
    <>
      <header className="catalog-nav catalog-header">
        <div className="catalog-header-inner">
          <Link className="wordmark" href="/" aria-label="Mesa & Graça">
            <BrandLogo priority />
          </Link>
          <div className="retail-header-title">
            <span>ÁREA INTERNA</span>
            <strong>Catálogo de varejo</strong>
          </div>
          <nav aria-label="Navegação do catálogo de varejo">
            <Link href="/catalogo">Ver atacado</Link>
          </nav>
        </div>
      </header>
      <main className="retail-shell">
        <section className="retail-hero">
          <p className="eyebrow">BASE MESTRE MESA &amp; GRAÇA</p>
          <h1>Varejo completo,<br />estoque sem conflito.</h1>
          <p>
            Esta área está preparada para receber o catálogo completo. Produtos
            avulsos terão saldo próprio; kits usarão a composição para calcular
            a disponibilidade real.
          </p>
        </section>
        <section className="retail-roadmap" aria-label="Estrutura do catálogo de varejo">
          {nextSteps.map(([title, description]) => (
            <article key={title}>
              <span>EM ESTRUTURAÇÃO</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>
        <section className="retail-import-note">
          <p className="eyebrow">PRÓXIMA ETAPA</p>
          <h2>Importar, validar e publicar por canal.</h2>
          <p>
            O catálogo atacado permanece separado do varejo. Cada produto será
            publicado em varejo, atacado ou nos dois canais, sem duplicar SKU
            nem estoque.
          </p>
        </section>
        <RetailOperations />
        {catalog.configured && catalog.products.length > 0 && <RetailCatalogHealth products={catalog.products} />}
        {catalog.configured && catalog.products.length > 0 && <RetailCatalogGrid products={catalog.products} />}
      </main>
      <SiteFooter />
    </>
  );
}
