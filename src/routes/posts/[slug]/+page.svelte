<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig } from '$lib/config/site';

  let { data }: { data: { post: { slug: string; title: string; pubDate: Date; description?: string; image?: string; tags?: string[]; body: string } } } = $props();
  let { title, pubDate, description, image, tags, body } = $derived(data.post);

  const dateStr = $derived(pubDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }));
  const isoDate = $derived(pubDate.toISOString());
  const readingTime = $derived(Math.max(1, Math.ceil((description?.length ?? 100) / 400)));

  // Simple markdown rendering
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

  // Media auto-embed
  onMount(() => {
    embedMedia();
  });

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
        v.className = 'w-full max-h-[70vh] rounded-2xl bg-black ring-1 ring-foreground/10';
        w.appendChild(v);
        return w;
      }

      if (avRe.test(src) && !fileRe.test(src)) {
        const name = src.split('/').pop() || 'audio';
        const c = document.createElement('div');
        c.className = 'ring-foreground/10 bg-card text-card-foreground flex items-center gap-4 rounded-2xl ring-1 p-5';
        c.innerHTML = '<div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-6 text-muted-foreground"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="flex-1 min-w-0"><div class="text-xs font-medium text-muted-foreground truncate mb-2">' + name + '</div><audio src="' + src + '" controls preload="none" class="w-full h-10"></audio></div>';
        w.appendChild(c);
        return w;
      }

      const fileName = src.split('/').pop() || 'file';
      const icon = getFileIcon(ext);
      const displayName = fileName.length > 40 ? fileName.slice(0, 37) + '...' : fileName;
      const card = document.createElement('div');
      card.className = 'group relative overflow-hidden rounded-2xl ring-1 ring-foreground/10 bg-gradient-to-br from-card to-muted/30 transition-all duration-300 hover:ring-foreground/20 hover:shadow-md';
      card.innerHTML = '<div class="flex items-center gap-4 p-5"><div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 text-2xl shadow-sm ring-1 ring-foreground/5">' + icon + '</div><div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent/70">' + ext.toUpperCase() + '</span></div><div class="mt-1.5 text-sm font-medium truncate text-foreground/90">' + displayName + '</div><div class="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground"><span>文件下载</span></div></div><a href="' + src + '" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 no-underline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="!size-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载</a></div>';
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

<article class="mo-fade-in-up">
  <nav aria-label="面包屑导航">
    <a href="/" class="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m15 18-6-6 6-6"/></svg>Back to posts
    </a>
  </nav>

  <header class="mb-8">
    <div class="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
      <time datetime={isoDate}>{dateStr}</time>
      <span class="text-muted-foreground/40">·</span>
      <span>{readingTime} min read</span>
    </div>
    <h1 class="mb-4 text-4xl font-bold">{title}</h1>
    {#if description}<p class="text-sm text-muted-foreground">{description}</p>{/if}
    {#if image}
      <div class="-mx-4 mt-6 sm:-mx-0">
        <img src={image} alt={title} class="max-h-96 w-full rounded-xl object-cover" loading="lazy" decoding="async" />
      </div>
    {/if}
    {#if tags?.length}
      <div class="mt-3 flex flex-wrap gap-2">
        {#each tags.filter(Boolean) as tag}
          <span class="inline-flex items-center rounded-4xl border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{tag}</span>
        {/each}
      </div>
    {/if}
  </header>

  <div class="prose" id="prose-content">
    {@html htmlBody}
  </div>

  <nav class="mt-16 border-t pt-6">
    <a href="/" class="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="m15 18-6-6 6-6"/></svg>All posts
    </a>
  </nav>
</article>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
