alter table public.products
  add column if not exists game_items jsonb;
