<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';

  let titleText = $state('我的文章标题');
  let subtitleText = $state('副标题或描述文字');
  let authorText = $state('MEMZ-SYSTEM-CORE');
  let fontSize = $state(48);
  let subtitleSize = $state(20);
  let bgColor = $state('#1a1a2e');
  let textColor = $state('#ffffff');
  let accentColor = $state('#e94560');
  let showAccent = $state(true);
  let previewRef = $state<HTMLDivElement>();

  const presets = [
    { label: '深色', bg: '#1a1a2e', text: '#ffffff', accent: '#e94560' },
    { label: '浅色', bg: '#f8f9fa', text: '#212529', accent: '#0d6efd' },
    { label: '自然', bg: '#2d5016', text: '#ffffff', accent: '#a8e06c' },
    { label: '暖色', bg: '#2c1810', text: '#f5e6d3', accent: '#d4a574' },
  ];

  function download() {
    if (!previewRef) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1200, 630);
    if (showAccent) {
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 8, 630);
    }
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(fontSize * 1.8)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, titleText || '标题', 600, 260, 900, fontSize * 2.2);
    if (subtitleText) {
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.7;
      ctx.font = `${Math.round(subtitleSize * 1.8)}px system-ui, sans-serif`;
      ctx.fillText(subtitleText, 600, 340);
      ctx.globalAlpha = 1;
    }
    if (authorText) {
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.5;
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(authorText, 600, 420);
      ctx.globalAlpha = 1;
    }
    const link = document.createElement('a');
    link.download = 'cover-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const chars = text.split('');
    let line = '';
    const lines: string[] = [];
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  }

  function copyStyle() {
    const css = `background: ${bgColor}; color: ${textColor};${showAccent ? ` border-left: 4px solid ${accentColor};` : ''}`;
    navigator.clipboard.writeText(css).catch(() => {});
  }

  let activeTab = $state('design');
</script>

<svelte:head>
  <title>封面生成器 — {siteConfig.siteName}</title>
  <meta name="description" content="在线生成精美的博客封面图片" />
</svelte:head>

<div class="mx-auto max-w-4xl">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">封面生成器</h1>
      <p class="text-sm text-muted-foreground">在线生成精美的博客封面图片</p>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-5">
    <!-- Preview -->
    <div class="lg:col-span-3">
      <Card.Root class="overflow-hidden">
        <div bind:this={previewRef} class="relative flex flex-col items-center justify-center p-8 text-center" style="background: {bgColor}; min-height: 320px;">
          {#if showAccent}
            <div class="absolute left-0 top-0 h-full w-1.5" style="background: {accentColor};"></div>
          {/if}
          <h2 class="mb-2 font-bold leading-tight tracking-tight" style="color: {textColor}; font-size: {fontSize}px;">
            {titleText || '标题'}
          </h2>
          {#if subtitleText}
            <p class="max-w-md opacity-80" style="color: {textColor}; font-size: {subtitleSize}px;">
              {subtitleText}
            </p>
          {/if}
          {#if authorText}
            <div class="mt-6 flex items-center gap-2 text-sm opacity-60" style="color: {textColor};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {authorText}
            </div>
          {/if}
        </div>
      </Card.Root>

      <div class="mt-3 flex gap-2">
        <Button onclick={download} class="flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-icon="inline-start"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          下载 PNG
        </Button>
        <Button variant="outline" onclick={copyStyle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-icon="inline-start"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          复制样式
        </Button>
      </div>
    </div>

    <!-- Controls -->
    <div class="lg:col-span-2">
      <Tabs.Root bind:value={activeTab}>
        <Tabs.List class="w-full">
          <Tabs.Trigger value="design" class="flex-1">设计</Tabs.Trigger>
          <Tabs.Trigger value="text" class="flex-1">文字</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="design" class="mt-4 space-y-4">
          <div class="space-y-2">
            <Label for="bgColor">背景色</Label>
            <div class="flex gap-2">
              <input id="bgColor" type="color" bind:value={bgColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={bgColor} oninput={(e) => bgColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="textColor">文字色</Label>
            <div class="flex gap-2">
              <input id="textColor" type="color" bind:value={textColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={textColor} oninput={(e) => textColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="accentColor">强调色</Label>
            <div class="flex gap-2">
              <input id="accentColor" type="color" bind:value={accentColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={accentColor} oninput={(e) => accentColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
            <div class="flex items-center gap-2">
              <Switch id="showAccent" bind:checked={showAccent} />
              <Label for="showAccent" class="text-sm font-normal">显示强调条</Label>
            </div>
          </div>

          <div class="space-y-2">
            <Label>配色预设</Label>
            <div class="flex flex-wrap gap-2">
              {#each presets as item}
                <button
                  onclick={() => { bgColor = item.bg; textColor = item.text; accentColor = item.accent; }}
                  class="h-8 w-12 rounded border-2 border-transparent transition-all hover:scale-110 hover:border-foreground"
                  style="background: {item.bg};"
                  title={item.label}
                ></button>
              {/each}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="text" class="mt-4 space-y-4">
          <div class="space-y-2">
            <Label for="title">标题</Label>
            <Input id="title" bind:value={titleText} placeholder="文章标题" />
          </div>

          <div class="space-y-2">
            <Label for="subtitle">副标题</Label>
            <Input id="subtitle" bind:value={subtitleText} placeholder="副标题或描述" />
          </div>

          <div class="space-y-2">
            <Label for="author">作者</Label>
            <Input id="author" bind:value={authorText} placeholder="作者名称" />
          </div>

          <Separator />

          <div class="space-y-1">
            <Label>标题大小：{fontSize}px</Label>
            <input type="range" bind:value={fontSize} min={24} max={80} class="w-full accent-foreground" />
          </div>

          <div class="space-y-1">
            <Label>副标题大小：{subtitleSize}px</Label>
            <input type="range" bind:value={subtitleSize} min={12} max={40} class="w-full accent-foreground" />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
