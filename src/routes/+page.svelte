<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { fadeInUp, fadeIn, staggerChildren } from '$lib/utils/motion';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import * as Carousel from '$lib/components/ui/carousel/index.js';
  import * as AspectRatio from '$lib/components/ui/aspect-ratio/index.js';
  import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover/index.js';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);

  let featuredIndex = $state(0);
  let tagOpen = $state(true);

  const featured = $derived(posts.slice(0, 4));
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
  <!-- Hero -->
  <div class="mb-12" use:fadeInUp>
    <Card.Root class="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-sm">
      <Card.Content class="flex flex-col items-center p-8 text-center sm:p-10">
        <Avatar class="mb-4 size-16 ring-2 ring-foreground/10">
          <AvatarImage src="https://i1.hdslb.com/bfs/face/b2f8487effcf7a87f4f885d89fc35ab5c946f6a7.jpg" alt={siteConfig.siteName} />
          <AvatarFallback class="bg-accent/10 text-xl font-bold">{siteConfig.siteName.charAt(0)}</AvatarFallback>
        </Avatar>
        <Card.Title class="text-2xl font-bold tracking-tight sm:text-3xl">{siteConfig.siteName}</Card.Title>
        <Card.Description class="mt-2 max-w-md text-base text-muted-foreground">{siteConfig.description}</Card.Description>
        <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span class="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M22 10v5M2 10v5"/><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><rect x="2" y="10" width="20" height="10" rx="1.5"/></svg>
            {posts.length} 篇文章
          </span>
          <span>{allTags.length} 个标签</span>
        </div>
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <a href="/about"><Button variant="default" size="sm">关于本站</Button></a>
          <Button variant="secondary" size="sm" onclick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })}>浏览文章</Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Featured Carousel -->
  {#if featured.length > 0}
    <section class="mb-12" use:fadeInUp>
      <div class="mb-5">
        <h2 class="text-base font-semibold tracking-tight">精选文章</h2>
        <p class="text-sm text-muted-foreground mt-0.5">最近更新的几篇文章</p>
      </div>
      <Carousel.Root bind:index={featuredIndex} opts={{ align: 'start', loop: true }}>
        <Carousel.Content class="-ml-3">
          {#each featured as post (post.slug)}
            <Carousel.Item class="basis-full pl-3 sm:basis-1/2">
              <a href={'/posts/' + post.slug + '/'} class="block no-underline">
                <Card.Root class="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <AspectRatio.Root ratio={16 / 10} class="overflow-hidden bg-muted">
                    {#if post.image}
                      <img src={post.image} alt={post.title} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
                    {:else}
                      <div class="flex h-full items-center justify-center bg-gradient-to-br from-accent/5 to-muted text-4xl text-muted-foreground/20">{post.title.charAt(0)}</div>
                    {/if}
                  </AspectRatio.Root>
                  <Card.Content class="p-4">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <time datetime={post.pubDate.toISOString()}>
                        {post.pubDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </time>
                      <span class="text-muted-foreground/30">|</span>
                      <span>{Math.max(1, Math.ceil((post.description?.length ?? 100) / 400))} 分钟</span>
                    </div>
                    <Card.Title class="mt-1.5 text-sm font-semibold leading-snug group-hover:text-foreground/70 transition-colors">{post.title}</Card.Title>
                    {#if post.tags?.[0]}
                      <div class="mt-2 flex gap-1">
                        <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{post.tags[0]}</Badge>
                      </div>
                    {/if}
                  </Card.Content>
                </Card.Root>
              </a>
            </Carousel.Item>
          {/each}
        </Carousel.Content>
        <div class="mt-4 flex items-center justify-center gap-2">
          <Carousel.Previous variant="outline" size="sm" />
          <Carousel.Next variant="outline" size="sm" />
        </div>
      </Carousel.Root>
    </section>
  {/if}

  <!-- Posts -->
  <section id="posts" class="mb-12" use:fadeInUp>
    <div class="mb-5">
      <h2 class="text-base font-semibold tracking-tight">全部文章</h2>
      <p class="text-sm text-muted-foreground mt-0.5">共 {posts.length} 篇</p>
    </div>

    {#if posts.length > 0}
      <div class="space-y-3">
        {#each posts as post (post.slug)}
          <a href={'/posts/' + post.slug + '/'} class="block no-underline">
            <Card.Root class="group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div class="flex items-start gap-4 p-4 sm:p-5">
                {#if post.image}
                  <div class="shrink-0 overflow-hidden rounded-lg">
                    <img src={post.image} alt={post.title} class="h-20 w-28 object-cover transition-all duration-300 group-hover:scale-105 sm:h-24 sm:w-36" loading="lazy" />
                  </div>
                {:else}
                  <div class="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-muted sm:h-24 sm:w-36">
                    <span class="text-2xl text-muted-foreground/20">{post.title.charAt(0)}</span>
                  </div>
                {/if}
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <time datetime={post.pubDate.toISOString()} class="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M16 3v4M8 3v4"/></svg>
                      {post.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    {#if post.tags?.length}
                      {#each post.tags.filter(Boolean).slice(0, 2) as tag}
                        <Badge variant="secondary" class="text-[10px] px-1.5 py-0 font-normal">{tag}</Badge>
                      {/each}
                      {#if post.tags.filter(Boolean).length > 2}
                        <span class="text-muted-foreground/50">+{post.tags.filter(Boolean).length - 2}</span>
                      {/if}
                    {/if}
                  </div>
                  <h3 class="mt-1.5 text-base font-semibold leading-snug group-hover:text-foreground/70 transition-colors sm:text-lg">{post.title}</h3>
                  {#if post.description}
                    <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                  {/if}
                  <div class="mt-2 flex items-center gap-1 text-xs font-medium text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
                    阅读全文
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3 transition-transform group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
            </Card.Root>
          </a>
        {/each}
      </div>
    {:else}
      <Card.Root class="py-16">
        <Card.Content class="text-center">
          <div class="mb-3 text-4xl text-muted-foreground/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto size-12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <Card.Description>暂无文章</Card.Description>
        </Card.Content>
      </Card.Root>
    {/if}
  </section>

  <!-- Tags -->
  {#if allTags.length > 0}
    <section class="mb-8" use:fadeInUp>
      <Collapsible.Root bind:open={tagOpen}>
        <div class="mb-4">
          <Collapsible.Trigger>
            <button class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 transition-transform duration-200" class:rotate-90={tagOpen}><path d="m9 18 6-6-6-6"/></svg>
              标签 ({allTags.length})
            </button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content>
          <Card.Root class="border-dashed">
            <Card.Content class="p-4">
              <div class="flex flex-wrap gap-2">
                {#each allTags as tag}
                  <Badge variant="secondary" class="px-3 py-1.5 text-xs font-normal transition-all hover:bg-accent hover:text-accent-foreground cursor-default">{tag}</Badge>
                {/each}
              </div>
            </Card.Content>
          </Card.Root>
        </Collapsible.Content>
      </Collapsible.Root>
    </section>
  {/if}
</div>
