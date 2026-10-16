import { readFileSync, existsSync } from 'node:fs';
import pg from 'pg';

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
  console.error('❌ POSTGRES_URL não encontrado.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: connectionString.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

const schemaSQL = `
-- 1. Limpeza segura das tabelas antigas para reordenar colunas
DROP TABLE IF EXISTS public.fotos CASCADE;
DROP TABLE IF EXISTS public.variantes CASCADE;
DROP TABLE IF EXISTS public.produtos CASCADE;

-- 2. Tabela Principal de Produtos (Ordenada por Importância)
CREATE TABLE public.produtos (
  -- Bloco 1: Identificadores Principais & Status (Visão Imediata)
  internal_id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  has_variations BOOLEAN NOT NULL DEFAULT false,
  tray_product_id INTEGER UNIQUE,
  sync_status TEXT NOT NULL DEFAULT 'pending',

  -- Bloco 2: Estoque & Comercial (Dados Dinâmicos de Venda)
  stock INTEGER NOT NULL DEFAULT 0,
  wholesale_price NUMERIC(10, 2),
  price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  promotional_price NUMERIC(10, 2),

  -- Bloco 3: Conteúdo & Apresentação
  short_description TEXT,
  description TEXT,
  included_items TEXT,
  color_name TEXT,
  color_hex TEXT,

  -- Bloco 4: Dados Fiscais
  ncm TEXT NOT NULL DEFAULT '63025300',
  ean TEXT NOT NULL DEFAULT '',
  origin INTEGER NOT NULL DEFAULT 0,
  cfop_internal TEXT NOT NULL DEFAULT '5102',
  cfop_external TEXT NOT NULL DEFAULT '6102',
  csosn TEXT NOT NULL DEFAULT '102',
  cest TEXT NOT NULL DEFAULT '',
  tax_group_tray TEXT NOT NULL DEFAULT '',

  -- Bloco 5: Logística & Frete
  weight_grams INTEGER NOT NULL DEFAULT 150,
  length_cm INTEGER NOT NULL DEFAULT 38,
  width_cm INTEGER NOT NULL DEFAULT 38,
  height_cm INTEGER NOT NULL DEFAULT 2,
  availability_text TEXT NOT NULL DEFAULT 'Pronta entrega',
  production_days INTEGER NOT NULL DEFAULT 0,
  free_shipping BOOLEAN NOT NULL DEFAULT false,

  -- Bloco 6: Dados Técnicos, Garantia & SEO
  warranty TEXT NOT NULL DEFAULT '30 dias contra defeitos de fabricação',
  warranty_days INTEGER NOT NULL DEFAULT 30,
  brand TEXT NOT NULL DEFAULT 'Mesa & Graça',
  available_in_store BOOLEAN NOT NULL DEFAULT true,
  id TEXT UNIQUE NOT NULL, -- Slug da URL amigável
  sort_order INTEGER NOT NULL DEFAULT 0,
  technical_specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  game_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  google_shopping JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Variantes (Vinculada por produto_internal_id)
CREATE TABLE public.variantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_internal_id INTEGER NOT NULL REFERENCES public.produtos(internal_id) ON DELETE CASCADE,
  produto_slug TEXT NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  pattern TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10, 2),
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tray_variant_id INTEGER,
  ncm TEXT NOT NULL DEFAULT '63025300',
  ean TEXT NOT NULL DEFAULT '',
  color_hex TEXT,
  image_url TEXT,
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela de Fotos (Vinculada por produto_internal_id)
CREATE TABLE public.fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_internal_id INTEGER NOT NULL REFERENCES public.produtos(internal_id) ON DELETE CASCADE,
  produto_slug TEXT NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'studio',
  is_cover BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  url_webp TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Índices de Alta Performance
CREATE INDEX idx_produtos_internal_id ON public.produtos(internal_id);
CREATE INDEX idx_produtos_sku ON public.produtos(sku);
CREATE INDEX idx_produtos_category ON public.produtos(category);
CREATE INDEX idx_produtos_tray_id ON public.produtos(tray_product_id);
CREATE INDEX idx_produtos_sync_status ON public.produtos(sync_status);
CREATE INDEX idx_variantes_produto_internal_id ON public.variantes(produto_internal_id);
CREATE INDEX idx_variantes_sku ON public.variantes(sku);
CREATE INDEX idx_fotos_produto_internal_id ON public.fotos(produto_internal_id);

-- 6. Políticas de Segurança (Row Level Security - RLS)
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_produtos ON public.produtos FOR SELECT USING (true);
CREATE POLICY public_read_variantes ON public.variantes FOR SELECT USING (true);
CREATE POLICY public_read_fotos ON public.fotos FOR SELECT USING (true);

-- Revoga permissões de escrita para a chave anônima pública
REVOKE INSERT, UPDATE, DELETE ON public.produtos FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.variantes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.fotos FROM anon;
`;

async function main() {
  try {
    console.log('🔌 Conectando ao PostgreSQL do Supabase...');
    await client.connect();
    console.log('✅ Conexão estabelecida!');

    console.log('🛠️ Recriando tabelas com ordem prioritária de colunas e FKs numéricas...');
    await client.query(schemaSQL);
    console.log('🎉 Tabelas [produtos, variantes, fotos] recriadas com sucesso com colunas priorizadas!');
  } catch (err) {
    console.error('❌ Erro ao configurar schema no Supabase:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
