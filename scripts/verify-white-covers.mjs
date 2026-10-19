import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function analyze(filePath) {
  try {
    const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
    const c = info.channels;
    const getP = (x, y) => {
      const idx = (y * info.width + x) * c;
      return (data[idx] + data[idx+1] + data[idx+2]) / 3;
    };
    return (getP(10, 10) + getP(info.width-10, 10) + getP(info.height-10, 10) + getP(info.width-10, info.height-10)) / 4;
  } catch(e) { return -1; }
}

async function verify() {
  const { FEATURED_PRODUCTS } = await import('../src/types/catalog.js');
  console.log('--- TESTE DE FUNDO BRANCO NAS CAPAS DOS PRODUTOS ---');
  let whiteCount = 0;
  let placeholderCount = 0;
  let otherCount = 0;

  for (const p of FEATURED_PRODUCTS) {
    if (p.image_url.includes('placeholder')) {
      placeholderCount++;
      continue;
    }
    const local = path.join(projectRoot, 'public', p.image_url.replace(/^\//, ''));
    const brightness = await analyze(local);
    const isWhite = brightness > 180;
    if (isWhite) whiteCount++;
    else otherCount++;

    console.log(
      `${isWhite ? '✓' : '!'} ${p.id.padEnd(42)} | Fundo: ${brightness.toFixed(1)} | Capa: ${p.image_url}`
    );
  }

  console.log('----------------------------------------------------');
  console.log(`Capas com fundo branco / estúdio: ${whiteCount}`);
  console.log(`Capas com placeholder institucional: ${placeholderCount}`);
  console.log(`Outros fundos: ${otherCount}`);
}

verify().catch(console.error);
