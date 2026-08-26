alter table public.products
  add column if not exists description text,
  add column if not exists materials jsonb;
