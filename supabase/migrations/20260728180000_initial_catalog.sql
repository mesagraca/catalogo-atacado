-- Mesa&Graça: schema intentionally kept to the two operational tables.
create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Lugar Americano','Guardanapo','Porta-guardanapo')),
  sku text,
  collection text,
  color_name text,
  color_hex text,
  retail_price numeric(12,2),
  wholesale_price numeric(12,2),
  image_url text,
  image_status text not null default 'placeholder' check (image_status in ('final','placeholder')),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp text not null default '+55 11 97700-7234',
  catalog_title text not null default 'Catálogo Atacado',
  catalog_subtitle text not null default 'Lugar Americano · Guardanapo · Porta-guardanapo'
);
insert into public.settings (whatsapp, catalog_title, catalog_subtitle)
select '+55 11 97700-7234','Catálogo Atacado','Lugar Americano · Guardanapo · Porta-guardanapo'
where not exists (select 1 from public.settings);

create or replace function public.set_products_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;
alter table public.settings enable row level security;
-- The storefront can read published data, but mutations are exclusively made
-- through server-side code using the service-role key. Never grant anonymous
-- write access to a catalogue or its settings.
create policy "catalog reads visible products" on public.products
  for select to anon, authenticated using (is_visible);
create policy "catalog reads settings" on public.settings
  for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = true;
create policy "public reads product images" on storage.objects for select using (bucket_id = 'product-images');
