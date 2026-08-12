# Fotografia de produto

Este projeto trabalha com duas imagens opcionais por produto:

- `image_url`: foto principal de estúdio, limpa e fiel ao item vendido;
- `editorial_image_url`: foto secundária em uso, exibida no hover do card e na galeria da página do produto.

## Prompts oficiais

- [Criação de foto de estúdio](./criacao-foto-estudio.md)
- [Criação de foto editorial](./criacao-foto-editorial.md)

Use a foto de estúdio como referência de fidelidade. A foto editorial deve preservar exatamente o produto, material, bordas, cores e escala da referência de estúdio.

## Auditoria inicial de imagens

| Grupo | Situação atual | Próxima ação |
| --- | --- | --- |
| Abelhinha, Ovinho, Cerejinha, Folhas e Magnólia | Há imagem de contexto enviada | Criar ou confirmar a foto de estúdio antes de usar a existente como editorial. |
| Laço Elegance, Laço Charm, Ovinho, Courino, Nó Turco, Flor Rosa e Orquídea Azul | Há arquivos individuais candidatos a editorial | Conferir item a item para decidir qual é estúdio e qual é editorial. |
| Demais porta-guardanapos | Uma imagem cadastrada por produto | Auditar antes de gerar; não gerar segunda imagem se a atual já cumprir o papel editorial. |
| Lugar Americano Dupla Face, Fundo do Mar e Laço Francês | Uma imagem cadastrada por produto | Produzir ou selecionar uma segunda imagem somente após validar a fidelidade da peça. |

## Critério para cadastrar

1. A foto principal mostra somente o produto, com leitura objetiva para compra.
2. A foto editorial mostra o mesmo item sendo usado, sem esconder detalhes importantes.
3. Não cadastrar editorial se a fidelidade ao produto ainda estiver em dúvida.
4. Arquivos editoriais devem ser nomeados como `editorial-<id-do-produto>.jpg` ou `.webp` em `public/produtos/`.
