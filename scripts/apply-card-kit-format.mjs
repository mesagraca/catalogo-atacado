import fs from 'fs';

let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');

// 1. Ensure hasColorInfo is true for isGame
card = card.replace(
  'const hasColorInfo = variations.length > 0 || Boolean(product.color_name);',
  'const isGame = Boolean(product.game_items?.length);\r\n  const hasColorInfo = isGame || variations.length > 0 || Boolean(product.color_name);'
);
if (!card.includes('const isGame = Boolean(product.game_items?.length);')) {
  // LF fallback
  card = card.replace(
    'const hasColorInfo = variations.length > 0 || Boolean(product.color_name);',
    'const isGame = Boolean(product.game_items?.length);\n  const hasColorInfo = isGame || variations.length > 0 || Boolean(product.color_name);'
  );
}

// 2. Clean game items list in card
const oldGameList = `{isGame ? (
          <div className="game-price-list" aria-label="Valores por item do jogo">
            <span>Jogo completo · preços por item</span>
            {product.game_items!.map((item) => (
              <p key={item.label}><small>{item.label}{item.retail_price != null && <> <s>{money(item.retail_price)}</s></>}</small><b>{money(item.wholesale_price)}</b></p>
            ))}
          </div>
        )`;

const newGameList = `{isGame ? (
          <div className="game-price-list" aria-label="Valores por item do jogo">
            <span>Jogo completo · preços por item</span>
            {product.game_items!.map((item) => (
              <p key={item.label}>
                <small>{item.label.replace(/\\s*\\(.*?\\)/, "").trim()}</small>
                <b>{money(item.wholesale_price)}</b>
              </p>
            ))}
          </div>
        )`;

card = card.replace(oldGameList.replace(/\r?\n/g, '\r\n'), newGameList.replace(/\r?\n/g, '\r\n'));
if (!card.includes('item.label.replace')) {
  card = card.replace(oldGameList.replace(/\r?\n/g, '\n'), newGameList.replace(/\r?\n/g, '\n'));
}

// 3. Conforme composição in single-color
card = card.replace(
  '{product.color_hex && (\r\n                    <i style={{ backgroundColor: product.color_hex }} />\r\n                  )}{" "}\r\n                  {product.color_name}',
  '<i style={{ backgroundColor: product.color_hex || "#8d789d" }} />{" "}\r\n                  {isGame ? "Conforme composição" : (product.color_name || "Conforme composição")}'
);
if (!card.includes('isGame ? "Conforme composição"')) {
  card = card.replace(
    '{product.color_hex && (\n                    <i style={{ backgroundColor: product.color_hex }} />\n                  )}{" "}\n                  {product.color_name}',
    '<i style={{ backgroundColor: product.color_hex || "#8d789d" }} />{" "}\n                  {isGame ? "Conforme composição" : (product.color_name || "Conforme composição")}'
  );
}

fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
console.log('Successfully updated product-card.tsx');

// 4. Update globals.css for game-price-list border
let css = fs.readFileSync('src/app/globals.css', 'utf8');
const oldCssGame = `.game-price-list{display:grid;gap:.28rem;margin:.05rem 0}`;
const newCssGame = `.game-price-list{display:grid;gap:.28rem;margin:.25rem 0 .5rem;border-bottom:1px solid var(--line);padding-bottom:.45rem}`;
css = css.replace(oldCssGame, newCssGame);

fs.writeFileSync('src/app/globals.css', css, 'utf8');
console.log('Successfully updated globals.css');
