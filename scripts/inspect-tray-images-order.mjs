import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const trayPluginPath = path.resolve(__dirname, '../../tray-api-ai-plugin');
const trayClientUrl = pathToFileURL(path.join(trayPluginPath, 'tray-client.mjs')).href;
const { apiRequest } = await import(trayClientUrl);

async function check() {
  const ids = [70, 71, 119, 120, 140, 141, 142, 176, 250, 251, 252];
  for (const id of ids) {
    const res = await apiRequest('GET', `/products/${id}`);
    const p = res.Product;
    console.log(`\n=== TRAY ID ${id}: ${p.name} ===`);
    if (p.ProductImage) {
      p.ProductImage.forEach((img, i) => {
        console.log(`  Foto ${i+1}: ${img.https || img.http}`);
      });
    }
  }
}

check().catch(console.error);
