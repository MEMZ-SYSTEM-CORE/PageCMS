---
title: Astro + PagesCMS 静态站点
pubDate: 2026-07-12
description: 使用 Astro 框架和 PagesCMS 构建的现代化静态站点模板
tags:
  - astro
  - static-site
draft: false
---

## 技术栈

- **[Astro](https://astro.build)** — 现代化静态站点生成器
- **[Pages CMS](https://pagescms.org)** — 基于 Git 的内容管理系统
- **Markdown** — 内容以 Markdown 格式存储，版本控制友好

## 项目结构

```
├── .pages.yml          # PagesCMS 配置
├── src/
│   ├── content/        # 内容文件 (由 PagesCMS 管理)
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面路由
│   └── content.config.ts
└── media/              # 媒体文件 (由 PagesCMS 管理)
```
