import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const produtosDir = path.join(projectRoot, 'public', 'produtos');

function getAllImageFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllImageFiles(fullPath, fileList);
    } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function optimizeImages() {
  console.log('--- INICIANDO PADRONIZAÇÃO E OTIMIZAÇÃO DE FOTOS ---');
  console.log('Diretório de produtos:', produtosDir);

  const imagesToConvert = getAllImageFiles(produtosDir);
  console.log(`Encontradas ${imagesToConvert.length} imagens (.png / .jpg) para conversão.`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  let successCount = 0;

  for (const srcPath of imagesToConvert) {
    const ext = path.extname(srcPath);
    const targetPath = srcPath.slice(0, -ext.length) + '.webp';
    const originalSize = fs.statSync(srcPath).size;
    totalOriginalBytes += originalSize;

    try {
      // Ler imagem com Sharp
      const image = sharp(srcPath);
      const metadata = await image.metadata();

      // Redimensionar mantendo proporção (max 1200x1200, sem distorcer)
      await image
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 5,
        })
        .toFile(targetPath);

      const newSize = fs.statSync(targetPath).size;
      totalOptimizedBytes += newSize;
      successCount++;

      const relOld = path.relative(produtosDir, srcPath);
      const relNew = path.relative(produtosDir, targetPath);
      const reduction = Math.round((1 - newSize / originalSize) * 100);

      console.log(
        `✓ [${successCount}/${imagesToConvert.length}] ${relOld} (${Math.round(originalSize / 1024)} KB) -> ${relNew} (${Math.round(newSize / 1024)} KB) [-${reduction}%]`
      );
    } catch (err) {
      console.error(`✗ Erro ao otimizar ${srcPath}:`, err.message);
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Conversão concluída com sucesso: ${successCount} arquivos convertidos.`);
  console.log(`Peso original total: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Peso otimizado total: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
  const totalSavedMb = ((totalOriginalBytes - totalOptimizedBytes) / (1024 * 1024)).toFixed(2);
  const totalSavedPct = Math.round((1 - totalOptimizedBytes / totalOriginalBytes) * 100);
  console.log(`Economia total de banda: ${totalSavedMb} MB (-${totalSavedPct}%)!`);
}

optimizeImages().catch(console.error);
