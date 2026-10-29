import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname, '../.env.local');
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

const connectionString = (env.POSTGRES_URL || env.POSTGRES_PRISMA_URL).split('?')[0];
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();

  console.log('Buscando 93 produtos atualizados do Supabase...');
  const { rows } = await client.query(`
    SELECT
      p.*,
      COALESCE(
        json_agg(f.*) FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) as photos
    FROM public.produtos p
    LEFT JOIN public.fotos f ON f.produto_internal_id = p.internal_id
    WHERE p.tray_product_id IS NOT NULL
    GROUP BY p.internal_id
    ORDER BY p.internal_id ASC
  `);

  console.log(`Carregados ${rows.length} produtos do Supabase.`);

  const uiProducts = rows.map((r, idx) => {
    const photos = r.photos || [];
    const images = r.media?.images || [];

    let coverImg = photos.find(p => p.is_cover) || photos[0];
    let coverUrl = coverImg ? (coverImg.url_webp || coverImg.url) : (images[0]?.url || null);

    let editorialImg = photos.find(p => p.type === 'editorial' || (!p.is_cover && photos.length > 1)) || photos[1];
    let editorialUrl = editorialImg ? (editorialImg.url_webp || editorialImg.url) : (images[1]?.url || null);

    const materials = r.technical_specifications?.materials;
    const dimensions = r.technical_specifications?.dimensions;

    return {
      id: r.id,
      name: r.name,
      category: r.category,
      sku: r.sku || null,
      tray_id: r.tray_product_id ? Number(r.tray_product_id) : null,
      collection: r.collection || null,
      color_name: null,
      color_hex: null,
      retail_price: r.price ? Number(r.price) : null,
      wholesale_price: r.wholesale_price ? Number(r.wholesale_price) : null,
      image_url: coverUrl,
      editorial_image_url: editorialUrl,
      description: r.short_description || r.description || `Peça exclusiva Mesa & Graça confeccionada em ${r.technical_specifications?.Tecido || 'tecido nobre'}.`,
      materials: materials && materials.length > 0 ? materials : undefined,
      dimensions: dimensions && dimensions.length > 0 ? dimensions : undefined,
      image_status: 'final',
      sort_order: idx + 1,
      is_visible: Boolean(r.active),
      kit_quantity: r.category === 'Jogos' ? 3 : null,
      created_at: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    };
  });

  const catalogTsPath = path.resolve(__dirname, '../src/types/catalog.ts');
  const typeDefinitions = `export const CATEGORIES = ["Jogos", "Lugar Americano", "Porta-guardanapos", "Guardanapos"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Variation = {
  name: string;
  hex: string;
  pattern: "xadrez" | "liso";
  sku?: string;
};

export type GameItem = {
  label: string;
  retail_price?: number | null;
  wholesale_price: number | null;
};

export type MaterialDetail = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  sku: string | null;
  tray_id?: number | null;
  collection: string | null;
  color_name: string | null;
  color_hex: string | null;
  retail_price: number | null;
  wholesale_price: number | null;
  image_url: string | null;
  editorial_image_url?: string | null;
  description?: string;
  materials?: MaterialDetail[];
  dimensions?: MaterialDetail[];
  image_status: "final" | "placeholder";
  sort_order: number;
  is_visible: boolean;
  kit_quantity?: number | null;
  game_items?: GameItem[];
  variations?: Variation[];
  created_at?: string;
};

export type ProductInput = Omit<Product, "id" | "created_at"> & {
  variations?: Variation[];
};

export const FEATURED_PRODUCTS: Product[] = ${JSON.stringify(uiProducts, null, 2)};
`;

  writeFileSync(catalogTsPath, typeDefinitions, 'utf8');
  console.log(`✅ Arquivo src/types/catalog.ts atualizado com sucesso com ${uiProducts.length} produtos!`);

  await client.end();
}

main().catch(console.error);
