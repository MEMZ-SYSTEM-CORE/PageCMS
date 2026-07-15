import Link from "next/link";
import { getAllPosts } from "@/lib/content-server";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PrevNextNavProps {
  currentSlug: string;
}

export function PrevNextNav({ currentSlug }: PrevNextNavProps) {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) return null;

  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-12 border-t border-border pt-8">
      <div className="grid grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="group flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card/30 p-4 hover:bg-card transition-all duration-200 no-underline"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ChevronLeft className="size-3" />
              上一篇
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="group flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card/30 p-4 hover:bg-card transition-all duration-200 text-right no-underline"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              下一篇
              <ChevronRight className="size-3" />
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
