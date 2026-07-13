<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { onMount } from 'svelte';
  import { apiFetch, getUser, setToken, setUser } from '$lib/forum/api';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function login() {
    if (!username || !password) { error = '请填写用户名和密码'; return; }
    loading = true; error = '';
    try {
      const data: any = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setToken(data.token);
      setUser(data.user);
      window.location.href = '/forum';
    } catch (e: any) {
      error = e.message;
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>登录 — {siteConfig.siteName} 论坛</title>
</svelte:head>

<div class="container mx-auto max-w-sm px-4 py-16">
  <Card.Root>
    <Card.Content class="p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">登录论坛</h1>
      {#if error}
        <p class="text-sm text-destructive mb-4">{error}</p>
      {/if}
      <div class="space-y-4">
        <Input bind:value={username} placeholder="用户名" />
        <Input type="password" bind:value={password} placeholder="密码" onkeydown={(e) => e.key === 'Enter' && login()} />
        <Button onclick={login} disabled={loading} class="w-full">{loading ? '登录中...' : '登录'}</Button>
        <p class="text-center text-sm text-muted-foreground">
          还没有账号？<a href="/forum/auth/register" class="text-primary hover:underline">注册</a>
        </p>
      </div>
    </Card.Content>
  </Card.Root>
</div>
export const prerender = false;
