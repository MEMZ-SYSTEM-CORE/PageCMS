<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { staggerChildren } from '$lib/utils/motion';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<div class="mx-auto max-w-2xl" use:staggerChildren>
  <!-- Bio -->
  <Card.Root class="mb-8 border-0 bg-gradient-to-br from-card to-muted/30 shadow-sm">
    <Card.Content class="p-6">
      <Card.Title class="text-2xl tracking-tight">{siteConfig.siteName}</Card.Title>
      <Card.Description class="mt-2 text-base">{siteConfig.description}</Card.Description>
      <div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{posts.length} posts</span>
        <span>{allTags.length} tags</span>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Posts -->
  <section class="mb-10">
    <div class="mb-5 flex items-center gap-3">
      <h2 class="text-sm font-medium text-muted-foreground">Latest Posts</h2>
      <div class="h-px flex-1 bg-border/60"></div>
    </div>

    {#if posts.length > 0}
      <div class="space-y-3">
        {#each posts as post (post.slug)}
          <a href={'/posts/' + post.slug + '/'} class="block no-underline">
            <Card.Root class="group transition-all hover:shadow-md">
              <Card.Content class="p-4">
                <div class="flex items-start gap-4">
                  {#if post.image}
                    <img src={post.image} alt={post.title} class="mt-0.5 h-16 w-24 shrink-0 rounded-md object-cover" loading="lazy" />
                  {/if}
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <time datetime={post.pubDate.toISOString()}>
                        {post.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                      {#if post.tags?.length}
                        {#each post.tags.filter(Boolean).slice(0, 2) as tag}
                          <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{tag}</Badge>
                        {/each}
                      {/if}
                    </div>
                    <h3 class="mt-1 text-base font-semibold tracking-tight group-hover:text-foreground/70 transition-colors">{post.title}</h3>
                    {#if post.description}
                      <p class="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{post.description}</p>
                    {/if}
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          </a>
        {/each}
      </div>
    {:else}
      <Card.Root>
        <Card.Content class="py-12 text-center">
          <Card.Description>No posts yet</Card.Description>
        </Card.Content>
      </Card.Root>
    {/if}
  </section>

  <!-- Tags -->
  {#if allTags.length > 0}
    <Separator class="mb-8" />
    <section>
      <h2 class="mb-4 text-sm font-medium text-muted-foreground">Tags</h2>
      <div class="flex flex-wrap gap-2">
        {#each allTags as tag}
          <Badge variant="secondary" class="px-2.5 py-1 text-xs font-normal transition-all hover:bg-accent hover:text-accent-foreground cursor-default">{tag}</Badge>
        {/each}
      </div>
    </section>
  {/if}
</div>
