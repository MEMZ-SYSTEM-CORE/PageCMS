<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import { staggerChildren } from '$lib/utils/motion';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  let searchQuery = $state('');
  let searchFilters = $state({ title: true, description: true, tags: true });

  let hasAnyFilter = $derived(searchFilters.title || searchFilters.description || searchFilters.tags);

  function formatDate(d: Date) {
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const filteredPosts = $derived.by(() => {
    if (!searchQuery.trim()) return posts.map(p => ({ post: p, matched: false }));
    const q = searchQuery.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return posts.map(p => {
      const fields: string[] = [];
      if (searchFilters.title) fields.push(p.title.toLowerCase());
      if (searchFilters.description) fields.push((p.description || '').toLowerCase());
      if (searchFilters.tags) fields.push((p.tags || []).join(' ').toLowerCase());
      const match = terms.every(t => fields.some(f => f.includes(t)));
      return { post: p, matched: match };
    }).filter(({ matched }) => matched);
  });
</script>

<svelte:head>
  <title>文章 — {siteConfig.siteName}</title>
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

    <div class="mt-3 flex flex-wrap gap-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <Checkbox bind:checked={searchFilters.title} />
        <span class="text-sm">标题</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <Checkbox bind:checked={searchFilters.description} />
        <span class="text-sm">简介</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <Checkbox bind:checked={searchFilters.tags} />
        <span class="text-sm">标签</span>
      </label>
    </div>

    {#if searchQuery}
      <div class="mt-2">
        {#if !hasAnyFilter}
          <p class="text-sm text-red-500">请至少选择一个搜索范围</p>
        {:else if filteredPosts.length === 0}
          <p class="text-sm text-muted-foreground">未找到匹配的文章</p>
        {:else}
          <p class="text-sm text-muted-foreground">找到 {filteredPosts.length} 篇文章</p>
        {/if}
      </div>
    {/if}
  </div>

  <div class="space-y-6" use:staggerChildren>
    {#each filteredPosts as { post } (post.slug)}
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
                  <span class="text-muted-foreground/30">·</span>
                  <span>{Math.max(1, Math.ceil((post.description?.length ?? 100) / 400))} 分钟</span>
                  {#if post.tags?.length}
                    {#each post.tags.filter(Boolean).slice(0, 3) as tag}
                      <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{tag}</Badge>
                    {/each}
                  {/if}
                </div>

                <h2 class="mb-2 text-xl font-semibold group-hover:text-foreground/70 transition-colors">{post.title}</h2>

                {#if post.description}
                  <p class="text-muted-foreground line-clamp-2">{post.description}</p>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {:else}
      <div class="py-12 text-center">
        <p class="text-muted-foreground">{searchQuery ? '未找到匹配的文章' : '暂无文章'}</p>
      </div>
    {/each}
  </div>
</div>
