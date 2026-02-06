import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogs } from './src/blogsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://godofblogs.xyz";

const generateRSS = () => {
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>God of Blogs | Willie Liwa Johnson</title>
  <link>${baseUrl}</link>
  <description>A professional journal dedicated to the exploration of Divine Love, the complexities of Life, and the Sovereignty of God.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
`;

  blogs.forEach(blog => {
    rss += `
  <item>
    <title>${blog.title}</title>
    <link>${baseUrl}/post/${blog.id}</link>
    <guid>${baseUrl}/post/${blog.id}</guid>
    <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
    <description>${blog.summary}</description>
    <category>${blog.category}</category>
    <author>willie@godofblogs.xyz (Willie Liwa Johnson)</author>
  </item>`;
  });

  rss += `
</channel>
</rss>`;

  fs.writeFileSync(path.join(__dirname, 'public', 'feed.xml'), rss, 'utf8');
  console.log('RSS Feed generated successfully at public/feed.xml');
};

generateRSS();
