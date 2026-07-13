<script lang="ts">
  import { page } from '$app/stores';
  import { siteConfig } from '$lib/config/site';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
  <title>{$page.status} — {siteConfig.siteName}</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
  <div class="text-8xl font-black text-muted-foreground/20">{$page.status}</div>
  <Card.Root class="max-w-md">
    <Card.Content class="p-6">
      <Card.Title class="mb-2">
        {#if $page.status === 404}
          页面不存在
        {:else}
          出错了
        {/if}
      </Card.Title>
      <Card.Description>
        {#if $page.status === 404}
          你访问的页面不存在，可能已被移除或链接错误。
        {:else}
          服务器遇到了问题，请稍后重试。
        {/if}
      </Card.Description>
      <div class="mt-4">
        <a href="/"><Button variant="default">返回首页</Button></a>
      </div>
    </Card.Content>
  </Card.Root>
</div>
