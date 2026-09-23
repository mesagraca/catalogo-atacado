import sharp from "sharp";

export const IMAGE_SPEC = {
  width: 1500,
  height: 1500,
  maxBytes: 500 * 1024,
} as const;

export type ProcessedCatalogImage = {
  buffer: Buffer;
  width: number;
  height: number;
  bytes: number;
};

export async function processCatalogImage(input: Buffer): Promise<ProcessedCatalogImage> {
  const source = sharp(input, { limitInputPixels: 40_000_000 }).rotate();
  const metadata = await source.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Não foi possível identificar as dimensões da imagem.");
  }

  for (let quality = 86; quality >= 54; quality -= 4) {
    const buffer = await source
      .clone()
      .resize(IMAGE_SPEC.width, IMAGE_SPEC.height, {
        fit: "cover",
        position: "attention",
      })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();

    if (buffer.byteLength <= IMAGE_SPEC.maxBytes) {
      return {
        buffer,
        width: IMAGE_SPEC.width,
        height: IMAGE_SPEC.height,
        bytes: buffer.byteLength,
      };
    }
  }

  throw new Error(
    "A imagem não atingiu 500 KB com qualidade comercial segura. Envie um original menos detalhado.",
  );
}
