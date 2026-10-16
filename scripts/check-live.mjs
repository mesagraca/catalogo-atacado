import { FEATURED_PRODUCTS } from '../src/types/catalog.js';

async function checkLive() {
  console.log(`Testando ${FEATURED_PRODUCTS.length} produtos contra https://catalogo.mesaegraca.com.br...`);

  let broken = 0;
  let totalChecked = 0;

  for (const p of FEATURED_PRODUCTS) {
    const urlsToTest = [];
    if (p.image_url) urlsToTest.push({ type: 'main', url: p.image_url });
    if (p.editorial_image_url) urlsToTest.push({ type: 'editorial', url: p.editorial_image_url });

    for (const item of urlsToTest) {
      totalChecked++;
      const fullUrl = item.url.startsWith('http') ? item.url : `https://catalogo.mesaegraca.com.br${item.url}`;
      try {
        const res = await fetch(fullUrl, { method: 'HEAD' });
        if (res.status !== 200) {
          console.log(`[STATUS ${res.status}] Produto: ${p.id} (${p.name}) | ${item.type}: ${fullUrl}`);
          broken++;
        }
      } catch (err) {
        console.log(`[ERRO CONEXÃO] ${fullUrl}:`, err.message);
        broken++;
      }
    }
  }

  console.log('-------------------------------------------');
  console.log(`Auditoria remota concluída: ${broken} imagens quebradas de ${totalChecked} checadas.`);
}

checkLive().catch(console.error);
