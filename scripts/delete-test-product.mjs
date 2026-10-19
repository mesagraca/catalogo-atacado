import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: Credenciais do Supabase ausentes no ambiente.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteTestProduct() {
  const slug = "jogo-americano-aurora-teste";
  console.log(`Excluindo produto de teste "${slug}" do Supabase...`);

  // Graças ao ON DELETE CASCADE configurado nas Foreign Keys,
  // excluir o produto pai remove automaticamente as variantes e fotos filhas!
  const { data, error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", slug)
    .select("internal_id, name");

  if (error) {
    console.error("Erro ao excluir produto:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(`Nenhum produto com slug "${slug}" foi encontrado.`);
  } else {
    console.log(`✓ Produto "${data[0].name}" (internal_id: ${data[0].internal_id}) excluído com sucesso junto a todas as suas variantes e fotos!`);
  }
}

deleteTestProduct();
