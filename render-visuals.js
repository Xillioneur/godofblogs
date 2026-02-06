import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COVERS_DIR = path.join(__dirname, 'public', 'assets', 'covers');

const renderVisuals = async () => {
  const files = fs.readdirSync(COVERS_DIR);
  const svgFiles = files.filter(f => f.endsWith('.svg'));

  console.log(`Bespoke Visual Engine: Rendering ${svgFiles.length} artifacts to PNG...`);

  for (const file of svgFiles) {
    const inputPath = path.join(COVERS_DIR, file);
    const outputPath = path.join(COVERS_DIR, file.replace('.svg', '.png'));

    try {
      await sharp(inputPath)
        .resize(1200, 630, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`  ✓ Rendered: ${file} -> ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`  ✗ Failed to render ${file}:`, err);
    }
  }

  // Generate Favicons & PWA Icons
  const logoPath = path.join(__dirname, 'public', 'assets', 'logo-source.svg');
  const logoWhitePath = path.join(__dirname, 'public', 'assets', 'logo-white.svg');
  const iconsDir = path.join(__dirname, 'public');

  console.log('Bespoke Visual Engine: Forging PWA Identity...');

  try {
    // Favicon (32x32)
    await sharp(logoPath).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon.png'));
    
    // Apple Touch Icon (180x180) - White on Black
    await sharp(logoWhitePath)
      .resize(180, 180, { background: { r: 0, g: 0, b: 0, alpha: 1 }, fit: 'contain', margin: 20 })
      .flatten({ background: '#000000' })
      .png()
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

    // PWA 192
    await sharp(logoWhitePath)
      .resize(192, 192, { background: { r: 0, g: 0, b: 0, alpha: 1 }, fit: 'contain', margin: 20 })
      .flatten({ background: '#000000' })
      .png()
      .toFile(path.join(iconsDir, 'icon-192.png'));

    // PWA 512
    await sharp(logoWhitePath)
      .resize(512, 512, { background: { r: 0, g: 0, b: 0, alpha: 1 }, fit: 'contain', margin: 50 })
      .flatten({ background: '#000000' })
      .png()
      .toFile(path.join(iconsDir, 'icon-512.png'));

    console.log('  ✓ Identity Artifacts Created: favicon, apple-touch, pwa-192, pwa-512');
  } catch (err) {
    console.error('  ✗ Failed to generate icons:', err);
  }

  console.log('Rendering complete. All social artifacts are now X.com compatible.');
};

renderVisuals();
