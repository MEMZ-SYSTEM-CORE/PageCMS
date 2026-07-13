import type { EntryGenerator, ServerLoad } from './$types';

const postModules = import.meta.glob('/src/content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });

export const entries: EntryGenerator = () => {
  const slugs: string[] = [];
  for (const [path, content] of Object.entries(postModules)) {
    if (typeof content !== 'string') continue;
    const data = parseFrontmatter(content).data;
    if (data.draft) continue;
    const slug = path.split('/').pop()?.replace(/\.md$/i, '') || '';
    if (slug) slugs.push(slug);
  }
  return slugs.map((slug) => ({ slug }));
};

export const load: ServerLoad = async ({ params }) => {
  const slug = params.slug;

  for (const [path, content] of Object.entries(postModules)) {
    if (typeof content !== 'string') continue;
    const fileSlug = path.split('/').pop()?.replace(/\.md$/i, '') || '';
    if (fileSlug !== slug) continue;

    const { data, body } = parseFrontmatter(content);
    return {
      post: {
        slug,
        title: data.title || '',
        pubDate: data.pubDate ? new Date(data.pubDate) : new Date(),
        description: data.description,
        image: data.image,
        tags: data.tags || [],
        body,
      },
    };
  }

  return { status: 404 };
};

function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const fm = match[1];
  const body = match[2].trim();
  const data: Record<string, unknown> = {};
  for (const line of fm.split('\n')) {
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
  return { data, body };
}
