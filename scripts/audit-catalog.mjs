import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function run() {
  const { FEATURED_PRODUCTS } = await import('../src/types/catalog.js');
  console.log('--- AUDITORIA GERAL DE PRODUTOS ---');
  console.log('Total de produtos encontrados:', FEATURED_PRODUCTS.length);

  const ids = new Set();
  const skus = new Set();
  let brokenImages = 0;
  let invalidSlugs = 0;

  for (const p of FEATURED_PRODUCTS) {
    if (ids.has(p.id)) {
      console.error('ERRO: ID duplicado detectado:', p.id);
    }
    ids.add(p.id);

    if (
      !p.id.startsWith('lugar-americano-') &&
      !p.id.startsWith('kit-') &&
      !p.id.startsWith('porta-guardanapo-')
    ) {
      console.error('Slug fora do Formato B:', p.id);
      invalidSlugs++;
    }

    if (p.image_url && p.image_url.startsWith('/produtos/')) {
      const decoded = decodeURIComponent(p.image_url.replace(/^\//, ''));
      const localPath = path.join(projectRoot, 'public', decoded);
      if (!fs.existsSync(localPath)) {
        console.error('IMAGEM PRINCIPAL INEXISTENTE:', p.id, '->', p.image_url, '(Arquivo esperado:', localPath, ')');
        brokenImages++;
      }
    }

    if (p.editorial_image_url && p.editorial_image_url.startsWith('/produtos/')) {
      const decoded = decodeURIComponent(p.editorial_image_url.replace(/^\//, ''));
      const localPath = path.join(projectRoot, 'public', decoded);
      if (!fs.existsSync(localPath)) {
        console.error('IMAGEM EDITORIAL INEXISTENTE:', p.id, '->', p.editorial_image_url, '(Arquivo esperado:', localPath, ')');
        brokenImages++;
      }
    }
  }

  console.log('-----------------------------------');
  console.log('Total de IDs únicos:', ids.size);
  console.log('Slugs fora do Formato B:', invalidSlugs);
  console.log('Imagens locais quebradas:', brokenImages);
  console.log('Auditoria concluída!');
}

run().catch(console.error);
