<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { onMount } from 'svelte';
  import { apiFetch, getUser, logout, setToken, setUser } from '$lib/forum/api';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { ForumPost } from '$lib/forum/types';

  let posts = $state<ForumPost[]>([]);
  let total = $state(0);
  let page = $state(1);
  let loading = $state(true);
  let user = $state(getUser());

  onMount(() => { loadPosts(); });

  async function loadPosts() {
    loading = true;
    try {
      const data: any = await apiFetch(`/api/posts?page=${page}&limit=20`);
      posts = data.posts;
      total = data.total;
    } catch (e) { console.error(e); }
    loading = false;
  }

  function doLogout() { logout(); user = null; }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
</script>

<svelte:head>
  <title>论坛 — {siteConfig.siteName}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold">论坛</h1>
      <p class="text-muted-foreground mt-1">社区讨论</p>
    </div>
    <div class="flex items-center gap-3">
      {#if user}
        <span class="text-sm text-muted-foreground">{user.username}</span>
        <a href="/forum/post/new"><Button size="sm">发帖</Button></a>
        <Button variant="ghost" size="sm" onclick={doLogout}>退出</Button>
      {:else}
        <a href="/forum/auth/login"><Button variant="outline" size="sm">登录</Button></a>
        <a href="/forum/auth/register"><Button size="sm">注册</Button></a>
      {/if}
    </div>
  </div>

  {#if loading}
    <p class="text-center py-12 text-muted-foreground">加载中...</p>
  {:else if posts.length === 0}
    <p class="text-center py-12 text-muted-foreground">暂无帖子</p>
  {:else}
    <div class="space-y-3">
      {#each posts as post (post.id)}
        <a href={'/forum/post/' + post.id} class="block no-underline">
          <Card.Root class="transition-all hover:shadow-sm">
            <Card.Content class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>{post.username || '匿名'}</span>
                    <span>·</span>
                    <span>{formatDate(post.created_at)}</span>
                    {#if post.category}
                      <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{post.category}</Badge>
                    {/if}
                    {#if post.pinned}
                      <Badge class="text-[10px] px-1.5 py-0">置顶</Badge>
                    {/if}
                  </div>
                  <h2 class="text-base font-semibold">{post.title}</h2>
                  <div class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{post.views} 阅读</span>
                    <span>{post.comment_count} 评论</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </a>
      {/each}
    </div>

    {#if total > 20}
      <div class="flex justify-center gap-2 mt-8">
        <Button variant="outline" size="sm" disabled={page <= 1} onclick={() => { page--; loadPosts(); }}>上一页</Button>
        <span class="flex items-center text-sm text-muted-foreground px-3">{page} / {Math.ceil(total / 20)}</span>
        <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onclick={() => { page++; loadPosts(); }}>下一页</Button>
      </div>
    {/if}
  {/if}
</div>
