import type { RetailCatalogCard } from "@/lib/retail-catalog";

export function RetailCatalogHealth({ products }: { products: RetailCatalogCard[] }) {
  const indicators = [
    { label: "SKUs publicados", value: products.length, tone: "ready" },
    { label: "Sem foto canônica", value: products.filter((product) => !product.imageUrl).length, tone: "attention" },
    { label: "Sem preço varejo", value: products.filter((product) => product.retailListPrice == null).length, tone: "attention" },
    { label: "Estoque baixo", value: products.filter((product) => product.kind === "single" && product.minimumStock > 0 && product.stock <= product.minimumStock).length, tone: "risk" },
    { label: "Kits sem composição", value: products.filter((product) => product.kind === "kit" && !product.components.length).length, tone: "risk" },
  ];

  return (
    <section className="retail-health" aria-labelledby="retail-health-title">
      <div>
        <p className="eyebrow">QUALIDADE DO CATÁLOGO</p>
        <h2 id="retail-health-title">Pendências que impedem a operação.</h2>
      </div>
      <div className="retail-health-grid">
        {indicators.map((indicator) => (
          <article className={indicator.tone} key={indicator.label}>
            <strong>{indicator.value}</strong>
            <span>{indicator.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
