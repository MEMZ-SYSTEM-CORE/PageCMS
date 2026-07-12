---
title: Astro + PagesCMS 技术栈
pubDate: 2026-07-12
description: 本站使用的技术栈简介
tags:
  - astro
  - pagescms
draft: false
---

## 技术栈

- **[Astro](https://astro.build)** — 静态站点生成器
- **[Pages CMS](https://pagescms.org)** — 基于 Git 的内容管理
- **shadcn-svelte** — UI 组件库
- **Tailwind CSS v4** — 样式引擎

## 项目结构

```
├── .pages.yml          # PagesCMS 配置
├── src/
│   ├── content/        # 内容文件
│   ├── components/     # Svelte 组件
│   ├── layouts/        # 布局
│   └── pages/          # 页面路由
└── media/              # 媒体文件
```
