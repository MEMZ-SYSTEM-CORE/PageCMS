"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Link2, Check, Copy } from "lucide-react";

interface MarkdownContentProps {
  content: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 size-7 rounded-md bg-background/60 hover:bg-background border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-foreground z-10"
      aria-label="复制代码"
    >
      {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function HeadingLink({ level, id, children }: { level: 2 | 3; id: string; children: React.ReactNode }) {
  const Tag = level === 2 ? "h2" : "h3";

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Tag id={id} className="group relative">
      <button
        type="button"
        onClick={handleCopyLink}
        className="absolute -left-7 top-1/2 -translate-y-1/2 size-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-primary hover:bg-muted/50"
        aria-label="复制链接"
      >
        <Link2 className="size-3.5" />
      </button>
      {children}
    </Tag>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        h2: ({ id, children, ...props }) => (
          <HeadingLink level={2} id={id || ""}>
            {children}
          </HeadingLink>
        ),
        h3: ({ id, children, ...props }) => (
          <HeadingLink level={3} id={id || ""}>
            {children}
          </HeadingLink>
        ),
        pre: ({ children, ...props }) => (
          <div className="group relative">
            <pre {...props} className="relative">
              {children}
            </pre>
            {/* Extract code text for copy button */}
            <CopyButton text={extractText(children)} />
          </div>
        ),
        img: ({ src, alt, ...props }) => {
          if (!src || typeof src !== "string") return null;
          return (
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              className="w-full rounded-lg object-cover border border-border/50"
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

/** Recursively extract text from React children */
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}
