import { siteConfig } from "@/lib/config/site";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `关于 — ${siteConfig.siteName}`,
  description: `关于 ${siteConfig.siteName}`,
  openGraph: {
    title: `关于 ${siteConfig.siteName}`,
    description: `关于 ${siteConfig.siteName}`,
  },
};

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="hero-glow" />
      <div className="container mx-auto max-w-2xl px-4 py-16 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <img
            src={siteConfig.avatar}
            alt={siteConfig.bio.name}
            className="h-24 w-24 rounded-full mx-auto mb-5 ring-2 ring-border/50"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{siteConfig.bio.name}</h1>
          <p className="text-muted-foreground mt-2">{siteConfig.description}</p>
        </div>

        <div className="animate-fade-in animate-fade-in-delay-1">
          <Card className="rounded-xl border bg-card/50">
            <CardContent className="p-6 sm:p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none mx-auto prose-p:leading-relaxed">
                <p>一个个人博客，分享技术、想法和经验。</p>
                <p>
                  <a href={siteConfig.url} target="_blank" rel="noopener noreferrer">博客主页</a>
                  &middot;
                  <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer">Bilibili</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
