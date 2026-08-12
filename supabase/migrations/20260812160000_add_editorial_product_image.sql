-- Segunda imagem opcional para contexto de uso e hover do card.
alter table public.products
  add column if not exists editorial_image_url text;
