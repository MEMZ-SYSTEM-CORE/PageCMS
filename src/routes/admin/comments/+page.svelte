<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';

  let pwd = $state('');
  let authenticated = $state(false);
  let comments = $state<Array<{ id: string; body: string; createdAt: string; author: { login: string; avatarUrl: string }; discussion: { title: string } }>>([]);
  let loading = $state(false);
  let error = $state('');

  const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';

  async function hashPass(p: string) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(p));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function login() {
    const h = await hashPass(pwd);
    if (h === PASSWORD_HASH) {
      authenticated = true;
      loadComments();
    } else {
      error = '密码错误';
    }
  }

  async function loadComments() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/giscus');
      const data = await res.json();
      if (data.errors) { error = data.errors[0].message; return; }

      const all: Array<{ id: string; body: string; createdAt: string; author: { login: string; avatarUrl: string }; discussion: { title: string } }> = [];
      for (const d of data.data.repository.discussions.nodes || []) {
        for (const c of d.comments.nodes || []) {
          all.push({ ...c, discussion: { title: d.title } });
        }
      }
      all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      comments = all;
    } catch (e) {
      error = String(e);
    } finally {
      loading = false;
    }
  }

  async function deleteComment(id: string) {
    if (!confirm('确定要删除这条评论吗？')) return;
    const res = await fetch('/api/giscus', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: id }),
    });
    const data = await res.json();
    if (data.error) { error = data.error; return; }
    comments = comments.filter(c => c.id !== id);
  }
</script>

<svelte:head>
  <title>评论管理 — {siteConfig.siteName}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
  <h1 class="text-3xl font-bold mb-2">评论管理</h1>
  <p class="text-muted-foreground mb-8">管理 Giscus 评论</p>

  {#if !authenticated}
    <Card.Root class="mx-auto max-w-sm">
      <Card.Content class="p-6">
        <h2 class="text-lg font-semibold mb-4">请输入管理密码</h2>
        <Input type="password" bind:value={pwd} placeholder="密码" onkeydown={(e) => e.key === 'Enter' && login()} />
        {#if error}
          <p class="text-sm text-destructive mt-2">{error}</p>
        {/if}
        <Button onclick={login} class="mt-4 w-full">验证</Button>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-muted-foreground">共 {comments.length} 条评论</p>
      <Button variant="outline" size="sm" onclick={loadComments}>刷新</Button>
    </div>

    {#if loading}
      <p class="text-center py-8 text-muted-foreground">加载中...</p>
    {:else if comments.length === 0}
      <p class="text-center py-8 text-muted-foreground">暂无评论</p>
    {:else}
      <div class="space-y-3">
        {#each comments as comment (comment.id)}
          <Card.Root>
            <Card.Content class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <span class="font-medium text-foreground">{comment.author.login}</span>
                    <span>·</span>
                    <span>{new Date(comment.createdAt).toLocaleString('zh-CN')}</span>
                    <Badge variant="secondary" class="text-[10px]">{comment.discussion.title}</Badge>
                  </div>
                  <p class="mt-1 text-sm line-clamp-3">{comment.body}</p>
                </div>
                <Button variant="destructive" size="sm" onclick={() => deleteComment(comment.id)}>删除</Button>
              </div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    {/if}
  {/if}
</div>
