import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllSlugs } from "@/lib/content-server";
import { siteConfig } from "@/lib/config/site";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/magicui/blur-fade";
import { formatDate, readingTime } from "@/lib/utils";
import { MarkdownContent } from "@/components/markdown-content";
import { PostComments } from "@/components/post-comments";
import { PostMediaEmbed } from "@/components/post-media-embed";
import { TableOfContents } from "@/components/table-of-contents";
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
    <article className="container mx-auto max-w-5xl px-4 py-12">
      <div className="flex gap-8 justify-center">
        {/* Main Content */}
        <div className="min-w-0 max-w-3xl flex-1">
          <BlurFade inView>
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={isoDate}>{dateStr}</time>
                <span className="text-muted-foreground/30">·</span>
                <span>{readTime} 分钟阅读</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
              {post.description && <p className="text-lg text-muted-foreground">{post.description}</p>}
              {post.image && (
                <div className="mt-6">
                  <img src={post.image} alt={post.title} className="w-full rounded-lg object-cover" loading="lazy" />
                </div>
              )}
              {post.tags?.length && (
                <div className="mt-4 flex gap-2">
                  {post.tags.filter(Boolean).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </header>
          </BlurFade>

          <BlurFade delay={0.12} inView>
            <div className="rounded-lg border p-6 sm:p-8 hover:border-primary/50 transition-all">
              <div id="prose-content" className="prose prose-neutral dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] prose-headings:text-foreground prose-headings:scroll-mt-14 prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:break-all prose-a:transition-opacity prose-a:hover:opacity-80 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:px-4 prose-pre:py-2 prose-pre:text-foreground prose-pre:overflow-x-auto prose-hr:border-border prose-th:border prose-th:border-border prose-th:bg-muted prose-td:border prose-td:border-border prose-img:rounded-lg">
                <MarkdownContent content={post.body} />
              </div>
            </div>
          </BlurFade>

          <PostMediaEmbed />

          <BlurFade delay={0.2} inView>
            <footer className="mt-12 border-t pt-8">
              <PostComments />
              <div className="text-center mt-6">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← 返回首页</Link>
              </div>
            </footer>
          </BlurFade>
        </div>

        {/* Sidebar TOC - only visible on xl screens */}
        <aside className="hidden xl:block w-52 shrink-0 pt-12">
          <TableOfContents />
        </aside>
      </div>
    </article>
  );
}
