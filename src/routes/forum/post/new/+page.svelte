<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { onMount } from 'svelte';
  import { apiFetch, getUser } from '$lib/forum/api';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Select from '$lib/components/ui/select/index.js';

  let title = $state('');
  let content = $state('');
  let category = $state('general');
  let error = $state('');
  let loading = $state(false);
  let user = $state(getUser());

  onMount(() => {
    if (!user) window.location.href = '/forum/auth/login';
  });

  async function submit() {
    if (!title || !content) { error = '标题和内容不能为空'; return; }
    loading = true; error = '';
    try {
      const data: any = await apiFetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content, category }),
      });
      window.location.href = '/forum/post/' + data.id;
    } catch (e: any) {
      error = e.message;
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>发帖 — {siteConfig.siteName} 论坛</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
  <h1 class="text-2xl font-bold mb-6">发布新帖</h1>

  {#if error}
    <p class="text-sm text-destructive mb-4">{error}</p>
  {/if}

  <div class="space-y-4">
    <div class="space-y-2">
      <Label for="title">标题</Label>
      <Input id="title" bind:value={title} placeholder="帖子标题" />
    </div>

    <div class="space-y-2">
      <Label for="category">分类</Label>
      <Select.Root type="single" bind:value={category}>
        <Select.Trigger class="w-full"><Select.Value placeholder="选择分类" /></Select.Trigger>
        <Select.Content>
          <Select.Item value="general">综合讨论</Select.Item>
          <Select.Item value="tech">技术交流</Select.Item>
          <Select.Item value="shares">资源分享</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <div class="space-y-2">
      <Label for="content">内容</Label>
      <textarea
        id="content"
        bind:value={content}
        placeholder="写点什么..."
        class="w-full min-h-[200px] rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      ></textarea>
    </div>

    <div class="flex gap-2">
      <Button onclick={submit} disabled={loading}>{loading ? '发布中...' : '发布帖子'}</Button>
      <a href="/forum"><Button variant="outline">取消</Button></a>
    </div>
  </div>
</div>
export const prerender = false;
