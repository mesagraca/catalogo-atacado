import { createRequire } from 'module';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/nando/.gemini/tray-api-ai-plugin/node_modules/sharp');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getImageWhitenessScore(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { score: 0, error: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    const image = sharp(buf);
    const meta = await image.metadata();
    const { width, height } = meta;
    if (!width || !height) return { score: 0, error: 'No dimensions' };

    // Resize to small 100x100 to quickly inspect outer border and corners
    const { data, info } = await sharp(buf)
      .resize(100, 100, { fit: 'fill' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const getPixel = (x, y) => {
      const idx = (y * 100 + x) * channels;
      return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    };

    // Sample the 4 corners (5x5 pixels each)
    let cornerSum = 0;
    let sampleCount = 0;
    const cornerCoords = [
      [0, 0], [99, 0], [0, 99], [99, 99],
      [1, 1], [98, 1], [1, 98], [98, 98],
      [5, 5], [94, 5], [5, 94], [94, 94]
    ];
    for (const [cx, cy] of cornerCoords) {
      cornerSum += getPixel(cx, cy);
      sampleCount++;
    }
    const avgCornerBrightness = cornerSum / sampleCount;
    return { score: avgCornerBrightness, width, height };
  } catch (err) {
    return { score: 0, error: err.message };
  }
}

async function run() {
  console.log('--- ENFORCING STUDIO / WHITE BACKGROUND COVERS ON ALL PRODUCTS ---');
  const { data: products, error } = await supabase
    .from('produtos')
    .select('id, name, media, photos:fotos(*)');

  if (error || !products) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Fetched ${products.length} products from Supabase.`);

  let updatedCount = 0;
  let alreadyCorrectCount = 0;
  let singlePhotoCount = 0;

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const photos = prod.photos || [];
    const mediaImages = prod.media?.images || [];

    if (photos.length <= 1 && mediaImages.length <= 1) {
      singlePhotoCount++;
      // Still ensure single photo has is_cover: true, type: 'studio'
      if (photos.length === 1 && (!photos[0].is_cover || photos[0].type !== 'studio')) {
        await supabase.from('fotos').update({ is_cover: true, type: 'studio', sort_order: 0 }).eq('id', photos[0].id);
      }
      continue;
    }

    // Evaluate photos
    const candidateUrls = [];
    for (const p of photos) {
      if (!candidateUrls.some(c => c.url === p.url)) {
        candidateUrls.push({ photoId: p.id, url: p.url, source: 'fotos' });
      }
    }
    for (const m of mediaImages) {
      if (!candidateUrls.some(c => c.url === m.url)) {
        candidateUrls.push({ photoId: null, url: m.url, source: 'media' });
      }
    }

    console.log(`\n[${i + 1}/${products.length}] ${prod.name} (${prod.id}) - ${candidateUrls.length} photos:`);

    const scored = [];
    for (const c of candidateUrls) {
      const { score, error: imgErr } = await getImageWhitenessScore(c.url);
      console.log(`  - ${c.url.split('/').pop().slice(0, 50)}... Score: ${score.toFixed(1)} ${imgErr ? `(Error: ${imgErr})` : ''}`);
      scored.push({ ...c, score });
    }

    // Sort by whiteness score descending (pure white > 240 is at the top)
    scored.sort((a, b) => b.score - a.score);

    const studioPhoto = scored[0];
    const editorialPhoto = scored[1] || null;

    // Check if current cover is already the studio photo
    const currentCoverPhoto = photos.find(p => p.is_cover);
    const currentCoverMedia = mediaImages.find(m => m.is_cover);
    const currentCoverUrl = currentCoverPhoto?.url || currentCoverMedia?.url;

    if (currentCoverUrl === studioPhoto.url && photos.find(p => p.url === studioPhoto.url)?.is_cover) {
      console.log(`  => Already correct. Studio photo is already cover.`);
      alreadyCorrectCount++;
      continue;
    }

    console.log(`  => INVERTING/UPDATING COVER: Set ${studioPhoto.url.split('/').pop().slice(0, 40)} as STUDIO COVER`);

    // 1. Update photos table
    for (const s of scored) {
      if (s.photoId) {
        const isCover = s.url === studioPhoto.url;
        const photoType = isCover ? 'studio' : 'editorial';
        const sortOrder = isCover ? 0 : 1;
        await supabase
          .from('fotos')
          .update({ is_cover: isCover, type: photoType, sort_order: sortOrder })
          .eq('id', s.photoId);
      }
    }

    // 2. Update media in produtos table
    const updatedMediaImages = scored.map((s, idx) => {
      const isCover = idx === 0;
      const originalObj = mediaImages.find(m => m.url === s.url) || photos.find(p => p.url === s.url);
      return {
        url: s.url,
        url_webp: originalObj?.url_webp || s.url.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
        alt: `${prod.name} - ${isCover ? 'Foto de Estúdio' : 'Mesa Posta em Uso'}`,
        type: isCover ? 'studio' : 'editorial',
        is_cover: isCover,
        sort_order: idx
      };
    });

    await supabase
      .from('produtos')
      .update({ media: { images: updatedMediaImages } })
      .eq('id', prod.id);

    updatedCount++;
  }

  console.log('\n=============================================');
  console.log(`SUMMARY OF STUDIO COVER ENFORCEMENT:`);
  console.log(`- Total products: ${products.length}`);
  console.log(`- Updated to studio covers: ${updatedCount}`);
  console.log(`- Already had studio covers: ${alreadyCorrectCount}`);
  console.log(`- Single photo products: ${singlePhotoCount}`);
  console.log('=============================================\n');
}

run();
