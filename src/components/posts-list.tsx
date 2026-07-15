"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Tag } from "lucide-react";
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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="mb-4 text-4xl font-bold">文章</h1>
        <p className="text-muted-foreground">{siteConfig.description}</p>
        <p className="mt-2 text-sm text-muted-foreground">共 {posts.length} 篇文章</p>
      </div>

      <div className="mb-8 animate-fade-in animate-fade-in-delay-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索文章标题、描述或标签..."
          className="w-full"
        />
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={searchFilters.title} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, title: checked })} />
            <span className="text-sm">标题</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={searchFilters.description} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, description: checked })} />
            <span className="text-sm">简介</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={searchFilters.tags} onCheckedChange={(checked) => setSearchFilters({ ...searchFilters, tags: checked })} />
            <span className="text-sm">标签</span>
          </label>
        </div>
        {searchQuery && (
          <div className="mt-2">
            {!hasAnyFilter ? (
              <p className="text-sm text-red-500">请至少选择一个搜索范围</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">未找到匹配的文章</p>
            ) : (
              <p className="text-sm text-muted-foreground">找到 {filteredPosts.length} 篇文章</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(({ post }) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group block rounded-lg border p-3 sm:p-5 hover:border-primary/50 hover:shadow-sm transition-all no-underline">
              <article className="flex gap-4 items-center">
                {post.image && (
                  <div className="shrink-0 self-center">
                    <img src={post.image} alt={post.title} loading="lazy" className="h-20 w-28 sm:h-24 sm:w-36 rounded-md object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap leading-none">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      <time dateTime={post.pubDate.toISOString()}>{formatDate(post.pubDate)}</time>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {readingTime(post.description)} 分钟
                    </span>
                    {post.tags?.filter(Boolean).slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag className="size-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                  {post.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                  )}
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{searchQuery ? "未找到匹配的文章" : "暂无文章"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
