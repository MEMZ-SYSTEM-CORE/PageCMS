"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Copy } from "lucide-react";

const presets = [
  { label: "深色", bg: "#1a1a2e", text: "#ffffff", accent: "#e94560" },
  { label: "浅色", bg: "#f8f9fa", text: "#212529", accent: "#0d6efd" },
  { label: "自然", bg: "#2d5016", text: "#ffffff", accent: "#a8e06c" },
  { label: "暖色", bg: "#2c1810", text: "#f5e6d3", accent: "#d4a574" },
];

export default function CoverPage() {
  const [titleText, setTitleText] = useState("我的文章标题");
  const [subtitleText, setSubtitleText] = useState("副标题或描述文字");
  const [authorText, setAuthorText] = useState("MEMZ-SYSTEM-CORE");
  const [fontSize, setFontSize] = useState(48);
  const [subtitleSize, setSubtitleSize] = useState(20);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#e94560");
  const [showAccent, setShowAccent] = useState(true);
  const [activeTab, setActiveTab] = useState<"design" | "text">("design");

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const chars = text.split("");
    let line = "";
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

  function download() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1200, 630);
    if (showAccent) {
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 8, 630);
    }
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(fontSize * 1.8)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapText(ctx, titleText || "标题", 600, 260, 900, fontSize * 2.2);
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
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillText(authorText, 600, 420);
      ctx.globalAlpha = 1;
    }
    const link = document.createElement("a");
    link.download = "cover-" + Date.now() + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function copyStyle() {
    const css = `background: ${bgColor}; color: ${textColor};${showAccent ? ` border-left: 4px solid ${accentColor};` : ""}`;
    navigator.clipboard.writeText(css).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">封面生成器</h1>
        <p className="text-sm text-muted-foreground">在线生成精美的博客封面图片</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 animate-fade-in animate-fade-in-delay-1">
          <Card className="overflow-hidden ring-1 ring-foreground/10">
            <div
              className="relative flex flex-col items-center justify-center p-8 text-center"
              style={{ background: bgColor, minHeight: 320 }}
            >
              {showAccent && (
                <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: accentColor }} />
              )}
              <h2 className="mb-2 font-bold leading-tight tracking-tight" style={{ color: textColor, fontSize }}>
                {titleText || "标题"}
              </h2>
              {subtitleText && (
                <p className="max-w-md opacity-80" style={{ color: textColor, fontSize: subtitleSize }}>
                  {subtitleText}
                </p>
              )}
              {authorText && (
                <div className="mt-6 flex items-center gap-2 text-sm opacity-60" style={{ color: textColor }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {authorText}
                </div>
              )}
            </div>
          </Card>

          <div className="mt-3 flex gap-2">
            <Button onClick={download} className="flex-1">
              <Download className="size-4 mr-1" />下载 PNG
            </Button>
            <Button variant="outline" onClick={copyStyle}>
              <Copy className="size-4 mr-1" />复制样式
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 animate-fade-in animate-fade-in-delay-2">
          <Card className="ring-1 ring-foreground/10">
            <CardContent className="p-4">
              <div className="flex gap-2 mb-4">
                <Button variant={activeTab === "design" ? "default" : "outline"} className="flex-1" onClick={() => setActiveTab("design")}>设计</Button>
                <Button variant={activeTab === "text" ? "default" : "outline"} className="flex-1" onClick={() => setActiveTab("text")}>文字</Button>
              </div>

              {activeTab === "design" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor">背景色</Label>
                    <div className="flex gap-2">
                      <input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-9 cursor-pointer rounded border" />
                      <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">文字色</Label>
                    <div className="flex gap-2">
                      <input id="textColor" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-9 cursor-pointer rounded border" />
                      <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="font-mono text-xs" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">强调色</Label>
                    <div className="flex gap-2">
                      <input id="accentColor" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-9 w-9 cursor-pointer rounded border" />
                      <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="showAccent" type="checkbox" checked={showAccent} onChange={(e) => setShowAccent(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="showAccent" className="text-sm font-normal">显示强调条</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>配色预设</Label>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { setBgColor(item.bg); setTextColor(item.text); setAccentColor(item.accent); }}
                          className="h-8 w-12 rounded border-2 border-transparent transition-all hover:scale-110 hover:border-foreground"
                          style={{ background: item.bg }}
                          title={item.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "text" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题</Label>
                    <Input id="title" value={titleText} onChange={(e) => setTitleText(e.target.value)} placeholder="文章标题" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">副标题</Label>
                    <Input id="subtitle" value={subtitleText} onChange={(e) => setSubtitleText(e.target.value)} placeholder="副标题或描述" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">作者</Label>
                    <Input id="author" value={authorText} onChange={(e) => setAuthorText(e.target.value)} placeholder="作者名称" />
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Label>标题大小：{fontSize}px</Label>
                    <input type="range" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min={24} max={80} className="w-full accent-foreground" />
                  </div>
                  <div className="space-y-1">
                    <Label>副标题大小：{subtitleSize}px</Label>
                    <input type="range" value={subtitleSize} onChange={(e) => setSubtitleSize(Number(e.target.value))} min={12} max={40} className="w-full accent-foreground" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
