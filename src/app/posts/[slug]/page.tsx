import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllSlugs } from "@/lib/content-server";
import { siteConfig } from "@/lib/config/site";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatDate, readingTime, cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/markdown-content";
import { PostComments } from "@/components/post-comments";
import { PostMediaEmbed } from "@/components/post-media-embed";
import { TableOfContents } from "@/components/table-of-contents";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — ${siteConfig.siteName}`,
    description: post.description || "阅读文章",
    openGraph: {
      title: post.title,
      description: post.description || "阅读文章",
      type: "article",
      publishedTime: post.pubDate.toISOString(),
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || "阅读文章",
      images: post.image ? [post.image] : [],
    },
    keywords: post.tags?.filter(Boolean).join(", "),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const dateStr = formatDate(post.pubDate);
  const isoDate = post.pubDate.toISOString();
  const readTime = readingTime(post.description);

  return (
    <div className="relative">
      <div className="hero-glow" />
      <article className="container mx-auto max-w-5xl px-4 py-10 relative z-10">
        <div className="flex gap-8 justify-center">
          <div className="min-w-0 max-w-3xl flex-1">
            <BlurFade inView>
              <header className="mb-10">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                  <ArrowLeft className="size-3.5" />
                  返回
                </Link>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <time dateTime={isoDate}>{dateStr}</time>
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {readTime} 分钟阅读
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
                {post.description && (
                  <p className="mt-3 text-lg text-muted-foreground/80 leading-relaxed">{post.description}</p>
                )}
                {post.image && (
                  <div className="mt-6 -mx-2 sm:mx-0">
                    <img src={post.image} alt={post.title} className="w-full rounded-xl object-cover border border-border/50" loading="lazy" />
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-5 flex gap-2 flex-wrap">
                    {post.tags.filter(Boolean).map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full px-3">{tag}</Badge>
                    ))}
                  </div>
                )}
              </header>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <div id="prose-content" className="prose prose-neutral dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] prose-headings:text-foreground prose-headings:scroll-mt-14 prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:break-all prose-a:transition-opacity prose-a:hover:opacity-80 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:px-4 prose-pre:py-2 prose-pre:text-foreground prose-pre:overflow-x-auto prose-hr:border-border prose-th:border prose-th:border-border prose-th:bg-muted prose-td:border prose-td:border-border prose-img:rounded-lg">
                <MarkdownContent content={post.body} />
              </div>
            </BlurFade>

            <PostMediaEmbed />

            <BlurFade delay={0.15} inView>
              <footer className="mt-14">
                <PostComments />
                <div className="text-center mt-8">
                  <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4" />
                    返回首页
                  </Link>
                </div>
              </footer>
            </BlurFade>
          </div>

          <aside className="hidden xl:block w-52 shrink-0 pt-16">
            <TableOfContents />
          </aside>
        </div>
      </article>
    </div>
  );
}
