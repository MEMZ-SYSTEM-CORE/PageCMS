<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import Icon from '@iconify/svelte';

  interface ConsentPreferences {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
  }

  let showBanner = $state(false);
  let showSettings = $state(false);

  let preferences = $state<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false
  });

  let agreed = $state(false);
  let overlayContent = $state<string | null>(null);
  let readAgreement = $state(false);
  let readPrivacy = $state(false);
  let canAgree = $derived(readAgreement && readPrivacy);

  const STORAGE_KEY = 'cookie-consent-preferences';
  const CONSENT_VERSION = '2.0';

  onMount(() => {
    loadPreferences();

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === 'open_preferences_center' || target.closest('#open_preferences_center')) {
        e.preventDefault();
        showSettings = true;
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  function loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === CONSENT_VERSION && data.agreed) {
          preferences = data.preferences;
          agreed = true;
          readAgreement = true;
          readPrivacy = true;
          applyConsent();
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load cookie preferences:', e);
    }

    showBanner = true;
  }

  function savePreferences(close = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        preferences,
        agreed: true,
        timestamp: Date.now()
      }));
      agreed = true;
    } catch (e) {
      console.error('Failed to save cookie preferences:', e);
    }
    if (close) {
      applyConsent();
      showBanner = false;
      showSettings = false;
    }
  }

  function acceptAll() {
    preferences = {
      necessary: true,
      functional: true,
      analytics: true
    };
    savePreferences();
  }

  function acceptNecessary() {
    preferences = {
      necessary: true,
      functional: false,
      analytics: false
    };
    savePreferences();
  }

  function saveCustomPreferences() {
    preferences.necessary = true;
    savePreferences();
  }

  function withdrawConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    agreed = false;
    readAgreement = false;
    readPrivacy = false;
    showBanner = true;
    showSettings = false;
  }

  function applyConsent() {
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', {
      detail: preferences
    }));
  }
</script>

