import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { getAllPosts, getAllTags } from "@/lib/content-server";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShineBorder } from "@/components/magicui/shine-border";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ChevronRight, Calendar, Clock, Eye, Tag, Pin } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";

export default function HomePage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <BlurFade delay={0} inView>
        <div className="relative inline-block rounded-full">
          <Link href={siteConfig.bio.links[0]?.url || '/'} target="_blank" rel="noopener noreferrer">
            <img
              src={siteConfig.avatar}
              alt={siteConfig.bio.name}
              className="relative h-32 w-32 rounded-full object-cover ring-2 ring-border"
              referrerPolicy="no-referrer"
            />
          </Link>
          <ShineBorder shineColor="oklch(0.6 0.15 250 / 0.3)" borderWidth={2} duration={10} />
        </div>
      </BlurFade>

      <BlurFade delay={0.08} inView className="text-center">
        <AnimatedShinyText shimmerWidth={150} className="text-4xl font-bold justify-center">
          {siteConfig.bio.name}
        </AnimatedShinyText>
        <p className="text-lg text-muted-foreground mt-2">{siteConfig.bio.description || siteConfig.description}</p>
        <p className="text-sm text-muted-foreground mt-1">{posts.length} 篇文章 · {allTags.length} 个标签</p>
      </BlurFade>

      {posts.length > 0 && (
        <BlurFade delay={0.16} inView className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">最新</h2>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
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
                      {post.tags?.filter(Boolean).slice(0, 2).map((tag) => (
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
            ))}
            {posts.length > 5 && (
              <div className="text-center pt-1">
                <Link href="/posts" className="text-xs text-muted-foreground hover:text-foreground transition-colors">查看全部 →</Link>
              </div>
            )}
          </div>
        </BlurFade>
      )}

      {allTags.length > 0 && (
        <BlurFade delay={0.24} inView className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">标签</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-xs font-normal">{tag}</Badge>
            ))}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.32} inView className="w-full max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">导航</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {siteConfig.navLinks.map((link) => (
            <RainbowButton key={link.href} variant="outline" asChild>
              <a href={link.href}>
                {link.label}
                <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
              </a>
            </RainbowButton>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={0.4} inView className="w-full max-w-2xl mx-auto pb-8">
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">社交</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <RainbowButton asChild>
            <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer">
              B站主页
              <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
            </a>
          </RainbowButton>
          <RainbowButton asChild>
            <a href="https://github.com/MEMZ-SYSTEM-CORE" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
              <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
            </a>
          </RainbowButton>
        </div>
      </BlurFade>
    </div>
  );
}
