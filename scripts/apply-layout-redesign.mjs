import fs from 'fs';

// 1. Update product-card.tsx
let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');

// A. Kit items: add retail price to the left of wholesale
const oldKitItems = `<div className="game-price-list" aria-label="Valores por item do jogo">
            <span>Jogo completo · preços por item</span>
            {product.game_items!.map((item) => (
              <p key={item.label}>
                <small>{item.label.replace(/\\s*\\(.*?\\)/, \"\").trim()}</small>
                <b>{money(item.wholesale_price)}</b>
              </p>
            ))}
          </div>`;

const newKitItems = `<div className="game-price-list" aria-label="Valores por item do jogo">
            <span>Jogo completo · preços por item</span>
            {product.game_items!.map((item) => (
              <p key={item.label}>
                <small>{item.label.replace(/\\s*\\(.*?\\)/, \"\").trim()}</small>
                <span className="game-item-card-prices">
                  {item.retail_price != null && (
                    <s className="game-item-card-retail">{money(item.retail_price)}</s>
                  )}
                  <b>{money(item.wholesale_price)}</b>
                </span>
              </p>
            ))}
          </div>`;

card = card.replace(
  /<div className="game-price-list" aria-label="Valores por item do jogo">[\s\S]*?<\/div>/,
  newKitItems
);

// B. Single product commerce: two columns in two lines + discount pill next to wholesale
const newProductCommerce = `<div className="product-commerce">
            <div className="commerce-wholesale-box">
              <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
              <div className="wholesale-price-row">
                <strong>{money(product.wholesale_price)}</strong>
                {discount != null && <b className="discount-pill">{discount}% OFF</b>}
              </div>
            </div>
            {product.retail_price != null && (
              <div className="commerce-retail-box">
                <span>Preço varejo</span>
                <s className="retail-price-val">{money(product.retail_price)}</s>
              </div>
            )}
          </div>`;

card = card.replace(
  /<div className="product-commerce">[\s\S]*?<\/div>\s*<\/div>/,
  newProductCommerce
);

fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
console.log('Updated product-card.tsx');

// 2. Update product-page-client.tsx
let page = fs.readFileSync('src/components/product-page-client.tsx', 'utf8');

// Move SKU below title
const oldHeaderRegex = /<section className="product-page-info">\s*<div className="product-topline product-page-topline">\s*<p className="eyebrow">\{product\.collection \|\| product\.category\}<\/p>\s*\{\(product\.sku \|\| product\.id\) && \([\s\S]*?REF:[\s\S]*?<\/span>\s*\)\}\s*<\/div>\s*<h1>\{product\.name\}<\/h1>/;

const newHeader = `<section className="product-page-info">
          <p className="eyebrow">{product.collection || product.category}</p>
          <h1>{product.name}</h1>
          {(product.sku || product.id) && (
            <div className="product-page-sku-wrapper">
              <span className="product-ref-code" title={\`Código de referência: \${product.sku || product.id}\`}>
                REF: {product.sku ? product.sku.replace(/^MG-/, "") : product.id.slice(0, 8)}
              </span>
            </div>
          )}`;

page = page.replace(oldHeaderRegex, newHeader);

// Update single price block on product page: discount pill to the right of wholesale price
const oldSinglePriceRegex = /<div className="product-page-price">\s*<div className="price-main-row">\s*<div>\s*<span>\{product\.wholesale_price == null \? "Preço" : product\.kit_quantity \? "Atacado por unidade" : "Preço atacado"\}<\/span>\s*<strong>\{money\(product\.wholesale_price\)\}<\/strong>\s*<\/div>\s*<\/div>\s*\{product\.retail_price != null && \([\s\S]*?Preço varejo:[\s\S]*?<\/div>\s*\)\}\s*<\/div>/;

const newSinglePrice = `<div className="product-page-price">
              <div className="price-main-row">
                <div>
                  <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
                  <div className="wholesale-price-row">
                    <strong>{money(product.wholesale_price)}</strong>
                    {product.wholesale_price && product.retail_price && product.retail_price > product.wholesale_price && (
                      <span className="discount-pill">
                        {Math.round((1 - product.wholesale_price / product.retail_price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {product.retail_price != null && (
                <div className="price-comparison-row">
                  <small>
                    Preço varejo: <s>{money(product.retail_price)}</s>
                  </small>
                </div>
              )}
            </div>`;

page = page.replace(oldSinglePriceRegex, newSinglePrice);

fs.writeFileSync('src/components/product-page-client.tsx', page, 'utf8');
console.log('Updated product-page-client.tsx');

// 3. Update globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const updatedStyles = `
/* --- Wholesale Redesign: Two-row prices, matching palette & SKU subtitle --- */
.wholesale-price-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.discount-pill {
  font-size: 0.6rem;
  font-weight: 700;
  color: #a94437;
  background: #f5ddd8;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.commerce-wholesale-box {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.commerce-retail-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  text-align: right;
}
.commerce-retail-box span {
  color: var(--muted);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.commerce-retail-box .retail-price-val {
  color: #a04d40;
  text-decoration-color: #c13e36;
  text-decoration-thickness: 1.5px;
  font-size: 0.92rem;
  font-weight: 600;
}
.price-comparison-row small {
  color: #a04d40;
  font-size: 0.85rem;
  font-weight: 600;
}
.price-comparison-row s {
  color: #b14d40;
  text-decoration-color: #c13e36;
  text-decoration-thickness: 1.5px;
}
.game-item-card-prices {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.game-item-card-retail {
  color: #a04d40;
  text-decoration-color: #c13e36;
  text-decoration-thickness: 1.2px;
  font-size: 0.72rem;
  font-weight: 600;
}
.product-page-sku-wrapper {
  margin: 0.4rem 0 0.95rem;
}
`;

css += updatedStyles;
fs.writeFileSync('src/app/globals.css', css, 'utf8');
console.log('Appended updated styles to globals.css');
