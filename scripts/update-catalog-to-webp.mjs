import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const catalogFile = path.join(projectRoot, 'src', 'types', 'catalog.ts');

let content = fs.readFileSync(catalogFile, 'utf-8');

// Substituir extensões dentro de strings "/produtos/..."
const regex = /(\/produtos\/[^\s"')]+)\.(png|jpg|jpeg)/g;
let replacements = 0;

content = content.replace(regex, (match, base) => {
  const webpPath = `${base}.webp`;
  const localFile = path.join(projectRoot, 'public', webpPath.replace(/^\//, ''));
  if (fs.existsSync(localFile)) {
    replacements++;
    return webpPath;
  } else {
    console.warn(`Atenção: arquivo não existe no disco: ${localFile}`);
    return match;
  }
});

fs.writeFileSync(catalogFile, content, 'utf-8');
console.log(`Substituições realizadas com sucesso em catalog.ts: ${replacements}`);
