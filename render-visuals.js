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

  console.log('Rendering complete. All social artifacts are now X.com compatible.');
};

renderVisuals();
