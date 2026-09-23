# Plano fásico — catálogo de varejo, estoque e marketplaces

## Princípios travados

- A base **MESA&GRAÇA** é a fonte inicial de dados.
- O XLS da Tray é uma exportação derivada, nunca a fonte de verdade.
- O estoque pertence ao SKU real; kits compostos não possuem saldo duplicado.
- Toda imagem de marketplace será JPG, 1500 x 1500 pixels e terá no máximo
  500 KB.
- Um produto pode ser publicado em varejo, atacado ou ambos sem duplicar SKU.

## Fase 0 — Saneamento e mapa de dados

**Objetivo:** preparar uma importação confiável sem alterar o catálogo público.

1. Consolidar as abas `CATÁLOGO - V2` e `THAMI` em uma tabela de conferência.
2. Listar divergências: produtos ausentes, preço zerado, custo ausente, SKU,
   categorias e estoque provisório.
3. Marcar cada kit como `composto` ou `fechado`.
4. Definir os componentes e a quantidade de cada kit composto.
5. Confirmar se os saldos repetidos de 50 são reais ou provisórios.

**Entregável:** relatório de validação e planilha de importação aprovada.

**Critério de saída:** nenhum SKU duplicado; todos os kits compostos têm lista
de componentes; todo saldo inicial está confirmado.

## Fase 1 — Banco mestre e importação inicial

**Objetivo:** trazer o varejo completo para o banco sem afetar o atacado.

1. Aplicar a migração de catálogo, SKU, preços, mídia, movimentos e kits.
2. Importar produtos, categorias, descrições, atributos, medidas e preços.
3. Registrar cada saldo inicial como movimento `opening_balance`.
4. Importar a composição dos kits e calcular disponibilidade automaticamente.
5. Gerar relatório de importação: inseridos, ignorados, erros e pendências.

**Entregável:** base mestre navegável e auditável no Supabase.

**Critério de saída:** 100% dos produtos aprovados têm SKU; o saldo de cada
kit composto confere com o menor componente.

## Fase 2 — Biblioteca de imagens da Mesa & Graça

**Objetivo:** centralizar mídia em URLs próprias e prontas para marketplace.

1. Criar bucket privado para originais e bucket público para imagens aprovadas.
2. Criar tela de envio, galeria, ordenação e download por produto/SKU.
3. Normalizar upload para JPG 1500 x 1500 e até 500 KB.
4. Preservar o original e versionar substituições, sem quebrar links ativos.
5. Migrar imagens externas aprovadas para o Storage da Mesa & Graça.

**Entregável:** biblioteca de mídia com URL canônica, original e arquivo final.

**Critério de saída:** cada imagem publicada atende às regras técnicas e pode
ser baixada pela equipe.

## Fase 3 — Catálogo de varejo protegido

**Objetivo:** exibir o varejo completo em área separada do atacado.

1. Ligar a rota `/varejo` à base mestre.
2. Publicar filtros pelas categorias do varejo e busca por nome/SKU.
3. Exibir preço de varejo e promoção sem mostrar preço atacado.
4. Adicionar páginas de produto com galeria, características e disponibilidade.
5. Manter controle de acesso temporário por senha e preparar autenticação por
   usuário para a próxima etapa.

**Entregável:** catálogo varejo funcional, sem misturar canais ou estoques.

**Critério de saída:** produto publicado em varejo aparece apenas no varejo;
produto exclusivo de atacado não aparece nessa área.

## Fase 4 — Operação de estoque

**Objetivo:** transformar o catálogo em uma ferramenta diária de operação.

1. Criar painel de estoque por SKU, categoria e status.
2. Registrar entrada, venda, ajuste, devolução, reserva e liberação.
3. Mostrar alertas de estoque mínimo e produtos zerados.
4. Criar tela de composição de kits e disponibilidade calculada.
5. Exigir motivo e responsável nos ajustes manuais.

**Entregável:** histórico de saldo e operação sem dupla contagem de kits.

**Critério de saída:** toda alteração de saldo deixa rastro; não é possível
vender um kit acima da disponibilidade de seus componentes.

## Fase 5 — Exportador Tray e marketplaces

**Objetivo:** manter os canais externos sincronizados a partir da mesma base.

1. Mapear campos do banco para o modelo XLS da Tray.
2. Gerar XLS somente com produtos e imagens aprovados para o canal escolhido.
3. Validar campos obrigatórios, preço, categoria, peso, dimensões e URLs.
4. Criar histórico de exportações com data, responsável e quantidade de itens.
5. Reutilizar o mesmo motor para Mercado Livre e demais marketplaces quando
   as regras de cada canal forem definidas.

**Entregável:** arquivo Tray pronto para baixar e importar, sem edição manual.

**Critério de saída:** a exportação reproduz os dados aprovados e as URLs das
imagens pertencem ao domínio da Mesa & Graça.

## Fase 6 — Segurança e automação

**Objetivo:** sair da senha compartilhada e reduzir tarefas manuais.

1. Criar usuários internos com papéis: catálogo, estoque e administração.
2. Substituir a senha única por autenticação do Supabase.
3. Restringir upload e alteração de estoque conforme o papel do usuário.
4. Programar relatórios de estoque baixo e pendências de imagem.
5. Criar rotina de backup e auditoria de exportações.

**Entregável:** operação controlada, rastreável e pronta para crescer.

## Ordem recomendada

`Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6`

As Fases 2 e 3 podem avançar em paralelo após a importação da Fase 1. A Fase
5 só começa quando a base, as imagens e as categorias estiverem aprovadas.
