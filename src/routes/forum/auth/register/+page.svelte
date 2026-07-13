<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { apiFetch, setToken, setUser } from '$lib/forum/api';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function register() {
    if (!username || !password) { error = '请填写用户名和密码'; return; }
    if (password.length < 4) { error = '密码至少4个字符'; return; }
    loading = true; error = '';
    try {
      const data: any = await apiFetch('/api/auth/register', {
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
  <title>注册 — {siteConfig.siteName} 论坛</title>
</svelte:head>

<div class="container mx-auto max-w-sm px-4 py-16">
  <Card.Root>
    <Card.Content class="p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">注册论坛</h1>
      {#if error}
        <p class="text-sm text-destructive mb-4">{error}</p>
      {/if}
      <div class="space-y-4">
        <Input bind:value={username} placeholder="用户名" />
        <Input type="password" bind:value={password} placeholder="密码（至少4位）" onkeydown={(e) => e.key === 'Enter' && register()} />
        <Button onclick={register} disabled={loading} class="w-full">{loading ? '注册中...' : '注册'}</Button>
        <p class="text-center text-sm text-muted-foreground">
          已有账号？<a href="/forum/auth/login" class="text-primary hover:underline">登录</a>
        </p>
      </div>
    </Card.Content>
  </Card.Root>
</div>
export const prerender = false;
