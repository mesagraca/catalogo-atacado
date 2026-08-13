alter table public.products
  add column if not exists kit_quantity integer
  check (kit_quantity is null or kit_quantity > 1);
