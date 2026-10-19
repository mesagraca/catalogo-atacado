async function testHtml() {
  const res = await fetch('https://catalogo.mesaegraca.com.br/catalogo/kit-folhas');
  const html = await res.text();
  console.log('HTML Status:', res.status);
  
  const hasMetaSku = html.includes('product:sku');
  const hasMetaId = html.includes('product:id');
  const hasJsonLd = html.includes('application/ld+json');
  const hasAlternate = html.includes('application/json');

  console.log('Meta product:sku presente:', hasMetaSku);
  console.log('Meta product:id presente:', hasMetaId);
  console.log('Schema.org JSON-LD presente:', hasJsonLd);
  console.log('Link alternate API presente:', hasAlternate);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  if (jsonLdMatch) {
    console.log('\nJSON-LD Schema.org completo presente no view-source:\n', jsonLdMatch[1]);
  }
}

testHtml().catch(console.error);
