import fs from 'fs';

// 1. Remove card-size-badge from product-card.tsx
let card = fs.readFileSync('src/components/product-card.tsx', 'utf8');
const cardBadgeBlockRegex = /\s*\{product\.dimensions\?\.\[0\]\?\.value && \([\s\S]*?<\/div>\s*\)\}/;
if (cardBadgeBlockRegex.test(card)) {
  card = card.replace(cardBadgeBlockRegex, '');
  fs.writeFileSync('src/components/product-card.tsx', card, 'utf8');
  console.log('Removed card-size-badge from product-card.tsx');
} else {
  console.log('card-size-badge already removed from product-card.tsx');
}

// 2. Remove product-page-size-badge and change 'Varejo sugerido:' to 'Preço varejo:' in product-page-client.tsx
let pageClient = fs.readFileSync('src/components/product-page-client.tsx', 'utf8');

// Remove size badge
const pageBadgeRegex = /\s*\{product\.dimensions\?\.\[0\]\?\.value && \([\s\S]*?<\/span>\s*\)\}/;
if (pageBadgeRegex.test(pageClient)) {
  pageClient = pageClient.replace(pageBadgeRegex, '');
  console.log('Removed product-page-size-badge from product-page-client.tsx');
}

// Replace 'Varejo sugerido:' with 'Preço varejo:'
if (pageClient.includes('Varejo sugerido:')) {
  pageClient = pageClient.replace('Varejo sugerido:', 'Preço varejo:');
  console.log('Replaced "Varejo sugerido:" with "Preço varejo:"');
}

fs.writeFileSync('src/components/product-page-client.tsx', pageClient, 'utf8');

// 3. Remove border-bottom from .game-price-list in globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');
const oldCssGame = `.game-price-list{display:grid;gap:.28rem;margin:.25rem 0 .5rem;border-bottom:1px solid var(--line);padding-bottom:.45rem}`;
const newCssGame = `.game-price-list{display:grid;gap:.28rem;margin:.25rem 0 .4rem}`;
if (css.includes(oldCssGame)) {
  css = css.replace(oldCssGame, newCssGame);
  fs.writeFileSync('src/app/globals.css', css, 'utf8');
  console.log('Removed duplicate border-bottom from .game-price-list in globals.css');
} else {
  // Try regex replace
  css = css.replace(/\.game-price-list\{([^}]*?)border-bottom:1px solid var\(--line\);padding-bottom:\.45rem([^}]*?)\}/, '.game-price-list{$1$2}');
  fs.writeFileSync('src/app/globals.css', css, 'utf8');
  console.log('Updated .game-price-list in globals.css via regex');
}
