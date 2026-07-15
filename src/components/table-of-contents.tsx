"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Get all h2 and h3 inside the prose content
    const prose = document.querySelector("#prose-content");
    if (!prose) return;

    const items: HeadingItem[] = [];
    const els: Element[] = [];
    const allHeadings = prose.querySelectorAll("h2, h3");

    allHeadings.forEach((el) => {
      if (el.id) {
        items.push({ id: el.id, text: el.textContent || "", level: el.tagName === "H2" ? 2 : 3 });
        els.push(el);
      }
    });

    setHeadings(items);
    if (items.length === 0) return;

    // Observe heading positions for active tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const el of els) {
      observerRef.current.observe(el);
    }

    // Set first heading as active by default
    if (els.length > 0) setActiveId(els[0].id);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 w-52 shrink-0">
      <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider uppercase">本页目录</h3>
      <ul className="space-y-0.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block text-xs py-1.5 transition-colors border-l -ml-px pr-2 leading-snug",
                activeId === h.id
                  ? "text-foreground border-l-foreground font-medium"
                  : "text-muted-foreground border-l-transparent hover:text-foreground hover:border-l-foreground/30",
                h.level === 3 && "pl-6",
                h.level === 2 && "pl-3"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
