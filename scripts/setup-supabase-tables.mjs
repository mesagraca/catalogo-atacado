import { readFileSync, existsSync } from 'node:fs';
import pg from 'pg';

// 1. Carregar variáveis de ambiente do .env.local
const envFile = '.env.local';
if (!existsSync(envFile)) {
  console.error('❌ Arquivo .env.local não encontrado.');
  process.exit(1);
}

const envContent = readFileSync(envFile, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[key] = val;
  }
}

const connectionString = env.POSTGRES_URL || env.POSTGRES_PRISMA_URL;
if (!connectionString) {
  console.error('❌ POSTGRES_URL não encontrado em .env.local.');
  process.exit(1);
}

let connStr = connectionString.split('?')[0];

const client = new pg.Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
});

const schemaSQL = `
-- 1. Tabela Principal de Produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Mesa & Graça',
  category TEXT NOT NULL,
  collection TEXT,
  color_name TEXT,
  color_hex TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  available_in_store BOOLEAN NOT NULL DEFAULT true,
  short_description TEXT,
  description TEXT,
  included_items TEXT,
  warranty TEXT NOT NULL DEFAULT '30 dias contra defeitos de fabricação',
  warranty_days INTEGER NOT NULL DEFAULT 30,
  stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10, 2),
  wholesale_price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  promotional_price NUMERIC(10, 2),
  weight_grams INTEGER NOT NULL DEFAULT 150,
  length_cm INTEGER NOT NULL DEFAULT 38,
  width_cm INTEGER NOT NULL DEFAULT 38,
  height_cm INTEGER NOT NULL DEFAULT 2,
  free_shipping BOOLEAN NOT NULL DEFAULT false,
  production_days INTEGER NOT NULL DEFAULT 0,
  availability_text TEXT NOT NULL DEFAULT 'Pronta entrega',
  ncm TEXT NOT NULL DEFAULT '63025300',
  ean TEXT NOT NULL DEFAULT '',
  origin INTEGER NOT NULL DEFAULT 0,
  cest TEXT NOT NULL DEFAULT '',
  cfop_internal TEXT NOT NULL DEFAULT '5102',
  cfop_external TEXT NOT NULL DEFAULT '6102',
  csosn TEXT NOT NULL DEFAULT '102',
  tax_group_tray TEXT NOT NULL DEFAULT '',
  tray_product_id INTEGER UNIQUE,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  last_sync_at TIMESTAMPTZ,
  technical_specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  google_shopping JSONB NOT NULL DEFAULT '{}'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  game_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  data_provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela de Variantes (Grades de Cor/Estampa)
CREATE TABLE IF NOT EXISTS public.variantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id TEXT NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  pattern TEXT,
  color_hex TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  ncm TEXT NOT NULL DEFAULT '63025300',
  ean TEXT NOT NULL DEFAULT '',
  tray_variant_id INTEGER,
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Fotos e Mídias
CREATE TABLE IF NOT EXISTS public.fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id TEXT NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  url_webp TEXT NOT NULL,
  alt TEXT,
  type TEXT NOT NULL DEFAULT 'studio',
  is_cover BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Índices para Pesquisa Rápida
CREATE INDEX IF NOT EXISTS idx_produtos_sku ON public.produtos(sku);
CREATE INDEX IF NOT EXISTS idx_produtos_category ON public.produtos(category);
CREATE INDEX IF NOT EXISTS idx_produtos_tray_id ON public.produtos(tray_product_id);
CREATE INDEX IF NOT EXISTS idx_produtos_sync_status ON public.produtos(sync_status);
CREATE INDEX IF NOT EXISTS idx_variantes_produto_id ON public.variantes(produto_id);
CREATE INDEX IF NOT EXISTS idx_variantes_sku ON public.variantes(sku);
CREATE INDEX IF NOT EXISTS idx_fotos_produto_id ON public.fotos(produto_id);

-- 5. Row Level Security (RLS) para Segurança
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'produtos' AND policyname = 'public_read_produtos'
  ) THEN
    CREATE POLICY public_read_produtos ON public.produtos FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'variantes' AND policyname = 'public_read_variantes'
  ) THEN
    CREATE POLICY public_read_variantes ON public.variantes FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fotos' AND policyname = 'public_read_fotos'
  ) THEN
    CREATE POLICY public_read_fotos ON public.fotos FOR SELECT USING (true);
  END IF;
END $$;
`;

async function main() {
  try {
    console.log('🔌 Conectando ao PostgreSQL do Supabase...');
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    console.log('🛠️ Criando tabelas, índices e políticas de segurança...');
    await client.query(schemaSQL);
    console.log('🎉 Tabelas [produtos, variantes, fotos] criadas e configuradas com sucesso no Supabase!');
  } catch (err) {
    console.error('❌ Erro ao configurar tabelas no Supabase:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
