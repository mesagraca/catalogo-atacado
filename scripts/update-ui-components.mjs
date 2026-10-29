import fs from 'fs';

// 1. Update product-page-client.tsx
let pageClient = fs.readFileSync('src/components/product-page-client.tsx', 'utf8');

// Add materials and dimensions to mapped product if not already there
if (!pageClient.includes('materials: p.technical_specifications?.materials')) {
  pageClient = pageClient.replace(
    'description: p.general?.description || p.general?.short_description || "",',
    'description: p.general?.description || p.general?.short_description || p.description || "",\r\n            materials: p.technical_specifications?.materials || p.materials,\r\n            dimensions: p.technical_specifications?.dimensions || p.dimensions,'
  );
  if (!pageClient.includes('materials: p.technical_specifications?.materials')) {
    // Try LF
    pageClient = pageClient.replace(
      'description: p.general?.description || p.general?.short_description || "",',
      'description: p.general?.description || p.general?.short_description || p.description || "",\n            materials: p.technical_specifications?.materials || p.materials,\n            dimensions: p.technical_specifications?.dimensions || p.dimensions,'
    );
  }
}

// Add topline with SKU
if (!pageClient.includes('product-ref-code')) {
  pageClient = pageClient.replace(
    '<p className="eyebrow">{product.collection || product.category}</p>',
    '<div className="product-topline product-page-topline">\r\n            <p className="eyebrow">{product.collection || product.category}</p>\r\n            {(product.sku || product.id) && (\r\n              <span className="product-ref-code" title={`Código de referência: ${product.sku || product.id}`}>\r\n                REF: {product.sku ? product.sku.replace(/^MG-/, "") : product.id.slice(0, 8)}\r\n              </span>\r\n            )}\r\n          </div>'
  );
}

// Update game prices and single prices layout
const newPricesBlock = `          {product.game_items?.length ? (
            <section className="product-page-game-prices">
              <div className="game-prices-header">
                <span>Jogo completo · discriminação por peça</span>
                {product.wholesale_price != null && (
                  <div className="game-total-pill">
                    Total Atacado: <strong>{money(product.wholesale_price)}</strong>
                    {product.retail_price != null && (
                      <small> (Varejo: <s>{money(product.retail_price)}</s>)</small>
                    )}
                  </div>
                )}
              </div>
              <div className="game-items-table">
                {product.game_items.map((item) => (
                  <div className="game-item-row" key={item.label}>
                    <span className="game-item-label">{item.label}</span>
                    <div className="game-item-values">
                      {item.retail_price != null && (
                        <small className="game-item-retail">Varejo <s>{money(item.retail_price)}</s></small>
                      )}
                      <b className="game-item-wholesale">{money(item.wholesale_price)}</b>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="product-page-price">
              <div className="price-main-row">
                <div>
                  <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
                  <strong>{money(product.wholesale_price)}</strong>
                </div>
                {product.dimensions?.[0]?.value && (
                  <span className="product-page-size-badge" title="Tamanho / Medida">
                    {product.dimensions[0].value}
                  </span>
                )}
              </div>
              {product.retail_price != null && (
                <div className="price-comparison-row">
                  <small>
                    Varejo sugerido: <s>{money(product.retail_price)}</s>
                  </small>
                  {product.wholesale_price && product.retail_price > product.wholesale_price && (
                    <span className="discount-pill">
                      {Math.round((1 - product.wholesale_price / product.retail_price) * 100)}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>
          )}`;

pageClient = pageClient.replace(
  /\{product\.game_items\?\.length \? \([\s\S]*?<\/div>\s*\)\}/,
  newPricesBlock
);

fs.writeFileSync('src/components/product-page-client.tsx', pageClient, 'utf8');
console.log('Updated product-page-client.tsx');

// 2. Update product-card.tsx
let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');
if (!card.includes('card-size-badge')) {
  card = card.replace(
    /\{product\.retail_price != null && \([\s\S]*?<\/div>\s*\)\}/,
    (m) => `${m}\r\n            {product.dimensions?.[0]?.value && (\r\n              <div className="card-size-badge">\r\n                <span>{product.dimensions[0].value}</span>\r\n              </div>\r\n            )}`
  );
  fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
  console.log('Updated product-card.tsx');
} else {
  console.log('product-card.tsx already has card-size-badge');
}

// 3. Append CSS to globals.css if not already present
let css = fs.readFileSync('src/app/globals.css', 'utf8');
if (!css.includes('.product-ref-code {')) {
  const customCss = `
/* --- Wholesale Catalog Enhancements: SKU, Sizes & Game Items --- */
.product-topline, .product-page-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.product-ref-code {
  color: var(--muted);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  background: var(--soft);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--line);
}
.product-page-size-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--clay);
  background: rgba(178, 90, 61, 0.08);
  border: 1px solid rgba(178, 90, 61, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}
.card-size-badge {
  margin-top: 0.35rem;
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--muted);
  background: var(--soft);
  padding: 0.12rem 0.45rem;
  border-radius: 4px;
  width: fit-content;
}
.price-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.price-comparison-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.35rem;
  color: var(--muted);
}
.discount-pill {
  font-size: 0.68rem;
  font-weight: 700;
  color: #1b633e;
  background: #e8f5e9;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.game-prices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}
.game-total-pill {
  font-size: 0.75rem;
  background: var(--soft);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--line);
}
.game-total-pill strong {
  color: #1b633e;
  font-size: 0.85rem;
}
.game-items-table {
  display: grid;
  gap: 0.45rem;
}
.game-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.4rem 0.6rem;
  background: var(--cream);
  border-radius: 6px;
  border: 1px solid var(--line);
  font-size: 0.82rem;
}
.game-item-label {
  font-weight: 500;
}
.game-item-values {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.game-item-retail {
  color: var(--muted);
  font-size: 0.72rem;
}
.game-item-wholesale {
  color: #1b633e;
  font-size: 0.9rem;
}
`;
  css += customCss;
  fs.writeFileSync('src/app/globals.css', css, 'utf8');
  console.log('Appended custom styles to globals.css');
}
