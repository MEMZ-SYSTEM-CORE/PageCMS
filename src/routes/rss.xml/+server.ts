import type { RequestHandler } from './$types';

const postModules = import.meta.glob('/src/content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });

export const prerender = true;

export const GET: RequestHandler = async () => {
  const posts: Array<{ title: string; pubDate: Date; description?: string; slug: string; tags?: string[] }> = [];

  for (const [path, content] of Object.entries(postModules)) {
    if (typeof content !== 'string') continue;
    const data = parseFrontmatter(content);
    if (data.draft) continue;
    const slug = path.split('/').pop()?.replace(/\.md$/i, '') || '';
    posts.push({
      title: data.title || '',
      pubDate: data.pubDate ? new Date(data.pubDate) : new Date(),
      description: data.description,
      slug,
      tags: data.tags || [],
    });
  }

  posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  const items = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://memz-system-core.pages.dev/posts/${post.slug}/</link>
      <guid>https://memz-system-core.pages.dev/posts/${post.slug}/</guid>
      <pubDate>${post.pubDate.toUTCString()}</pubDate>
      ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ''}
      ${post.tags?.filter(Boolean).map((t) => `<category>${t}</category>`).join('\n') || ''}
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MEMZ-SYSTEM-CORE</title>
    <link>https://memz-system-core.pages.dev/</link>
    <description>分享技术、想法和经验</description>
    <language>zh-CN</language>
    <atom:link href="https://memz-system-core.pages.dev/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return {};
  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value: unknown = line.slice(idx + 1).trim();
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^\d+$/.test(String(value))) value = parseInt(String(value), 10);
    else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) value = d;
    } else if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    data[key] = value;
  }
  return data;
}
