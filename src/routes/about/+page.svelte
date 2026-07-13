<script lang="ts">
  import { siteConfig } from '$lib/config/site';
</script>

<svelte:head>
  <title>关于 — {siteConfig.siteName}</title>
  <meta name="description" content="关于 {siteConfig.siteName}" />
  <meta property="og:title" content="关于 {siteConfig.siteName}" />
  <meta property="og:description" content="关于 {siteConfig.siteName}" />
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12 mo-fade-in-up">
  <div class="text-center mb-8">
    <img src={siteConfig.avatar} alt={siteConfig.bio.name} class="h-24 w-24 rounded-full mx-auto mb-4" referrerpolicy="no-referrer" />
    <h1 class="text-3xl font-bold">{siteConfig.bio.name}</h1>
    <p class="text-muted-foreground mt-2">{siteConfig.description}</p>
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

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
