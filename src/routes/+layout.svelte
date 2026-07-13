<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { siteConfig } from '$lib/config/site';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { themeMode } from '$lib/stores/theme';

  let { children } = $props();

  let isHomePage = $derived($page.route.id === '/');

  // Apply stored theme on page navigation
  $effect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      themeMode.set(stored);
    }
  });
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <link rel="icon" href={siteConfig.icon} />
  <meta name="description" content={siteConfig.description} />
  <meta property="og:site_name" content={siteConfig.title} />
  <meta property="og:locale" content={siteConfig.lang} />
  {#if isHomePage}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={siteConfig.url} />
    <meta property="og:title" content={siteConfig.title} />
    <meta property="og:description" content={siteConfig.description} />
    <meta property="og:image" content={siteConfig.url + siteConfig.ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={siteConfig.title} />
    <meta name="twitter:description" content={siteConfig.description} />
    <meta name="twitter:image" content={siteConfig.url + siteConfig.ogImage} />
  {/if}
  <link rel="alternate" type="application/rss+xml" title="{siteConfig.title} RSS Feed" href="/rss.xml" />
</svelte:head>

<NavBar />

<main class="mx-auto max-w-5xl px-4 py-8 min-h-[calc(100vh-8rem)]">
  {@render children()}
</main>

<Footer />
