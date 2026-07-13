<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { staggerChildren } from '$lib/utils/motion';
  import * as Card from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Separator } from '$lib/components/ui/separator';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<!-- Author Bio Card -->
<div class="mb-10" use:staggerChildren>
  <Card.Root class="overflow-hidden border-0 bg-gradient-to-br from-card to-muted/30 shadow-sm">
    <Card.Content class="flex items-center gap-5 p-6">
      <Avatar class="size-16 shrink-0 ring-2 ring-foreground/10">
        <AvatarFallback class="bg-accent/10 text-lg font-bold">{siteConfig.siteName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div class="min-w-0 flex-1">
        <Card.Title class="text-xl">{siteConfig.siteName}</Card.Title>
        <Card.Description class="mt-1">{siteConfig.description}</Card.Description>
        <div class="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{posts.length} 篇文章</span>
          <span>·</span>
          <span>{allTags.length} 个标签</span>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>

<!-- Stats Row -->
<div class="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4" use:staggerChildren>
  <Card.Root class="text-center">
    <Card.Content class="p-4">
      <div class="text-2xl font-bold">{posts.length}</div>
      <div class="text-xs text-muted-foreground mt-1">文章</div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="text-center">
    <Card.Content class="p-4">
      <div class="text-2xl font-bold">{allTags.length}</div>
      <div class="text-xs text-muted-foreground mt-1">标签</div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="text-center">
    <Card.Content class="p-4">
      <div class="text-2xl font-bold">{new Date().getFullYear() - 2026}</div>
      <div class="text-xs text-muted-foreground mt-1">建站年</div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="text-center">
    <Card.Content class="p-4">
      <a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-2xl font-bold hover:opacity-70 transition-opacity">
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.92.453.267.302.4.622.4.96 0 .338-.133.658-.4.96l-1.147 1.12v-.16z"/></svg>
      </a>
      <div class="text-xs text-muted-foreground mt-1">B站</div>
    </Card.Content>
  </Card.Root>
</div>

<!-- Quick Actions -->
<div class="mb-10 flex flex-wrap gap-2" use:staggerChildren>
  <a href="#posts">
    <Button variant="default" size="sm">📖 浏览文章</Button>
  </a>
  <a href="#tags">
    <Button variant="secondary" size="sm">🏷️ 浏览标签</Button>
  </a>
  <a href="/about">
    <Button variant="ghost" size="sm">ℹ️ 关于本站</Button>
  </a>
</div>

<Separator class="mb-10" />

<!-- Posts Section -->
<section id="posts" class="mb-10" use:staggerChildren>
  <div class="mb-5 flex items-center gap-3">
    <Card.Title class="text-lg">📝 最新文章</Card.Title>
    <div class="h-px flex-1 bg-border/60"></div>
    <span class="text-xs text-muted-foreground/60">{posts.length} 篇</span>
  </div>

  {#if posts.length > 0}
    <div class="space-y-3">
      {#each posts as post (post.slug)}
        <Card.Root class="group overflow-hidden transition-all hover:shadow-md">
          <div class="flex items-start gap-4 p-4">
            {#if post.image}
              <a href={'/posts/' + post.slug + '/'} class="shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  class="h-20 w-32 rounded-lg object-cover"
                  loading="lazy"
                />
              </a>
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
                  {#if post.tags.length > 2}
                    <span class="text-[10px] text-muted-foreground/60">+{post.tags.length - 2}</span>
                  {/if}
                {/if}
              </div>
              <a href={'/posts/' + post.slug + '/'} class="mt-1 block">
                <Card.Title class="text-base group-hover:text-foreground/70 transition-colors">{post.title}</Card.Title>
              </a>
              {#if post.description}
                <Card.Description class="mt-1 line-clamp-2 text-sm">{post.description}</Card.Description>
              {/if}
              <div class="mt-2">
                <a href={'/posts/' + post.slug + '/'}>
                  <Button variant="link" size="sm" class="h-auto p-0 text-xs">阅读全文 →</Button>
                </a>
              </div>
            </div>
          </div>
        </Card.Root>
      {/each}
    </div>
  {:else}
    <Card.Root class="py-12 text-center">
      <Card.Content>
        <div class="text-4xl mb-3 opacity-40">📝</div>
        <Card.Description>还没有文章</Card.Description>
      </Card.Content>
    </Card.Root>
  {/if}
</section>

<Separator class="mb-10" />

<!-- Tags Section -->
<section id="tags" class="mb-10" use:staggerChildren>
  <div class="mb-5 flex items-center gap-3">
    <Card.Title class="text-lg">🏷️ 标签</Card.Title>
    <div class="h-px flex-1 bg-border/60"></div>
    <span class="text-xs text-muted-foreground/60">{allTags.length} 个</span>
  </div>

  {#if allTags.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each allTags as tag}
        <Badge variant="secondary" class="px-3 py-1.5 text-xs font-normal transition-all hover:bg-accent hover:text-accent-foreground cursor-default">{tag}</Badge>
      {/each}
    </div>
  {:else}
    <Card.Root class="py-8 text-center">
      <Card.Content>
        <Card.Description>暂无标签</Card.Description>
      </Card.Content>
    </Card.Root>
  {/if}
</section>
