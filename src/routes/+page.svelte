<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { staggerChildren } from '$lib/utils/motion';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import * as Carousel from '$lib/components/ui/carousel/index.js';
  import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
  import * as AspectRatio from '$lib/components/ui/aspect-ratio/index.js';
  import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover/index.js';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);

  let tagOpen = $state(true);
  let featuredIndex = $state(0);

  const featured = $derived(posts.slice(0, 4));
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<div class="mx-auto max-w-2xl" use:staggerChildren>
  <!-- Hero -->
  <Card.Root class="mb-8 border-0 bg-gradient-to-br from-card to-muted/30 shadow-sm">
    <Card.Content class="p-6">
      <Card.Title class="text-2xl tracking-tight">{siteConfig.siteName}</Card.Title>
      <Card.Description class="mt-2 text-base">{siteConfig.description}</Card.Description>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <a href="/about"><Button variant="default" size="sm">About</Button></a>
        <Button variant="secondary" size="sm" onclick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })}>Posts</Button>
        <Button variant="outline" size="sm" onclick={() => document.getElementById('tags')?.scrollIntoView({ behavior: 'smooth' })}>Tags</Button>
      </div>
      <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{posts.length} posts</span>
        <span>{allTags.length} tags</span>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Featured Carousel -->
  {#if featured.length > 0}
    <section class="mb-10" use:staggerChildren>
      <div class="mb-4 flex items-center gap-3">
        <h2 class="text-sm font-medium text-muted-foreground">Featured</h2>
        <div class="h-px flex-1 bg-border/60"></div>
      </div>
      <Carousel.Root bind:index={featuredIndex} opts={{ align: 'start', loop: true }}>
        <Carousel.Content class="-ml-4">
          {#each featured as post (post.slug)}
            <Carousel.Item class="basis-full pl-4 sm:basis-1/2">
              <a href={'/posts/' + post.slug + '/'} class="block no-underline">
                <Card.Root class="group overflow-hidden transition-all hover:shadow-md">
                  <AspectRatio.Root ratio={16 / 9} class="overflow-hidden bg-muted">
                    {#if post.image}
                      <img src={post.image} alt={post.title} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    {:else}
                      <div class="flex h-full items-center justify-center text-3xl text-muted-foreground/30">{post.title.charAt(0)}</div>
                    {/if}
                  </AspectRatio.Root>
                  <Card.Content class="p-4">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <time datetime={post.pubDate.toISOString()}>
                        {post.pubDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </time>
                      {#if post.tags?.[0]}
                        <Badge variant="secondary" class="text-[10px] px-1 py-0">{post.tags[0]}</Badge>
                      {/if}
                    </div>
                    <Card.Title class="mt-1 text-sm group-hover:text-foreground/70 transition-colors">{post.title}</Card.Title>
                  </Card.Content>
                </Card.Root>
              </a>
            </Carousel.Item>
          {/each}
        </Carousel.Content>
        <div class="mt-3 flex items-center justify-center gap-2">
          <Carousel.Previous variant="outline" size="sm" />
          <Carousel.Next variant="outline" size="sm" />
        </div>
      </Carousel.Root>
    </section>
  {/if}

  <Separator class="mb-8" />

  <!-- Posts -->
  <section id="posts" class="mb-10" use:staggerChildren>
    <div class="mb-4 flex items-center gap-3">
      <h2 class="text-sm font-medium text-muted-foreground">Posts</h2>
      <div class="h-px flex-1 bg-border/60"></div>
    </div>

    {#if posts.length > 0}
      <ScrollArea.Root class="h-[480px] rounded-lg border">
          <div class="space-y-2 p-3">
            {#each posts as post (post.slug)}
              <a href={'/posts/' + post.slug + '/'} class="block no-underline">
                <Card.Root class="group transition-all hover:shadow-sm">
                  <Card.Content class="flex items-start gap-3 p-3">
                    {#if post.image}
                      <img src={post.image} alt={post.title} class="mt-0.5 h-12 w-20 shrink-0 rounded object-cover" loading="lazy" />
                    {/if}
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 text-xs text-muted-foreground">
                        <time datetime={post.pubDate.toISOString()}>
                          {post.pubDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                      <h3 class="mt-0.5 text-sm font-medium truncate group-hover:text-foreground/70 transition-colors">{post.title}</h3>
                      {#if post.description}
                        <p class="truncate text-xs text-muted-foreground">{post.description}</p>
                      {/if}
                    </div>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="ghost" size="icon-sm" aria-label="Preview">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-72 p-0" side="top" align="end">
                        <Card.Root class="border-0 shadow-none">
                          {#if post.image}
                            <img src={post.image} alt={post.title} class="h-32 w-full rounded-t-lg object-cover" />
                          {/if}
                          <Card.Content class="p-3">
                            <Card.Title class="text-sm">{post.title}</Card.Title>
                            <Card.Description class="mt-1 line-clamp-3 text-xs">{post.description || 'No description'}</Card.Description>
                          </Card.Content>
                        </Card.Root>
                      </PopoverContent>
                    </Popover>
                  </Card.Content>
                </Card.Root>
              </a>
            {/each}
          </div>
        </ScrollArea.Root>
    {:else}
      <Card.Root>
        <Card.Content class="py-12 text-center">
          <Card.Description>No posts yet</Card.Description>
        </Card.Content>
      </Card.Root>
    {/if}
  </section>

  <Separator class="mb-8" />

  <!-- Tags (Collapsible) -->
  {#if allTags.length > 0}
    <section id="tags" class="mb-10" use:staggerChildren>
      <Collapsible.Root bind:open={tagOpen}>
        <div class="mb-4 flex items-center gap-3">
          <Collapsible.Trigger>
            <button class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 transition-transform" class:rotate-90={tagOpen}><path d="m9 18 6-6-6-6"/></svg>
              Tags ({allTags.length})
            </button>
          </Collapsible.Trigger>
          <div class="h-px flex-1 bg-border/60"></div>
        </div>
        <Collapsible.Content>
          <div class="flex flex-wrap gap-2">
            {#each allTags as tag}
              <Badge variant="secondary" class="px-2.5 py-1 text-xs font-normal transition-all hover:bg-accent hover:text-accent-foreground cursor-default">{tag}</Badge>
            {/each}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </section>
  {/if}
</div>
