import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogs } from './src/blogsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const siteUrl = "https://godofblogs.xyz";

const generateSeoPages = () => {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Build not found. Run npm run build first.');
    return;
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  blogs.forEach(blog => {
    const postDir = path.join(DIST_DIR, 'post', blog.id);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const title = `${blog.title} | Willie Liwa Johnson`;
    const desc = blog.summary;
    const imageUrl = blog.socialImage?.startsWith('http') ? blog.socialImage : `${siteUrl}${blog.socialImage || blog.previewImageUrl}`;
    const url = `${siteUrl}/post/${blog.id}`;

    let customizedHtml = indexHtml
      .replace(/<title>.*?<\/title>/g, `<title>${title}</title>`)
      .replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${title}" />`)
      .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${desc}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${imageUrl}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${url}" />`)
      .replace(/<meta property="twitter:title" content=".*?" \/>/g, `<meta property="twitter:title" content="${title}" />`)
      .replace(/<meta property="twitter:description" content=".*?" \/>/g, `<meta property="twitter:description" content="${desc}" />`)
      .replace(/<meta property="twitter:image" content=".*?" \/>/g, `<meta property="twitter:image" content="${imageUrl}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${url}" />`);

    fs.writeFileSync(path.join(postDir, 'index.html'), customizedHtml, 'utf8');
    console.log(`  ✓ SEO Page generated for: ${blog.id}`);
  });

  // Generate About Page
  const aboutDir = path.join(DIST_DIR, 'about');
  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true });
  }
  const aboutTitle = "About Willie Liwa Johnson | God of Blogs";
  const aboutDesc = "Author, Explorer, and Servant of the Word. Founder of Divine Reflections.";
  const aboutUrl = `${siteUrl}/about`;
  const aboutImage = `${siteUrl}/assets/covers/author.png`;

  let aboutHtml = indexHtml
    .replace(/<title>.*?<\/title>/g, `<title>${aboutTitle}</title>`)
    .replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${aboutTitle}" />`)
    .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${aboutDesc}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${aboutTitle}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${aboutDesc}" />`)
    .replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${aboutImage}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${aboutUrl}" />`)
    .replace(/<meta property="twitter:title" content=".*?" \/>/g, `<meta property="twitter:title" content="${aboutTitle}" />`)
    .replace(/<meta property="twitter:description" content=".*?" \/>/g, `<meta property="twitter:description" content="${aboutDesc}" />`)
    .replace(/<meta property="twitter:image" content=".*?" \/>/g, `<meta property="twitter:image" content="${aboutImage}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${aboutUrl}" />`);

  fs.writeFileSync(path.join(aboutDir, 'index.html'), aboutHtml, 'utf8');
  console.log('  ✓ SEO Page generated for: About');

  console.log('Static SEO Page Generation complete.');
};

generateSeoPages();
