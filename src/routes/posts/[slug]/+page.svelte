<script lang="ts">
  import { onMount } from 'svelte';
  import { siteConfig } from '$lib/config/site';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { fadeInUp, fadeIn } from '$lib/utils/motion';

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

  onMount(() => { embedMedia(); loadGiscus(); });

  function loadGiscus() {
    const giscus = document.querySelector('.giscus');
    if (!giscus || giscus.hasChildNodes()) return;

    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'dark' : 'light';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'MEMZ-SYSTEM-CORE/giscuz');
    script.setAttribute('data-repo-id', 'R_kgDOTXCGPw');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOTXCGP84DBGZC');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    giscus.appendChild(script);
  }

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
        w.appendChild(v); return w;
      }
      if (avRe.test(src) && !fileRe.test(src)) {
        const name = src.split('/').pop() || 'audio';
        const c = document.createElement('div');
        c.className = 'bg-card text-card-foreground flex items-center gap-4 rounded-xl ring-1 ring-foreground/10 p-4';
        c.innerHTML = '<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5 text-muted-foreground"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="flex-1 min-w-0"><div class="text-xs font-medium text-muted-foreground truncate mb-1.5">' + name + '</div><audio src="' + src + '" controls preload="none" class="w-full h-9"></audio></div>';
        w.appendChild(c); return w;
      }
      const fileName = src.split('/').pop() || 'file';
      const icon = getFileIcon(ext);
      const displayName = fileName.length > 40 ? fileName.slice(0, 37) + '...' : fileName;
      const card = document.createElement('div');
      card.className = 'group relative overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card transition-all duration-200 hover:shadow-md';
      card.innerHTML = '<div class="flex items-center gap-4 p-4"><div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-xl">' + icon + '</div><div class="flex-1 min-w-0"><div class="text-sm font-medium truncate">' + displayName + '</div><div class="mt-0.5 text-xs text-muted-foreground">' + ext.toUpperCase() + ' 文件</div></div><a href="' + src + '" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground transition-all hover:opacity-90 no-underline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 inline mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载</a></div>';
      w.appendChild(card); return w;
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

<article class="container mx-auto max-w-3xl px-4 py-12">
  <header class="mb-8 mo-fade-in-up" use:fadeInUp>
    <div class="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <time datetime={isoDate}>{dateStr}</time>
      <span class="text-muted-foreground/30">·</span>
      <span>{readingTime} 分钟阅读</span>
    </div>

    <h1 class="mb-4 text-4xl font-bold">{title}</h1>

    {#if description}
      <p class="text-lg text-muted-foreground">{description}</p>
    {/if}

    {#if image}
      <div class="mt-6">
        <img src={image} alt={title} class="w-full rounded-lg object-cover" loading="lazy" decoding="async" />
      </div>
    {/if}

    {#if tags?.length}
      <div class="mt-4 flex gap-2">
        {#each tags.filter(Boolean) as tag}
          <Badge variant="secondary">{tag}</Badge>
        {/each}
      </div>
    {/if}
  </header>

  <div
    id="prose-content"
    class="prose prose-neutral dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] mo-fade-in
      prose-headings:text-foreground prose-headings:scroll-mt-14
      prose-p:text-foreground
      prose-strong:text-foreground
      prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:break-all prose-a:transition-opacity prose-a:hover:opacity-80
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-code:bg-muted prose-code:text-foreground prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-muted prose-pre:px-4 prose-pre:py-2 prose-pre:text-foreground prose-pre:overflow-x-auto
      prose-hr:border-border
      prose-th:border prose-th:border-border prose-th:bg-muted
      prose-td:border prose-td:border-border
      prose-img:rounded-lg"
    use:fadeIn={{ delay: 0.15 }}
  >
    {@html htmlBody}
  </div>

  <footer class="mt-12 border-t pt-8">
    <div class="giscus mt-8"></div>
    <div class="text-center mt-6">
      <a href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">← 返回首页</a>
    </div>
  </footer>
</article>

<style>
  .mo-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .mo-fade-in { animation: fadeIn 0.6s ease-out forwards; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
