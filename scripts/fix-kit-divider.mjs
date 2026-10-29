import fs from 'fs';

// 1. Update product-card.tsx
let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');
card = card.replace(
  '<div className="product-divider" />',
  '{!isGame && <div className="product-divider" />}'
);
fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
console.log('Updated product-card.tsx to suppress product-divider when isGame');

// 2. Update globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');
const oldRule = `.game-price-list{display:grid;gap:.28rem;margin:.25rem 0 .4rem}`;
const newRule = `.game-price-list{display:grid;gap:.28rem;margin:.25rem 0 .85rem;border-bottom:1px solid var(--line);padding-bottom:.35rem}`;

if (css.includes(oldRule)) {
  css = css.replace(oldRule, newRule);
} else {
  // Regex fallback
  css = css.replace(
    /\.game-price-list\{display:grid;gap:\.28rem;margin:[^}]*?\}/,
    newRule
  );
}
fs.writeFileSync('src/app/globals.css', css, 'utf8');
console.log('Updated globals.css with border-bottom on .game-price-list');
