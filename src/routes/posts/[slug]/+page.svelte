<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig } from '$lib/config/site';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';

  let { data }: { data: { post: { slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[]; body: string } } } = $props();
  let { title, pubDate, description, image, tags, body } = $derived(data.post);

  const dateStr = $derived(pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }));
  const isoDate = $derived(pubDate.toISOString());
  const readingTime = $derived(Math.max(1, Math.ceil((description?.length ?? 100) / 400)));

  const htmlBody = $derived(renderMarkdown(body));

  function renderMarkdown(md: string): string {
    let html = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^---$/gm, '<hr />')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    return html.split('\n\n').map(block => {
      const t = block.trim();
      if (!t) return '';
      if (/^<(h|ul|ol|li|pre|blockquote|hr|img|p)/.test(t)) return t;
      return '<p>' + t.replace(/\n/g, '<br />') + '</p>';
    }).join('\n');
  }

  onMount(() => { embedMedia(); });

  function embedMedia() {
    const prose = document.getElementById('prose-content');
    if (!prose) return;

    const avRe = /\.(mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|aac|m4a|wma)(?:$|[?#])/i;
    const videoRe = /\.(mp4|webm|ogg|mov|avi|mkv)/i;
    const fileRe = /\.(exe|zip|7z|rar|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|apk|deb|rpm|iso|dmg|msi)(?:$|[?#])/i;
    const allRe = /\.(mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|aac|m4a|wma|exe|zip|7z|rar|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|apk|deb|rpm|iso|dmg|msi)(?:$|[?#])/i;

    function getFileIcon(ext: string): string {
      if (/zip|7z|rar|tar|gz/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
      if (/pdf|doc|docx|xls|xlsx|ppt|pptx/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
      if (/exe|msi|apk|deb|rpm|dmg|iso/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    }

    function makePlayer(src: string): HTMLElement {
      const ext = src.split('.').pop()!.split(/[?#]/)[0].toLowerCase();
      const w = document.createElement('div');
      w.className = 'my-6';
      w.setAttribute('data-media', '');

      if (videoRe.test(src)) {
        const v = document.createElement('video');
        v.src = src; v.controls = true; v.playsInline = true; v.preload = 'metadata';
        v.className = 'w-full max-h-[70vh] rounded-2xl bg-black';
        w.appendChild(v);
        return w;
      }

      if (avRe.test(src) && !fileRe.test(src)) {
        const name = src.split('/').pop() || 'audio';
        const c = document.createElement('div');
        c.className = 'bg-card text-card-foreground flex items-center gap-4 rounded-xl ring-1 ring-foreground/10 p-4';
        c.innerHTML = '<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5 text-muted-foreground"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="flex-1 min-w-0"><div class="text-xs font-medium text-muted-foreground truncate mb-1.5">' + name + '</div><audio src="' + src + '" controls preload="none" class="w-full h-9"></audio></div>';
        w.appendChild(c);
        return w;
      }

      const fileName = src.split('/').pop() || 'file';
      const icon = getFileIcon(ext);
      const displayName = fileName.length > 40 ? fileName.slice(0, 37) + '...' : fileName;
      const card = document.createElement('div');
      card.className = 'group relative overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card transition-all duration-200 hover:shadow-md';
      card.innerHTML = '<div class="flex items-center gap-4 p-4"><div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-xl">' + icon + '</div><div class="flex-1 min-w-0"><div class="text-sm font-medium truncate">' + displayName + '</div><div class="mt-0.5 text-xs text-muted-foreground">' + ext.toUpperCase() + ' 文件</div></div><a href="' + src + '" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground transition-all hover:opacity-90 no-underline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 inline mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载</a></div>';
      w.appendChild(card);
      return w;
    }

    const iter = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, null, false);
    const todo: Array<{ node: Node; frag: DocumentFragment }> = [];
    while (iter.nextNode()) {
      const n = iter.currentNode;
      const txt = n.textContent;
      if (!txt) continue;
      const p = n.parentNode!;
      if (p.nodeName === 'A') continue;
      if ((p as HTMLElement).closest?.('[data-media]')) continue;
      const m = txt.match(/(https?:\/\/\S+?|\/\S+?)\.(?:mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|aac|m4a|wma|exe|zip|7z|rar|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|apk|deb|rpm|iso|dmg|msi)(?:[?#]\S*)?/i);
      if (!m) continue;
      const url = m[0];
      const idx = txt.indexOf(url);
      const frag = document.createDocumentFragment();
      if (idx > 0) frag.appendChild(document.createTextNode(txt.slice(0, idx)));
      frag.appendChild(makePlayer(url));
      if (idx + url.length < txt.length) frag.appendChild(document.createTextNode(txt.slice(idx + url.length)));
      todo.push({ node: n, frag });
    }
    todo.forEach((t) => t.node.parentNode!.replaceChild(t.frag, t.node));

    prose.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
      if (a.href && allRe.test(a.href) && !a.hasAttribute('data-skip-media')) {
        a.parentNode!.replaceChild(makePlayer(a.href), a);
      }
    });
  }
</script>

<svelte:head>
  <title>{title} — {siteConfig.siteName}</title>
  <meta name="description" content={description || '阅读文章'} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description || '阅读文章'} />
  {#if image}<meta property="og:image" content={image} />{/if}
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={isoDate} />
  {#if tags?.length}<meta name="keywords" content={tags.filter(Boolean).join(', ')} />{/if}
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description || '阅读文章'} />
  {#if image}<meta name="twitter:image" content={image} />{/if}
</svelte:head>

<div class="mx-auto max-w-3xl">
  <a href="/" class="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m15 18-6-6 6-6"/></svg>
    返回文章列表
  </a>

  <article class="mo-fade-in-up">
    <Card.Root class="overflow-hidden border-0 shadow-sm">
      {#if image}
        <div class="overflow-hidden">
          <img src={image} alt={title} class="h-64 w-full object-cover sm:h-80" loading="lazy" decoding="async" />
        </div>
      {/if}
      <Card.Header class="pb-0 pt-6 sm:pt-8">
        <div class="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
          <time datetime={isoDate} class="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"/><path d="M16 3v4M8 3v4"/></svg>
            {dateStr}
          </time>
          <span class="text-muted-foreground/30">·</span>
          <span class="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {readingTime} 分钟阅读
          </span>
        </div>
        <Card.Title class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</Card.Title>
        {#if description}
          <Card.Description class="mt-2 text-base">{description}</Card.Description>
        {/if}
        {#if tags?.length}
          <div class="mt-4 flex flex-wrap gap-2">
            {#each tags.filter(Boolean) as tag}
              <Badge variant="secondary">{tag}</Badge>
            {/each}
          </div>
        {/if}
      </Card.Header>

      <Card.Content class="pt-6 sm:pt-8">
        <div class="prose max-w-none" id="prose-content">
          {@html htmlBody}
        </div>
      </Card.Content>

      <Card.Footer class="flex-col items-start gap-3 border-t px-6 py-5 sm:px-8">
        <div class="flex w-full items-center justify-between">
          <span class="text-xs text-muted-foreground/60">{siteConfig.siteName}</span>
          <a href="/" class="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m15 18-6-6 6-6"/></svg>
            返回首页
          </a>
        </div>
      </Card.Footer>
    </Card.Root>
  </article>
</div>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
