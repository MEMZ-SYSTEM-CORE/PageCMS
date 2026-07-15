"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, BookOpen } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import type { Post, SiteConfig } from "@/lib/config/site";

/** 高亮匹配文本 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        terms.some(t => part.toLowerCase() === t) ? (
          <mark key={i} className="bg-yellow-200/60 dark:bg-yellow-500/30 text-inherit rounded-sm px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/** 从正文中提取匹配片段 */
function extractSnippet(body: string, query: string, maxLen: number = 120): string {
  if (!query.trim()) return "";
  const q = query.toLowerCase();
  const idx = body.toLowerCase().indexOf(q);
  if (idx === -1) return "";

  const start = Math.max(0, idx - 40);
  const end = Math.min(body.length, idx + q.length + 60);

  let snippet = body.slice(start, end).replace(/\n+/g, ' ');
  // Remove markdown syntax for cleaner snippet
  snippet = snippet.replace(/[#*`\[\]]/g, '').replace(/\s+/g, ' ').trim();

  if (start > 0) snippet = '…' + snippet;
  if (end < body.length) snippet = snippet + '…';

  return snippet;
}

interface PostsListProps {
  posts: Post[];
  siteConfig: SiteConfig;
}

export function PostsList({ posts, siteConfig }: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts.map((p) => ({ post: p, matched: true }));
    const q = searchQuery.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return posts.map((p) => {
      const fields: string[] = [
        p.title.toLowerCase(),
        (p.description || "").toLowerCase(),
        (p.tags || []).join(" ").toLowerCase(),
        (p.body || "").toLowerCase(),
      ];
      const match = terms.every((t) => fields.some((f) => f.includes(t)));
      return { post: p, matched: match };
    }).filter(({ matched }) => matched);
  }, [posts, searchQuery]);

  return (
    <div className="relative">
      <div className="hero-glow" />

      <div className="container mx-auto max-w-4xl px-4 py-12 relative z-10">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">文章</h1>
          <p className="text-muted-foreground">{siteConfig.description}</p>
          <p className="mt-2 text-sm text-muted-foreground/70 flex items-center justify-center gap-1.5">
            <BookOpen className="size-3.5" />
            共 {posts.length} 篇文章
          </p>
        </div>

        <div className="mb-8 animate-fade-in animate-fade-in-delay-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full pl-9 bg-background/50"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-center text-sm">
              {filteredPosts.length === 0 ? (
                <p className="text-muted-foreground">未找到匹配的文章</p>
              ) : (
                <p className="text-muted-foreground">找到 {filteredPosts.length} 篇文章</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(({ post }) => {
              const snippet = searchQuery.trim()
                ? extractSnippet(post.body || "", searchQuery)
                : "";

              return (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="group block rounded-xl border bg-card/50 hover:bg-card transition-all duration-200 p-5 post-card no-underline">
                  <article className="flex gap-5 items-start">
                    {post.image && (
                      <div className="shrink-0 self-center overflow-hidden rounded-lg">
                        <img src={post.image} alt={post.title} loading="lazy" className="h-24 w-36 sm:h-28 sm:w-44 rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                        <Calendar className="size-3" />
                        <time dateTime={post.pubDate.toISOString()}>{formatDate(post.pubDate)}</time>
                        <span aria-hidden="true">·</span>
                        <Clock className="size-3" />
                        <span>{readingTime(post.description)} 分钟</span>
                        {post.tags?.filter(Boolean).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">{tag}</Badge>
                        ))}
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors leading-snug">
                        <HighlightText text={post.title} query={searchQuery} />
                      </h2>
                      {snippet ? (
                        <p className="mt-1.5 text-sm text-muted-foreground/80 leading-relaxed">
                          <HighlightText text={snippet} query={searchQuery} />
                        </p>
                      ) : post.description ? (
                        <p className="mt-1.5 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                          <HighlightText text={post.description} query={searchQuery} />
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Link>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">{searchQuery ? "未找到匹配的文章" : "暂无文章"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
