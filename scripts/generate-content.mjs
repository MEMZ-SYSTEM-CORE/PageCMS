/**
 * Build-time content generator
 * Reads all markdown files and generates:
 * 1. A JSON bundle for the Next.js app
 * 2. Static RSS XML and sitemap XML files
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(root, 'src', 'content');
const OUTPUT_FILE = path.join(root, 'src', 'lib', 'content-data.json');
const PUBLIC_DIR = path.join(root, 'public');

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const fm = match[1];
  const body = match[2].trim();
  const data = {};
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^\d+$/.test(String(value))) value = parseInt(String(value), 10);
    else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) value = d.toISOString();
    } else if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    data[key] = value;
  }
  return { data, body };
}

function slugFromFile(filePath) {
  return filePath.split(/[/\\]/).pop().replace(/\.md$/i, '');
}

// Read all posts
const postsDir = path.join(CONTENT_DIR, 'posts');
const posts = [];

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(content);
    posts.push({
      slug: slugFromFile(file),
      title: data.title || '',
      pubDate: data.pubDate || new Date().toISOString(),
      description: data.description || '',
      image: data.image || '',
      tags: data.tags || [],
      draft: data.draft || false,
      body,
    });
  }
}

// Read pages
const pagesDir = path.join(CONTENT_DIR, 'pages');
const pages = [];

if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(content);
    pages.push({
      slug: slugFromFile(file),
      title: data.title || '',
      description: data.description || '',
      body,
    });
  }
}

// Read settings
const settingsPath = path.join(CONTENT_DIR, 'settings', 'site.md');
let settings = {};
if (fs.existsSync(settingsPath)) {
  const content = fs.readFileSync(settingsPath, 'utf-8');
  const { data } = parseFrontmatter(content);
  settings = data;
}

// Write JSON data
const output = { posts, pages, settings };
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`✅ Generated content data: ${posts.length} posts, ${pages.length} pages`);

// Generate RSS XML
const published = posts.filter(p => !p.draft).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
const siteUrl = settings.siteUrl || 'https://pagecms.mscweb.workers.dev';
const siteName = settings.siteName || 'PageCMS';

const rssItems = published.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid>${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ''}
      ${post.tags?.filter(Boolean).map(t => `<category>${t}</category>`).join('\n') || ''}
    </item>`).join('');

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}/</link>
    <description>${settings.tagline || ''}</description>
    <language>zh-CN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rssXml);
console.log(`✅ Generated RSS feed: ${published.length} items`);

// Generate sitemap XML
const sitemapUrls = [
  `${siteUrl}/`,
  `${siteUrl}/about`,
  `${siteUrl}/cover`,
  `${siteUrl}/posts`,
  ...published.map(p => `${siteUrl}/posts/${p.slug}`),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
console.log(`✅ Generated sitemap: ${sitemapUrls.length} URLs`);

