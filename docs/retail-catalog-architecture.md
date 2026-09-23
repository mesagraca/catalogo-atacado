# Catálogo de varejo e estoque

## Fonte e exportação

Durante a transição, a planilha **MESA&GRAÇA** é a fonte mestre de conteúdo e
saldo inicial. A aba/modelo da Tray é uma saída de exportação: ela recebe os
dados já validados e não deve ser alterada como fonte de estoque, preço ou SKU.

Depois da primeira importação validada, o banco passa a registrar as
movimentações de estoque. O XLS da Tray será gerado novamente sempre que houver
uma publicação de catálogo, preservando os campos esperados pela plataforma.

## Produtos, SKUs e kits

- Um produto representa a página comercial: nome, categoria, textos e mídia.
- Um SKU é a unidade realmente vendável e estocável: cor, dimensão, custo e
  referência.
- Um produto pode existir nos canais varejo, atacado ou em ambos, sem duplicar
  o SKU.
- Um kit composto não possui saldo próprio. Sua disponibilidade é o menor valor
  de `estoque do componente / quantidade necessária`, arredondado para baixo.
- Um kit fechado e fisicamente separado pode ter `stock_policy = independent`.
  Isso é exceção e será identificado na importação.

## Exemplo: Kit Fruta

Se o Kit Fruta utiliza um Bowl Mamão, um Bowl Kiwi, um Bowl Morango e um Bowl
Banana, uma venda do kit cria uma baixa para cada SKU. Com saldos 8, 5, 12 e 7,
o catálogo pode oferecer cinco kits. Não existe um segundo saldo para o kit.

## Importação inicial

1. Carregar o catálogo principal em uma área de validação.
2. Normalizar moeda brasileira, categorias, URLs, SKU e dados ausentes.
3. Criar um movimento `opening_balance` para cada saldo confirmado.
4. Relacionar componentes antes de publicar kits compostos.
5. Comparar a saída com o modelo Tray e só então gerar o XLS de importação.

## Gestão de imagens

As imagens não permanecerão como URLs de fornecedores ou de plataformas. Cada
arquivo aprovado será hospedado no Storage da Mesa & Graça e registrado na
tabela de mídia com produto, SKU quando aplicável, tipo (`editorial`, `studio`
ou `gallery`), posição, data e origem.

O fluxo de publicação será:

1. Enviar o original para um bucket privado de origem.
2. Validar formato e criar a versão de catálogo em JPG, 1500 x 1500 pixels,
   sem metadados e com no máximo 500 KB.
3. Publicar a versão aprovada em um bucket público de entrega, com caminho
   determinístico por produto/SKU e papel da imagem.
4. Permitir baixar tanto o original quanto o JPG aprovado no painel interno.
5. Preencher a exportação Tray e os demais marketplaces usando somente a URL
   canônica hospedada pela Mesa & Graça.

O bucket público será apenas de entrega. Upload, substituição e exclusão passam
por servidor autenticado; a chave de serviço nunca vai ao navegador. O domínio
inicial será o CDN do Supabase. Depois, se desejado, o mesmo caminho pode ser
servido por um subdomínio próprio, como `assets.mesaegraca.com.br`, sem alterar
o cadastro dos produtos.

## Pendências de qualidade já observadas

- A aba operacional `THAMI` possui 237 produtos; `CATÁLOGO - V2` possui 253.
- Existem 16 produtos presentes apenas no catálogo principal (IDs 239 a 254).
- Há saldos `50` repetidos que precisam ser confirmados como estoque real ou
  valor provisório.
- Custos vazios ou iguais a zero não devem impedir a publicação, mas precisam
  ser destacados no painel de margem.
- Quatro kits de Festa Junina têm nomes repetidos e devem ser verificados antes
  de criar as composições.
