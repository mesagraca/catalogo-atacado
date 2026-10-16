import { readFileSync, existsSync } from 'node:fs';
import pg from 'pg';

const envFile = '.env.local';
if (!existsSync(envFile)) {
  console.error('❌ .env.local não encontrado');
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
const client = new pg.Client({
  connectionString: connectionString.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

const updateSQL = `
-- 1. Adicionar internal_id SERIAL e has_variations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'produtos' AND column_name = 'internal_id'
  ) THEN
    ALTER TABLE public.produtos ADD COLUMN internal_id SERIAL UNIQUE;
    RAISE NOTICE 'Coluna internal_id criada com sucesso!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'produtos' AND column_name = 'has_variations'
  ) THEN
    ALTER TABLE public.produtos ADD COLUMN has_variations BOOLEAN NOT NULL DEFAULT false;
    RAISE NOTICE 'Coluna has_variations criada com sucesso!';
  END IF;
END $$;

-- 2. Índice para internal_id
CREATE INDEX IF NOT EXISTS idx_produtos_internal_id ON public.produtos(internal_id);

-- 3. Blindagem de Segurança RLS
-- Remove permissão de inserção/edição/deleção para chave pública anônima (anon)
REVOKE INSERT, UPDATE, DELETE ON public.produtos FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.variantes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.fotos FROM anon;
`;

async function run() {
  try {
    console.log('🔌 Conectando ao Supabase para atualizar schema...');
    await client.connect();
    await client.query(updateSQL);
    console.log('✅ Schema atualizado: internal_id adicionado e RLS blindado!');
  } catch (err) {
    console.error('❌ Erro ao atualizar schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
