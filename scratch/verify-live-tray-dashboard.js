async function verifyLive() {
  const loginRes = await fetch('https://catalogo.mesaegraca.com.br/api/admin/acesso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '3545' })
  });
  const cookieHeader = loginRes.headers.get('set-cookie');
  const cookie = cookieHeader ? cookieHeader.split(';')[0] : '';

  const t0 = Date.now();
  const res = await fetch('https://catalogo.mesaegraca.com.br/api/admin/dashboard?days=30', {
    headers: { 'Cookie': cookie }
  });
  const elapsed = Date.now() - t0;
  console.log(`Status code: ${res.status} (Tempo total da requisição: ${elapsed}ms)`);
  const data = await res.json();
  
  console.log('\n--- VERIFICAÇÃO DE ESTOQUES 100% AO VIVO DIRETO DA TRAY ---');
  const prodsToCheck = [
    { name: 'Dalia Rose (ID 80)', sku: 'MES-MAD-AFE-080' },
    { name: 'Italia Redondo (ID 168)', sku: 'MES-NYL-LAM-168' },
    { name: 'Suculenta (ID 155)', sku: 'MES-PGU-SUC-155' },
    { name: 'Pizza Bordado (ID 214)', sku: 'MES-BOR-PGU-214' },
    { name: 'Orelle Dourado (ID 211)', sku: 'MES-MET-PGU-211' },
    { name: 'Chapeu de Palha (ID 153)', sku: 'MES-PGU-CHA-153' },
    { name: 'Ovinho (ID 251)', sku: 'KIT-TEC-KMP-251' }
  ];

  for (const item of prodsToCheck) {
    const p = data.products?.find(x => x.sku === item.sku);
    if (p) {
      console.log(`- ${item.name}:`);
      console.log(`  Estoque Real na Tray: ${p.stock_quantity} un`);
      console.log(`  Vendas: ${p.units_sold} un | Faturamento: R$ ${p.total_revenue}`);
      console.log(`  Custo: R$ ${p.total_cost} | Lucro Líquido: R$ ${p.net_profit.toFixed(2)} (${p.net_margin_percent.toFixed(1)}% margem)`);
    } else {
      console.log(`- ${item.name}: Não encontrado nos produtos vendidos`);
    }
  }

  console.log('\n--- VERIFICAÇÃO DE ITENS DOS PEDIDOS ---');
  const o539 = data.recent_orders?.find(o => o.id == '539');
  console.log(`Pedido #539 (Total Tray: R$ ${o539?.total}):`);
  console.log(`  Item: ${o539?.items?.[0]?.name}`);
  console.log(`  Estoque do item ao vivo da Tray: ${o539?.items?.[0]?.stock_quantity} un`);
  console.log(`  Custo Unitário: R$ ${o539?.items?.[0]?.unit_cost}`);

  const o537 = data.recent_orders?.find(o => o.id == '537');
  console.log(`\nPedido #537 (Total Tray: R$ ${o537?.total}):`);
  console.log(`  Item: ${o537?.items?.[0]?.name}`);
  console.log(`  Estoque do item ao vivo da Tray: ${o537?.items?.[0]?.stock_quantity} un`);
}

verifyLive().catch(console.error);
