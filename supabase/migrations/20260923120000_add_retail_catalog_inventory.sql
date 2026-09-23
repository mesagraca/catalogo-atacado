-- This migration is intentionally self-contained for a new Supabase project.
create extension if not exists "pgcrypto";

create or replace function public.set_products_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Unified master catalogue. A sellable SKU owns stock; a composed kit only
-- references its component SKUs and therefore never creates a second balance.
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  source_product_id integer unique,
  name text not null,
  slug text unique,
  category_level_1 text,
  category_level_2 text,
  collection text,
  brand text,
  description_html text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  lifecycle_status text not null default 'active' check (lifecycle_status in ('active', 'preorder', 'inactive')),
  retail_visible boolean not null default false,
  wholesale_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_skus (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  sku text not null unique,
  kind text not null default 'single' check (kind in ('single', 'kit')),
  stock_policy text not null default 'independent' check (stock_policy in ('independent', 'component')),
  attributes jsonb not null default '{}'::jsonb,
  cost_price numeric(12,2),
  weight_grams numeric(12,2),
  height_cm numeric(12,2),
  width_cm numeric(12,2),
  length_cm numeric(12,2),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((kind = 'single' and stock_policy = 'independent') or kind = 'kit')
);

create table if not exists public.catalog_prices (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.catalog_skus(id) on delete cascade,
  channel text not null check (channel in ('retail', 'wholesale', 'marketplace')),
  list_price numeric(12,2),
  sale_price numeric(12,2),
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  unique (sku_id, channel),
  check (list_price is null or list_price >= 0),
  check (sale_price is null or sale_price >= 0)
);

create table if not exists public.catalog_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  sku_id uuid references public.catalog_skus(id) on delete cascade,
  url text not null,
  role text not null check (role in ('editorial', 'studio', 'gallery')),
  position integer not null default 0,
  alt_text text,
  is_active boolean not null default true
);

create table if not exists public.kit_components (
  kit_sku_id uuid not null references public.catalog_skus(id) on delete cascade,
  component_sku_id uuid not null references public.catalog_skus(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  primary key (kit_sku_id, component_sku_id),
  check (kit_sku_id <> component_sku_id)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.catalog_skus(id) on delete restrict,
  quantity integer not null check (quantity <> 0),
  type text not null check (type in ('opening_balance', 'receipt', 'sale', 'adjustment', 'return', 'reservation', 'release')),
  reference text,
  note text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.catalog_import_runs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_filename text,
  mode text not null check (mode in ('validation', 'apply')),
  totals jsonb not null default '{}'::jsonb,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists catalog_skus_product_id_idx on public.catalog_skus(product_id);
create index if not exists catalog_prices_sku_id_idx on public.catalog_prices(sku_id);
create index if not exists inventory_movements_sku_id_idx on public.inventory_movements(sku_id, occurred_at desc);
create unique index if not exists catalog_media_product_position_idx
  on public.catalog_media(product_id, role, position) where sku_id is null and is_active;
create unique index if not exists catalog_media_sku_position_idx
  on public.catalog_media(sku_id, role, position) where sku_id is not null and is_active;

create or replace view public.inventory_positions with (security_invoker = true) as
select
  sku.id as sku_id,
  coalesce(sum(movement.quantity), 0)::integer as available_quantity
from public.catalog_skus sku
left join public.inventory_movements movement on movement.sku_id = sku.id
group by sku.id;

create or replace view public.kit_availability with (security_invoker = true) as
select
  component.kit_sku_id as sku_id,
  min(floor(position.available_quantity::numeric / component.quantity))::integer as available_quantity
from public.kit_components component
join public.inventory_positions position on position.sku_id = component.component_sku_id
group by component.kit_sku_id;

create or replace view public.catalog_stock_availability with (security_invoker = true) as
select
  sku.id as sku_id,
  case
    when sku.kind = 'kit' and sku.stock_policy = 'component'
      then coalesce(kit.available_quantity, 0)
    else coalesce(position.available_quantity, 0)
  end as available_quantity
from public.catalog_skus sku
left join public.inventory_positions position on position.sku_id = sku.id
left join public.kit_availability kit on kit.sku_id = sku.id;

drop trigger if exists catalog_products_updated_at on public.catalog_products;
create trigger catalog_products_updated_at before update on public.catalog_products
  for each row execute function public.set_products_updated_at();
drop trigger if exists catalog_skus_updated_at on public.catalog_skus;
create trigger catalog_skus_updated_at before update on public.catalog_skus
  for each row execute function public.set_products_updated_at();

alter table public.catalog_products enable row level security;
alter table public.catalog_skus enable row level security;
alter table public.catalog_prices enable row level security;
alter table public.catalog_media enable row level security;
alter table public.kit_components enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.catalog_import_runs enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('retail-originals', 'retail-originals', false, 15728640, array['image/jpeg', 'image/png', 'image/webp']),
  ('retail-assets', 'retail-assets', true, 1048576, array['image/jpeg'])
on conflict (id) do nothing;

-- The operational dashboard will use authenticated/server-side access. No
-- anonymous policy is intentional: stock must never be exposed by the public key.
