<script lang="ts">
  import { siteConfig } from '$lib/config/site';
</script>

<svelte:head>
  <title>About — {siteConfig.siteName}</title>
  <meta name="description" content="About {siteConfig.siteName}" />
  <meta property="og:title" content="About {siteConfig.siteName}" />
  <meta property="og:description" content="About {siteConfig.siteName}" />
</svelte:head>

<div class="mx-auto max-w-2xl mo-fade-in-up">
  <h1 class="mb-6 text-3xl font-bold tracking-tight">About</h1>
  <div class="prose">
    <p><strong>{siteConfig.siteName}</strong> is a personal blog sharing technology, ideas, and experiences.</p>
    <p>
      <a href={siteConfig.url} target="_blank" rel="noopener noreferrer">Home</a>
      &middot;
      <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer">Bilibili</a>
    </p>
  </div>
</div>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
