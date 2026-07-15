"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Tag, Search, BookOpen } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import type { Post, SiteConfig } from "@/lib/config/site";

interface PostsListProps {
  posts: Post[];
  siteConfig: SiteConfig;
}

export function PostsList({ posts, siteConfig }: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    title: true,
    description: true,
    tags: true,
  });

  const hasAnyFilter = searchFilters.title || searchFilters.description || searchFilters.tags;

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts.map((p) => ({ post: p, matched: true }));
    const q = searchQuery.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return posts.map((p) => {
      const fields: string[] = [];
      if (searchFilters.title) fields.push(p.title.toLowerCase());
      if (searchFilters.description) fields.push((p.description || "").toLowerCase());
      if (searchFilters.tags) fields.push((p.tags || []).join(" ").toLowerCase());
      const match = terms.every((t) => fields.some((f) => f.includes(t)));
      return { post: p, matched: match };
    }).filter(({ matched }) => matched);
  }, [posts, searchQuery, searchFilters]);

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
          <div className="mt-3 flex flex-wrap gap-4 justify-center">
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Checkbox checked={searchFilters.title} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, title: checked })} />
              <span>标题</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Checkbox checked={searchFilters.description} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, description: checked })} />
              <span>简介</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Checkbox checked={searchFilters.tags} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, tags: checked })} />
              <span>标签</span>
            </label>
          </div>
          {searchQuery && (
            <div className="mt-2 text-center text-sm">
              {!hasAnyFilter ? (
                <p className="text-red-500/80">请至少选择一个搜索范围</p>
              ) : filteredPosts.length === 0 ? (
                <p className="text-muted-foreground">未找到匹配的文章</p>
              ) : (
                <p className="text-muted-foreground">找到 {filteredPosts.length} 篇文章</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(({ post }) => (
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
                    <h2 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                    {post.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{post.description}</p>
                    )}
                  </div>
                </article>
              </Link>
            ))
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
