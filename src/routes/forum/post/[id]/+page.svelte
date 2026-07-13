<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { onMount } from 'svelte';
  import { apiFetch, getUser } from '$lib/forum/api';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import type { ForumPost, ForumComment } from '$lib/forum/types';

  let { params } = $props();
  let post = $state<ForumPost | null>(null);
  let comments = $state<ForumComment[]>([]);
  let commentText = $state('');
  let loading = $state(true);
  let user = $state(getUser());

  onMount(async () => {
    try {
      const [p, c] = await Promise.all([
        apiFetch<ForumPost>('/api/posts/' + params.id),
        apiFetch<ForumComment[]>('/api/comments/' + params.id),
      ]);
      post = p; comments = c;
    } catch (e) { console.error(e); }
    loading = false;
  });

  async function addComment() {
    if (!commentText.trim()) return;
    try {
      const c: any = await apiFetch('/api/comments/' + params.id, {
        method: 'POST',
        body: JSON.stringify({ content: commentText }),
      });
      comments = [...comments, c];
      commentText = '';
    } catch (e: any) { alert(e.message); }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
</script>

<svelte:head>
  <title>{post?.title || '帖子'} — {siteConfig.siteName} 论坛</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
  <a href="/forum" class="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">← 返回论坛</a>

  {#if loading}
    <p class="text-center py-12 text-muted-foreground">加载中...</p>
  {:else if post}
    <article>
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{post.username || '匿名'}</span>
          <span>·</span>
          <span>{formatDate(post.created_at)}</span>
          {#if post.category}
            <Badge variant="secondary">{post.category}</Badge>
          {/if}
        </div>
        <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
        <div class="flex gap-4 text-xs text-muted-foreground">
          <span>{post.views} 阅读</span>
          <span>{post.comment_count} 评论</span>
        </div>
      </div>

      <div class="prose prose-neutral dark:prose-invert max-w-none mb-8">
        {post.content}
      </div>

      <Separator class="mb-8" />

      <section>
        <h2 class="text-lg font-semibold mb-4">评论 ({comments.length})</h2>

        {#if user}
          <div class="flex gap-2 mb-6">
            <textarea
              bind:value={commentText}
              placeholder="写下你的评论..."
              class="flex-1 min-h-[80px] rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            ></textarea>
            <Button onclick={addComment}>发布</Button>
          </div>
        {:else}
          <p class="text-sm text-muted-foreground mb-6">
            <a href="/forum/auth/login" class="text-primary hover:underline">登录</a> 后可以评论
          </p>
        {/if}

        {#if comments.length === 0}
          <p class="text-sm text-muted-foreground">暂无评论</p>
        {:else}
          <div class="space-y-4">
            {#each comments as comment (comment.id)}
              <Card.Root>
                <Card.Content class="p-4">
                  <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span class="font-medium text-foreground">{comment.username || '匿名'}</span>
                    <span>·</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <p class="text-sm whitespace-pre-wrap">{comment.content}</p>
                </Card.Content>
              </Card.Root>
            {/each}
          </div>
        {/if}
      </section>
    </article>
  {:else}
    <p class="text-center py-12 text-muted-foreground">帖子不存在</p>
  {/if}
</div>
export const prerender = false;
