import type { ServerLoad } from './$types';
import { parseFrontmatter, slugFromFile } from '$lib/utils';

const postModules = import.meta.glob('/src/content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });

export const load: ServerLoad = () => {
  const posts: Array<{
    slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[];
  }> = [];

  for (const [path, content] of Object.entries(postModules)) {
    if (typeof content !== 'string') continue;
    const data = parseFrontmatter(content).data;
    if (data.draft) continue;
    posts.push({
      slug: slugFromFile(path),
      title: data.title || '',
      pubDate: data.pubDate ? new Date(data.pubDate) : new Date(),
      description: data.description,
      image: data.image,
      tags: data.tags || [],
    });
  }

  posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return { posts };
};
