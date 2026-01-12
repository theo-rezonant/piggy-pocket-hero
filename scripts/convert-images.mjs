import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function convertImage() {
  const inputPath = path.join(rootDir, 'src/assets/hero-phone.webp');
  const outputDir = path.join(rootDir, 'src/assets');

  // Get the original dimensions
  const metadata = await sharp(inputPath).metadata();
  console.log('Original dimensions:', metadata.width, 'x', metadata.height);

  // Generate different sizes and formats
  // 280 is the base size shown on mobile, 560 for 2x retina, 840 for 3x retina
  const sizes = [
    { width: 280, suffix: '280' },
    { width: 560, suffix: '560' },
    { width: 840, suffix: '840' }
  ];

  for (const size of sizes) {
    // Generate WebP versions at different sizes
    await sharp(inputPath)
      .resize(size.width)
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `hero-phone-${size.suffix}.webp`));
    console.log(`Created hero-phone-${size.suffix}.webp`);

    // Generate AVIF versions at different sizes
    await sharp(inputPath)
      .resize(size.width)
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `hero-phone-${size.suffix}.avif`));
    console.log(`Created hero-phone-${size.suffix}.avif`);
  }

  console.log('Image conversion complete!');
}

convertImage().catch(console.error);
