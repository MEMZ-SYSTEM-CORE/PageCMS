<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
  <title>关于 — {siteConfig.siteName}</title>
  <meta name="description" content="关于 {siteConfig.siteName}" />
  <meta property="og:title" content="关于 {siteConfig.siteName}" />
  <meta property="og:description" content="关于 {siteConfig.siteName}" />
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12 mo-fade-in-up">
  <Card.Root class="relative overflow-hidden">
    <Card.Header class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <Card.Title class="text-center text-5xl font-black tracking-widest text-foreground/[0.04] dark:text-foreground/[0.06] select-none">关于</Card.Title>
    </Card.Header>
    <Card.Content class="relative z-10">
      <div class="space-y-4">
        <div class="text-center mb-6">
          <img src={siteConfig.avatar} alt={siteConfig.bio.name} class="h-24 w-24 rounded-full mx-auto mb-4" referrerpolicy="no-referrer" />
          <h1 class="text-2xl font-bold">{siteConfig.bio.name}</h1>
          <p class="text-muted-foreground mt-1">{siteConfig.description}</p>
        </div>
        <div class="prose prose-neutral dark:prose-invert max-w-none mx-auto">
          <p>一个个人博客，分享技术、想法和经验。</p>
          <p>
            <a href={siteConfig.url} target="_blank" rel="noopener noreferrer">博客主页</a>
            &middot;
            <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer">Bilibili</a>
          </p>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
