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
        <Card.Content class="relative z-10 space-y-4">
          {#each posts.slice(0, 5) as post (post.slug)}
            <a href={'/posts/' + post.slug + '/'} class="block no-underline group">
              <Card.Root class="transition-all hover:shadow-md">
                <Card.Content class="p-3 sm:p-4">
                  <div class="flex flex-col gap-3 sm:flex-row">
                    {#if post.image}
                      <div class="sm:w-32 sm:flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          class="h-32 w-full rounded-md object-cover sm:h-20"
                        />
                      </div>
                    {/if}
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-muted-foreground">
                        <time datetime={post.pubDate.toISOString()}>
                          {post.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span class="text-muted-foreground/30">·</span>
                        <span>{Math.max(1, Math.ceil((post.description?.length ?? 100) / 400))} 分钟</span>
                        {#if post.tags?.length}
                          {#each post.tags.filter(Boolean).slice(0, 2) as tag}
                            <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{tag}</Badge>
                          {/each}
                        {/if}
                      </div>
                      <h3 class="mt-1 text-base sm:text-lg font-semibold group-hover:text-foreground/70 transition-colors truncate">{post.title}</h3>
                      {#if post.description}
                        <p class="mt-0.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                      {/if}
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
            </a>
          {/each}
          {#if posts.length > 5}
            <div class="text-center pt-1">
              <a href="/posts" class="text-xs text-muted-foreground hover:text-foreground transition-colors">查看全部 →</a>
            </div>
          {/if}
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
