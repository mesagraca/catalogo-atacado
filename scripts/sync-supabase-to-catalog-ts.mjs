import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { dbRecordToUIProduct } from '../src/lib/catalog-db.ts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('--- REGENERATING FEATURED_PRODUCTS FROM SUPABASE ---');
  const { data: dbProducts, error } = await supabase
    .from('produtos')
    .select('*, variants:variantes(*), photos:fotos(*)')
    .order('sort_order', { ascending: true });

  if (error || !dbProducts) {
    console.error('Error reading produtos:', error);
    process.exit(1);
  }

  const uiProducts = dbProducts.map(dbRecordToUIProduct);
  console.log(`Mapped ${uiProducts.length} UI products.`);

  // Verify covers are studio
  let studioCoverCount = 0;
  for (const p of uiProducts) {
    if (p.image_url) studioCoverCount++;
  }
  console.log(`Products with valid image_url: ${studioCoverCount}/${uiProducts.length}`);

  const typesPath = 'src/types/catalog.ts';
  const existingTypesCode = fs.readFileSync(typesPath, 'utf8');

  const declarationIdx = existingTypesCode.indexOf('export const FEATURED_PRODUCTS: Product[] = ');
  if (declarationIdx === -1) {
    console.error('Could not find FEATURED_PRODUCTS declaration in catalog.ts');
    process.exit(1);
  }

  const typesPrefix = existingTypesCode.slice(0, declarationIdx);
  const updatedFile = `${typesPrefix}export const FEATURED_PRODUCTS: Product[] = ${JSON.stringify(uiProducts, null, 2)};\n`;

  fs.writeFileSync(typesPath, updatedFile, 'utf8');
  console.log('Successfully updated src/types/catalog.ts with full Supabase parity!');
}

run();
