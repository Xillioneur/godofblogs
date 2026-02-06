import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogs } from './src/blogsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://godofblogs.xyz";

const generateSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // Home
  sitemap += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
`;
  
  // About Page
  sitemap += `  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
`;

  // Blog Posts
  blogs.forEach(blog => {
    sitemap += `  <url><loc>${baseUrl}/post/${blog.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
`;
  });
  
  sitemap += `</urlset>`;

  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
