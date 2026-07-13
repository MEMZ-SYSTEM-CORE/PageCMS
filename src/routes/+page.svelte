<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { staggerChildren } from '$lib/utils/motion';

  let { data }: { data: { posts: Array<{ slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[] }> } } = $props();

  const posts = $derived(data.posts);
  const allTags = $derived([...new Set(posts.flatMap((p) => p.tags || []).filter(Boolean))]);
</script>

<svelte:head>
  <title>{siteConfig.siteName} — {siteConfig.description}</title>
</svelte:head>

<!-- Hero -->
<section class="mb-12" use:staggerChildren>
  <div class="space-y-4">
    <h1 class="text-4xl font-bold tracking-tight">{siteConfig.siteName}</h1>
    <p class="text-lg text-muted-foreground">{siteConfig.description}</p>
    <p class="text-sm text-muted-foreground">{posts.length} 篇文章 · {allTags.length} 个标签</p>
  </div>
</section>

<!-- Posts -->
{#if posts.length > 0}
  <section class="space-y-6" use:staggerChildren>
    <div class="flex items-center gap-3">
      <h2 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">文章</h2>
      <div class="h-px flex-1 bg-border/60"></div>
      <span class="text-xs text-muted-foreground/60">{posts.length} 篇</span>
    </div>

    <div class="space-y-4">
      {#each posts as post (post.slug)}
        <article class="group rounded-2xl border p-5 transition-all hover:shadow-sm">
          <div class="flex items-start gap-4">
            {#if post.image}
              <a href={'/posts/' + post.slug + '/'} class="shrink-0">
                <img src={post.image} alt={post.title} class="h-24 w-36 rounded-xl object-cover" loading="lazy" />
              </a>
            {/if}
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <time datetime={post.pubDate.toISOString()}>
                  {post.pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                {#if post.tags?.length}
                  {#each post.tags.filter(Boolean).slice(0, 3) as tag}
                    <span class="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{tag}</span>
                  {/each}
                  {#if post.tags.length > 3}
                    <span class="text-[10px] text-muted-foreground/60">+{post.tags.length - 3}</span>
                  {/if}
                {/if}
              </div>
              <a href={'/posts/' + post.slug + '/'} class="mt-1 block">
                <h3 class="text-lg font-semibold group-hover:text-foreground/70 transition-colors">{post.title}</h3>
              </a>
              {#if post.description}
                <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>
{/if}

<!-- Tags -->
{#if allTags.length > 0}
  <section class="mt-12 space-y-4 border-t pt-6">
    <div class="flex items-center gap-3">
      <h2 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">标签</h2>
      <div class="h-px flex-1 bg-border/60"></div>
      <span class="text-xs text-muted-foreground/60">{allTags.length} 个</span>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each allTags as tag}
        <span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>
      {/each}
    </div>
  </section>
{/if}
