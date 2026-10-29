import { getUIProductById } from '../src/lib/catalog-db.ts';

async function test() {
  console.log('=== TESTE DE ENDPOINTS E RETORNO DOS PRODUTOS ===\n');

  const testIds = [
    'lugar-americano-redondo-xadrez',
    'kit-fundo-do-mar-convencional',
    '75',
    '120',
    '168'
  ];

  for (const id of testIds) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testando identificador: "${id}"`);
    const p = await getUIProductById(id);
    if (!p) {
      console.log(`❌ Produto não encontrado.`);
      continue;
    }

    console.log(`✅ Encontrado: [${p.id}] ${p.name}`);
    console.log(`   Categoria: ${p.category} | Coleção: ${p.collection}`);
    console.log(`   Preço Varejo: R$ ${p.retail_price?.toFixed(2)} | Atacado: R$ ${p.wholesale_price?.toFixed(2)}`);
    console.log(`   Materiais (${p.materials?.length || 0}):`);
    p.materials?.forEach(m => console.log(`     • ${m.label}: ${m.value}`));
    console.log(`   Medidas (${p.dimensions?.length || 0}):`);
    p.dimensions?.forEach(d => console.log(`     • ${d.label}: ${d.value}`));
  }
  
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
