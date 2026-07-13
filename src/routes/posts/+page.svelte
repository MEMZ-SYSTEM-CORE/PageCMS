<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { staggerChildren } from '$lib/utils/motion';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  let searchQuery = $state('');

  const filteredPosts = $derived.by(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  function formatDate(d: Date) {
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<svelte:head>
  <title>文章列表 — {siteConfig.siteName}</title>
  <meta name="description" content="浏览所有文章" />
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
  <div class="mb-12 text-center">
    <h1 class="mb-4 text-4xl font-bold">文章</h1>
    <p class="text-muted-foreground">{siteConfig.description}</p>
    <p class="mt-2 text-sm text-muted-foreground">共 {posts.length} 篇文章</p>
  </div>

  <div class="mb-8">
    <Input
      type="text"
      bind:value={searchQuery}
      placeholder="搜索文章标题、描述或标签..."
      class="w-full"
    />
    {#if searchQuery}
      <p class="mt-2 text-sm text-muted-foreground">
        找到 {filteredPosts.length} 篇文章
      </p>
    {/if}
  </div>

  <div class="space-y-6" use:staggerChildren>
    {#each filteredPosts as post (post.slug)}
      <a href={'/posts/' + post.slug + '/'} class="block no-underline">
        <Card.Root class="group transition-all hover:shadow-lg">
          <Card.Content>
            <div class="flex flex-col gap-4 md:flex-row">
              {#if post.image}
                <div class="md:w-48 md:flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    class="h-48 w-full rounded-md object-cover md:h-32"
                  />
                </div>
              {/if}

              <div class="flex-1">
                <div class="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                  <time datetime={post.pubDate.toISOString()}>{formatDate(post.pubDate)}</time>
                  {#if post.tags?.length}
                    {#each post.tags.filter(Boolean) as tag}
                      <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{tag}</Badge>
                    {/each}
                  {/if}
                </div>

                <h2 class="mb-2 text-xl font-semibold group-hover:text-foreground/70 transition-colors">{post.title}</h2>

                {#if post.description}
                  <p class="text-muted-foreground">{post.description}</p>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {:else}
      <div class="py-12 text-center">
        <p class="text-muted-foreground">
          {searchQuery ? '未找到匹配的文章' : '暂无文章'}
        </p>
      </div>
    {/each}
  </div>
</div>
