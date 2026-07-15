# PageCMS 项目指南

## 项目概述

基于 Next.js 15 (App Router) 和 Magic UI 的个人博客，使用 Cloudflare Workers 部署。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 组件**: Magic UI (基于 shadcn/ui)
- **样式**: Tailwind CSS v4 + oklch 色彩系统
- **部署**: Cloudflare Workers
- **内容管理**: PagesCMS (基于 Git)

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm deploy       # 部署到 Cloudflare Workers
```

## 项目结构

- `src/app/` - Next.js App Router 页面
- `src/components/` - React 组件
- `src/lib/` - 工具函数和配置
- `src/content/` - Markdown 内容文件

## 内容管理

使用 PagesCMS 管理内容，配置文件为 `.pages.yml`。

## 部署

1. 推送代码到 GitHub
2. GitHub Actions 自动构建
3. 部署到 Cloudflare Workers
