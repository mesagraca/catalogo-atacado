import fs from 'fs';

let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');

const target1 = `              <p key={item.label}>
                <small>{item.label.replace(/\\s*\\(.*?\\)/, "").trim()}</small>
                <b>{money(item.wholesale_price)}</b>
              </p>`;

const replace1 = `              <p key={item.label}>
                <small>{item.label.replace(/\\s*\\(.*?\\)/, "").trim()}</small>
                <span className="game-item-card-prices">
                  {item.retail_price != null && (
                    <s className="game-item-card-retail">{money(item.retail_price)}</s>
                  )}
                  <b>{money(item.wholesale_price)}</b>
                </span>
              </p>`;

const target2 = `          <div className="product-commerce">
            <div>
              <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
              <strong>{money(product.wholesale_price)}</strong>
            </div>
            {product.retail_price != null && (
              <div className="price-comparison">
                <small>
                  Varejo <s>{money(product.retail_price)}</s>
                </small>
                {discount != null && <b>{discount}% OFF</b>}
              </div>
            )}
          </div>`;

const replace2 = `          <div className="product-commerce">
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

function applyReplace(content, target, replacement) {
  const normTargetCRLF = target.replace(/\r?\n/g, '\r\n');
  const normTargetLF = target.replace(/\r?\n/g, '\n');
  const normRepCRLF = replacement.replace(/\r?\n/g, '\r\n');
  const normRepLF = replacement.replace(/\r?\n/g, '\n');

  if (content.includes(normTargetCRLF)) {
    return content.replace(normTargetCRLF, normRepCRLF);
  } else if (content.includes(normTargetLF)) {
    return content.replace(normTargetLF, normRepLF);
  }
  console.warn('Target not found in content');
  return content;
}

card = applyReplace(card, target1, replace1);
card = applyReplace(card, target2, replace2);

fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
console.log('Precision update applied successfully to product-card.tsx');
