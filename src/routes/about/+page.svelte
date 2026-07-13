<script lang="ts">
  import { siteConfig } from '$lib/config/site';
</script>

<svelte:head>
  <title>关于 — {siteConfig.siteName}</title>
  <meta name="description" content="关于 {siteConfig.siteName}" property="og:title" />
  <meta property="og:title" content="关于 {siteConfig.siteName}" />
  <meta property="og:description" content="关于 {siteConfig.siteName}" />
</svelte:head>

<div class="mx-auto max-w-2xl mo-fade-in-up">
  <h1 class="mb-6 text-3xl font-bold tracking-tight">关于</h1>
  <div class="prose">
    <p>这里是 <strong>{siteConfig.siteName}</strong> 的个人博客。</p>
    <p>分享技术、想法和经验。</p>
    <p>
      <a href={siteConfig.url} target="_blank" rel="noopener noreferrer">博客主页</a>
      ·
      <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer">Bilibili</a>
    </p>
  </div>
</div>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
