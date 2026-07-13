<script lang="ts">
  import { siteConfig } from '$lib/config/site';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Slider } from '$lib/components/ui/slider/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';

  let titleText = $state('My Blog Post');
  let subtitleText = $state('A subtitle or description');
  let authorText = $state('MEMZ-SYSTEM-CORE');
  let fontSize = $state(48);
  let subtitleSize = $state(20);
  let bgColor = $state('#1a1a2e');
  let textColor = $state('#ffffff');
  let accentColor = $state('#e94560');
  let showAccent = $state(true);
  let previewRef = $state<HTMLDivElement>();

  function download() {
    if (!previewRef) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1200, 630);

    // Accent bar
    if (showAccent) {
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 8, 630);
    }

    // Title
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize * 1.8}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, titleText || 'Title', 600, 260, 900, fontSize * 2.2);

    // Subtitle
    if (subtitleText) {
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.7;
      ctx.font = `${subtitleSize * 1.8}px system-ui, sans-serif`;
      ctx.fillText(subtitleText, 600, 340);
      ctx.globalAlpha = 1;
    }

    // Author
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
    let lines: string[] = [];
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
  const presets = [
    { label: 'Dark', bg: '#1a1a2e', text: '#ffffff', accent: '#e94560' },
    { label: 'Light', bg: '#f8f9fa', text: '#212529', accent: '#0d6efd' },
    { label: 'Nature', bg: '#2d5016', text: '#ffffff', accent: '#a8e06c' },
    { label: 'Warm', bg: '#2c1810', text: '#f5e6d3', accent: '#d4a574' },
  ];
</script>

<svelte:head>
  <title>Cover Generator — {siteConfig.siteName}</title>
  <meta name="description" content="Generate beautiful blog cover images" />
</svelte:head>

<div class="mx-auto max-w-4xl">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Cover Generator</h1>
      <p class="text-sm text-muted-foreground">Design blog post cover images</p>
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
            {titleText || 'Title'}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PNG
        </Button>
        <Button variant="outline" onclick={copyStyle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy CSS
        </Button>
      </div>
    </div>

    <!-- Controls -->
    <div class="lg:col-span-2">
      <Tabs.Root bind:value={activeTab}>
        <Tabs.List class="w-full">
          <Tabs.Trigger value="design" class="flex-1">Design</Tabs.Trigger>
          <Tabs.Trigger value="text" class="flex-1">Text</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="design" class="mt-4 space-y-4">
          <div class="space-y-2">
            <Label for="bgColor">Background</Label>
            <div class="flex gap-2">
              <input id="bgColor" type="color" bind:value={bgColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={bgColor} oninput={(e) => bgColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="textColor">Text Color</Label>
            <div class="flex gap-2">
              <input id="textColor" type="color" bind:value={textColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={textColor} oninput={(e) => textColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="accentColor">Accent</Label>
            <div class="flex gap-2">
              <input id="accentColor" type="color" bind:value={accentColor} class="h-9 w-9 cursor-pointer rounded border" />
              <Input value={accentColor} oninput={(e) => accentColor = (e.target as HTMLInputElement).value} class="font-mono text-xs" />
            </div>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" bind:checked={showAccent} class="rounded" />
              Show accent bar
            </label>
          </div>

          <div class="space-y-2">
            <Label for="presets">Presets</Label>
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
            <Label for="title">Title</Label>
            <Input id="title" bind:value={titleText} placeholder="Post title" />
          </div>

          <div class="space-y-2">
            <Label for="subtitle">Subtitle</Label>
            <Input id="subtitle" bind:value={subtitleText} placeholder="Subtitle or description" />
          </div>

          <div class="space-y-2">
            <Label for="author">Author</Label>
            <Input id="author" bind:value={authorText} placeholder="Author name" />
          </div>

          <Separator />

          <div class="space-y-2">
            <Label>Title Size: {fontSize}px</Label>
            <Slider bind:value={fontSize} min={24} max={80} step={2} />
          </div>

          <div class="space-y-2">
            <Label>Subtitle Size: {subtitleSize}px</Label>
            <Slider bind:value={subtitleSize} min={12} max={40} step={2} />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