<!-- Cookie 横幅 -->
{#if showBanner}
  <div class="fixed inset-0 z-50 bg-background/80">
    <div class="fixed bottom-0 left-0 right-0 p-4 md:p-6">
      <Card class="mx-auto max-w-3xl">
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center gap-2">
            <Icon icon="mdi:cookie" class="h-5 w-5" />
            隐私与协议
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <p class="text-xs text-muted-foreground mb-3">
            继续使用本网站即表示你同意以下协议及隐私政策中所述的 Cookie 使用方式。
          </p>
          <div class="space-y-4">
            <p class="text-sm text-muted-foreground">
              点击"接受全部"即表示您同意我们使用所有 Cookie，您也可以点击"自定义设置"来选择您希望启用的 Cookie 类型。
            </p>

      <label class="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
        <Checkbox bind:checked={agreed} disabled={!canAgree} class="mt-0.5" />
        <div class="text-xs space-y-1">
          <span>我已阅读并同意</span>
          <button type="button" class="text-primary underline hover:text-primary/80" onclick={() => overlayContent = 'agreement'}>《用户协议》</button>
          <span>和</span>
        <button type="button" class="text-primary underline hover:text-primary/80" onclick={() => overlayContent = 'privacy'}>《隐私政策》</button>
      </div>
      <div class="text-[10px] {canAgree ? 'text-green-600' : 'text-red-500'}">
        {#if canAgree}
          已完整阅读以上协议 ✓
        {:else}
          您还需要完整阅读{!readAgreement ? '《用户协议》' : ''}{!readAgreement && !readPrivacy ? '和' : ''}{!readPrivacy ? '《隐私政策》' : ''}后方可勾选该复选框
        {/if}
      </div>
    </label>

            <div class="flex flex-wrap gap-3">
              <Button onclick={acceptAll} disabled={!agreed}>
                <Icon icon="mdi:check-all" class="mr-2 h-4 w-4" />
                接受全部
              </Button>
              <Button variant="outline" onclick={acceptNecessary} disabled={!agreed}>
                仅必要 Cookie
              </Button>
              <Button variant="outline" onclick={() => showSettings = true} disabled={!agreed}>
                <Icon icon="mdi:cog" class="mr-2 h-4 w-4" />
                自定义设置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
{/if}

<!-- Cookie 设置对话框 -->
<Dialog.Root bind:open={showSettings}>
  <Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>隐私与协议设置</Dialog.Title>
      <Dialog.Description>
        请阅读并同意用户协议与隐私政策，并选择您希望启用的 Cookie 类型。必要 Cookie 无法禁用。
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-6 py-4">
            <label class="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
              <Checkbox bind:checked={agreed} disabled={!canAgree} class="mt-0.5" />
              <div class="text-xs space-y-1">
                <span>我已阅读并同意</span>
                <button type="button" class="text-primary underline hover:text-primary/80" onclick={() => overlayContent = 'agreement'}>《用户协议》</button>
                <span>和</span>
                <button type="button" class="text-primary underline hover:text-primary/80" onclick={() => overlayContent = 'privacy'}>《隐私政策》</button>
              </div>
              <div class="text-[10px] {canAgree ? 'text-green-600' : 'text-red-500'}">
                {#if canAgree}
                  已完整阅读以上协议 ✓
                {:else}
                  您还需要完整阅读{!readAgreement ? '《用户协议》' : ''}{!readAgreement && !readPrivacy ? '和' : ''}{!readPrivacy ? '《隐私政策》' : ''}后方可勾选该复选框
                {/if}
              </div>
            </label>

      <!-- 必要 Cookie -->
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <Checkbox checked={true} disabled={true} class="mt-1" />
          <div class="flex-1">
            <h3 class="font-semibold">必要 Cookie</h3>
            <p class="text-sm text-muted-foreground mt-1 mb-2">
              这些 Cookie 对于网站的基本功能是必需的，无法禁用。
            </p>
            <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Umami Analytics - 网站统计</li>
              <li>CDN 性能监控</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 功能性 Cookie -->
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <Checkbox bind:checked={preferences.functional} class="mt-1" />
          <div class="flex-1">
            <h3 class="font-semibold">功能性 Cookie</h3>
            <p class="text-sm text-muted-foreground mt-1 mb-2">
              这些 Cookie 用于增强网站功能和个性化体验。
            </p>
            <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Giscus - 评论系统</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 分析 Cookie -->
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <Checkbox bind:checked={preferences.analytics} class="mt-1" />
          <div class="flex-1">
            <h3 class="font-semibold">分析 Cookie</h3>
            <p class="text-sm text-muted-foreground mt-1 mb-2">
              这些 Cookie 帮助我们了解访问者如何使用网站，以便改进用户体验。
            </p>
            <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>百度统计 - 访问分析</li>
              <li>Google Analytics - 用户行为分析</li>
              <li>Microsoft Clarity - 用户体验分析</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <Dialog.Footer class="flex-col gap-2 sm:flex-col sm:justify-center items-center">
      <Button variant="destructive" class="w-full max-w-xs" onclick={withdrawConsent}>
        <Icon icon="mdi:close-circle-outline" class="size-4 mr-1" />撤回同意
      </Button>
      <Button class="w-full max-w-xs" onclick={saveCustomPreferences} disabled={!agreed}>
        保存设置
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 全屏协议展示 -->
{#if overlayContent}
  <div class="fixed inset-0 z-50 bg-background overflow-y-auto" onclick={() => overlayContent = null}>
    <div class="max-w-2xl mx-auto px-6 py-8" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{overlayContent === 'agreement' ? '用户协议' : '隐私政策'}</h2>
        <button type="button" class="text-muted-foreground hover:text-foreground" onclick={() => overlayContent = null}>
          <Icon icon="mdi:close" class="size-6" />
        </button>
      </div>
      <div class="text-sm space-y-3 leading-relaxed">
        {#if overlayContent === 'agreement'}
          <div class="space-y-4">
            <section>
              <h3 class="font-bold text-base mb-2">使用条款</h3>
              <p>欢迎使用 MEMZ-SYSTEM-CORE 的小破站。使用本网站即表示你同意以下条款。</p>
            </section>
            <section>
              <h3 class="font-bold text-base mb-2">内容版权</h3>
              <p>本博客上的所有原创文章均归作者所有。未经许可，禁止转载、复制或用于商业用途。</p>
            </section>
            <section>
              <h3 class="font-bold text-base mb-2">免责声明</h3>
              <p>本博客内容仅供参考和学习交流，不构成任何专业建议。作者不对内容的准确性、完整性或时效性作任何保证。</p>
              <p>你使用本站内容所产生的任何后果由你自行承担。</p>
            </section>
            <section>
              <p class="text-xs text-muted-foreground">最后更新：2026-07-13</p>
            </section>
          </div>
        {:else}
          <div class="space-y-4">
            <section>
              <h3 class="font-bold text-base mb-2">信息收集</h3>
              <p>本站使用浏览器的 localStorage 存储以下信息：</p>
              <ul class="list-disc list-inside space-y-0.5 text-muted-foreground">
                <li><code>theme</code> — 主题偏好（亮色/暗色/跟随系统）</li>
                <li><code>cookie-consent-preferences</code> — Cookie 同意设置</li>
              </ul>
              <p class="mt-2">这些数据仅存储在你自己浏览器中，不会被发送到任何服务器。</p>
            </section>
            <section>
              <h3 class="font-bold text-base mb-2">第三方服务</h3>
              <p>本站使用 Cloudflare 作为 CDN 和部署平台。访问本站时，Cloudflare 可能会记录你的 IP 地址，受 <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" class="text-primary underline">Cloudflare 隐私政策</a>约束。</p>
            </section>
            <section>
              <h3 class="font-bold text-base mb-2">你的选择</h3>
              <p>你可以随时通过页面底部的「隐私与协议设置」撤回同意，或清除浏览器 localStorage 来删除已存储的数据。</p>
            </section>
            <section>
              <p class="text-xs text-muted-foreground">最后更新：2026-07-13</p>
            </section>
          </div>
        {/if}
      </div>
      <div class="mt-6 flex justify-center">
        <button type="button" class="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90" onclick={() => { if (overlayContent === 'agreement') readAgreement = true; if (overlayContent === 'privacy') readPrivacy = true; overlayContent = null; }}>
          我已阅读
        </button>
      </div>
    </div>
  </div>
{/if}
