<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { fadeInUp, fadeIn } from '$lib/utils/motion';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
  <!-- Avatar -->
  <div class="mo-fade-in-up" use:fadeInUp>
    <a href={siteConfig.bio.links[0]?.url || '/'} target="_blank" rel="noopener noreferrer">
      <img src={siteConfig.avatar} alt={siteConfig.bio.name} class="h-32 w-32 rounded-full cursor-pointer hover:opacity-90 transition-opacity" referrerpolicy="no-referrer" />
    </a>
  </div>

  <!-- Bio -->
  <div class="text-center mo-fade-in-up" use:fadeInUp={{ delay: 0.1 }}>
    <h1 class="text-4xl font-bold mb-2">{siteConfig.bio.name}</h1>
    <p class="text-lg text-muted-foreground mb-3">{siteConfig.bio.description || siteConfig.description}</p>
    <p class="text-sm text-muted-foreground">{posts.length} 篇文章 · {allTags.length} 个标签</p>
  </div>

  <!-- Latest Posts -->
  {#if posts.length > 0}
    <div class="w-full max-w-2xl mx-auto mo-fade-in-up" use:fadeInUp={{ delay: 0.2 }}>
      <Card.Root class="relative overflow-hidden">
        <Card.Header class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Card.Title class="text-center text-5xl font-black tracking-widest text-foreground/[0.04] dark:text-foreground/[0.06] select-none">最新</Card.Title>
        </Card.Header>
        <Card.Content class="relative z-10">
          <div class="space-y-3">
            {#each posts.slice(0, 5) as post, i (post.slug)}
              <a href={'/posts/' + post.slug + '/'} class="block no-underline group">
                <div class="flex items-center justify-between gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-accent/30">
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium truncate group-hover:text-foreground/70 transition-colors">{post.title}</div>
                    <div class="text-xs text-muted-foreground mt-0.5">
                      {post.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {#if post.tags?.length}
                        {#each post.tags.filter(Boolean).slice(0, 2) as tag}
                          <span class="ml-1.5">#{tag}</span>
                        {/each}
                      {/if}
                    </div>
                  </div>
                  {#if post.description}
                    <div class="hidden sm:block text-xs text-muted-foreground/60 truncate max-w-48 text-right">{post.description}</div>
                  {/if}
                </div>
              </a>
              {#if i < posts.slice(0, 5).length - 1}
                <div class="border-b border-border/40"></div>
              {/if}
            {/each}
            {#if posts.length > 5}
              <div class="text-center pt-1">
                <a href="/posts" class="text-xs text-muted-foreground hover:text-foreground transition-colors">查看全部 →</a>
              </div>
            {/if}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {/if}

  <!-- Tags -->
  {#if allTags.length > 0}
    <div class="w-full max-w-2xl mx-auto mo-fade-in-up" use:fadeInUp={{ delay: 0.25 }}>
      <Card.Root class="relative overflow-hidden">
        <Card.Header class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Card.Title class="text-center text-5xl font-black tracking-widest text-foreground/[0.04] dark:text-foreground/[0.06] select-none">标签</Card.Title>
        </Card.Header>
        <Card.Content class="relative z-10">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each allTags as tag}
              <Badge variant="secondary" class="px-3 py-1.5 text-xs font-normal">{tag}</Badge>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {/if}

  <!-- Navigation -->
  <div class="w-full max-w-2xl mx-auto mo-fade-in-up" use:fadeInUp={{ delay: 0.3 }}>
    <Card.Root class="relative overflow-hidden">
      <Card.Header class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Card.Title class="text-center text-5xl font-black tracking-widest text-foreground/[0.04] dark:text-foreground/[0.06] select-none">导航</Card.Title>
      </Card.Header>
      <Card.Content class="relative z-10">
        <div class="flex flex-wrap gap-3 justify-center">
          {#each siteConfig.navLinks as link}
            {@const isExternal = link.href.startsWith('http')}
            <a href={link.href} {...isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}}>
              <Button
                variant={link.highlight ? 'default' : 'outline'}
                class="flex items-center gap-2 {link.highlight ? 'ring-2 ring-primary/40 shadow-md shadow-primary/20' : ''}"
              >
                <Icon icon={link.icon} class="w-5 h-5" />
                {link.label}
                {#if link.badge}
                  <Badge variant="secondary" class="ml-0.5">{link.badge}</Badge>
                {/if}
                {#if isExternal}
                  <Icon icon="mdi:open-in-new" class="w-3.5 h-3.5 opacity-60" />
                {/if}
              </Button>
            </a>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Social Links -->
  <div class="w-full max-w-2xl mx-auto mo-fade-in-up" use:fadeInUp={{ delay: 0.35 }}>
    <Card.Root class="relative overflow-hidden">
      <Card.Header class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Card.Title class="text-center text-5xl font-black tracking-widest text-foreground/[0.04] dark:text-foreground/[0.06] select-none">社交</Card.Title>
      </Card.Header>
      <Card.Content class="relative z-10">
        <div class="flex flex-wrap gap-3 justify-center">
          {#each siteConfig.bio.links as link}
            {@const isLocalImage = link.icon.startsWith('/')}
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" class="flex items-center gap-2">
                {#if isLocalImage}
                  <img src={link.icon} alt={link.name} class="w-5 h-5" />
                {:else}
                  <Icon icon={link.icon} class="w-5 h-5" style={link.color ? `color: ${link.color}` : ''} />
                {/if}
                <span class="text-sm font-medium">{link.name}</span>
              </Button>
            </a>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
