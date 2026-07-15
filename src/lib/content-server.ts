import { parseFrontmatter, slugFromFile } from '@/lib/utils';
import type { Post } from '@/lib/config/site';

// Import pre-bundled content data (generated at build time)
// This avoids using fs module at runtime on Cloudflare Workers
import contentData from './content-data.json';

interface ContentEntry {
  slug: string;
  title: string;
  pubDate: string;
  description?: string;
  image?: string;
  tags?: string[];
  draft?: boolean;
  body: string;
  headings?: { id: string; text: string; level: number }[];
}

interface ContentData {
  posts: ContentEntry[];
  pages: { slug: string; title: string; description?: string; body: string }[];
  settings: Record<string, unknown>;
}

function getData(): ContentData {
  return contentData as unknown as ContentData;
}

export function getAllPosts(): Post[] {
  const data = getData();
  return data.posts
    .filter(p => !p.draft)
    .map(p => ({
      ...p,
      pubDate: new Date(p.pubDate),
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = posts.flatMap(p => p.tags || []).filter(Boolean);
  return [...new Set(tags)];
}

export function getAllSlugs(): string[] {
  return getAllPosts().map(p => p.slug);
}
