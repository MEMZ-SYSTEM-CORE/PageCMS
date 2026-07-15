"use client";

import { useEffect } from "react";

export function PostMediaEmbed() {
  useEffect(() => {
    const prose = document.getElementById("prose-content");
    if (!prose) return;

    const avRe = /\.(mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|aac|m4a|wma)(?:$|[?#])/i;
    const videoRe = /\.(mp4|webm|ogg|mov|avi|mkv)/i;
    const fileRe = /\.(exe|zip|7z|rar|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|apk|deb|rpm|iso|dmg|msi)(?:$|[?#])/i;
    const allRe = /\.(mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|aac|m4a|wma|exe|zip|7z|rar|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|apk|deb|rpm|iso|dmg|msi)(?:[?#]\S*)?/i;

    function getFileIcon(ext: string): string {
      if (/zip|7z|rar|tar|gz/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
      if (/pdf|doc|docx|xls|xlsx|ppt|pptx/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
      if (/exe|msi|apk|deb|rpm|dmg|iso/.test(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-7"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    }

    function makePlayer(src: string): HTMLElement {
      const ext = src.split(".").pop()!.split(/[?#]/)[0].toLowerCase();
      const w = document.createElement("div");
      w.className = "my-6";
      w.setAttribute("data-media", "");
      if (videoRe.test(src)) {
        const v = document.createElement("video");
        v.src = src;
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.className = "w-full max-h-[70vh] rounded-2xl bg-black";
        w.appendChild(v);
        return w;
      }
      if (avRe.test(src) && !fileRe.test(src)) {
        const name = src.split("/").pop() || "audio";
        const c = document.createElement("div");
        c.className = "bg-card text-card-foreground flex items-center gap-4 rounded-xl ring-1 ring-foreground/10 p-4";
        c.innerHTML = '<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5 text-muted-foreground"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="flex-1 min-w-0"><div class="text-xs font-medium text-muted-foreground truncate mb-1.5">' + name + '</div><audio src="' + src + '" controls preload="none" class="w-full h-9"></audio></div>';
        w.appendChild(c);
        return w;
      }
      const fileName = src.split("/").pop() || "file";
      const icon = getFileIcon(ext);
      const displayName = fileName.length > 40 ? fileName.slice(0, 37) + "..." : fileName;
      const card = document.createElement("div");
      card.className = "group relative overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card transition-all duration-200 hover:shadow-md";
      card.innerHTML = '<div class="flex items-center gap-4 p-4"><div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/5 text-xl">' + icon + '</div><div class="flex-1 min-w-0"><div class="text-sm font-medium truncate">' + displayName + '</div><div class="mt-0.5 text-xs text-muted-foreground">' + ext.toUpperCase() + " 文件</div></div><a href=\"" + src + '" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground transition-all hover:opacity-90 no-underline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 inline mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载</a></div>';
      w.appendChild(card);
      return w;
    }

    const iter = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT);
    const todo: Array<{ node: Node; frag: DocumentFragment }> = [];
    while (iter.nextNode()) {
      const n = iter.currentNode;
      const txt = n.textContent;
      if (!txt) continue;
      const p = n.parentNode!;
      if (p.nodeName === "A") continue;
      if ((p as HTMLElement).closest?.("[data-media]")) continue;
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
    prose.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
      if (a.href && allRe.test(a.href) && !a.hasAttribute("data-skip-media")) {
        a.parentNode!.replaceChild(makePlayer(a.href), a);
      }
    });
  }, []);

  return null;
}
