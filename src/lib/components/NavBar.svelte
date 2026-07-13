<script lang="ts">
  import { page } from '$app/stores';
  import { siteConfig } from '$lib/config/site';
  import ThemeToggle from './ThemeToggle.svelte';

  let crumbs = $derived.by(() => {
    const path = $page.url.pathname.replace(/\/$/, '') || '/';
    if (path === '/') return [];
    const parts = path.split('/').filter(Boolean);
    const result: { label: string; href: string }[] = [];
    let accumulated = '';
    for (let i = 0; i < parts.length; i++) {
      accumulated += '/' + parts[i];
      result.push({ label: parts[i], href: accumulated });
    }
    return result;
  });
</script>

<nav class="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
  <div class="relative flex h-10 items-center justify-between px-4 mx-auto max-w-5xl">
    <div class="flex items-center gap-1 min-w-0">
      <a href="/" class="shrink-0 hover:opacity-80 transition-opacity text-sm font-bold tracking-tight">
        {siteConfig.siteName}
      </a>
      {#each crumbs as crumb, i (crumb.href)}
        <div class="inline-flex items-center gap-1">
          <span class="text-muted-foreground/40 shrink-0">/</span>
          {#if i < crumbs.length - 1}
            <a href={crumb.href} class="text-xs text-muted-foreground hover:text-foreground truncate transition-colors shrink min-w-0">{crumb.label}</a>
          {:else}
            <span class="text-xs text-foreground font-medium truncate shrink min-w-0">{crumb.label}</span>
          {/if}
        </div>
      {/each}
    </div>
    <div class="flex items-center gap-2 shrink-0">
      {#each siteConfig.navLinks as link}
        <a
          href={link.href}
          class="text-xs text-muted-foreground hover:text-foreground transition-colors"
          class:font-medium={$page.url.pathname === link.href}
        >
          {link.label}
        </a>
      {/each}
      <a
        href="https://space.bilibili.com/3494379408853453"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Bilibili"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-4">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.92.453.267.302.4.622.4.96 0 .338-.133.658-.4.96l-1.147 1.12v-.16z" />
        </svg>
      </a>
      <ThemeToggle />
    </div>
  </div>
</nav>
