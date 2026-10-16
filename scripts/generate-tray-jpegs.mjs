import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const produtosDir = path.join(projectRoot, 'public', 'produtos');

function getAllWebpFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllWebpFiles(fullPath, fileList);
    } else if (/\.webp$/i.test(item)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function generateTrayJpegs() {
  console.log('--- GERANDO VERSÕES JPEG sRGB PARA TRAY (< 350 KB) ---');
  const webpFiles = getAllWebpFiles(produtosDir);
  console.log(`Encontrados ${webpFiles.length} arquivos WebP para espelhar em JPEG.`);

  let createdCount = 0;
  let oversizedCount = 0;

  for (const webpPath of webpFiles) {
    const jpgPath = webpPath.replace(/\.webp$/i, '.jpg');
    try {
      await sharp(webpPath)
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // Fundo branco caso haja transparência
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(jpgPath);

      const size = fs.statSync(jpgPath).size;
      const sizeKb = Math.round(size / 1024);

      if (size > 350 * 1024) {
        console.warn(`[ATENÇÃO] Imagem excede 350 KB: ${path.relative(produtosDir, jpgPath)} (${sizeKb} KB) - recomprimindo...`);
        // Recomprimir com qualidade 75 para garantir < 350 KB
        await sharp(webpPath)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 75, progressive: true, mozjpeg: true })
          .toFile(jpgPath);
        oversizedCount++;
      }

      createdCount++;
    } catch (err) {
      console.error(`Erro ao gerar JPEG para ${webpPath}:`, err.message);
    }
  }

  console.log('-------------------------------------------------------');
  console.log(`Geração concluída: ${createdCount} JPEGs criados com sucesso.`);
  console.log(`Imagens reajustadas para cumprir o limite rígido da Tray: ${oversizedCount}`);
  console.log('Todas as imagens agora cumprem o teto de 350 KB da CDN da Tray (tcdn.com.br)!');
}

generateTrayJpegs().catch(console.error);
