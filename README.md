# PageCMS

基于 [Astro](https://astro.build) 构建、[Pages CMS](https://pagescms.org) 管理内容的静态站点模板。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

### 3. 构建

```bash
npm run build
```

### 4. 连接 PagesCMS

1. 前往 [app.pagescms.org](https://app.pagescms.org)
2. 使用 GitHub 登录
3. 安装 GitHub App 到你的账户或组织
4. 选择 `memz-system-core/pagecms` 仓库
5. 自动读取 `.pages.yml` 配置，开始编辑内容

## 项目结构

```
├── .pages.yml              # PagesCMS 配置
├── src/
│   ├── content.config.ts   # Astro 内容集合定义
│   ├── content/
│   │   ├── posts/          # 文章 (Markdown, 由 PagesCMS 管理)
│   │   └── pages/          # 页面 (Markdown, 由 PagesCMS 管理)
│   ├── layouts/
│   │   └── Layout.astro    # 全局布局
│   └── pages/
│       ├── index.astro     # 首页 (文章列表)
│       ├── about.astro     # 关于页面
│       └── blog/
│           └── [slug].astro # 文章详情页
├── media/                   # 媒体文件 (由 PagesCMS 管理)
└── package.json
```

## 内容管理

本项目使用 [Pages CMS](https://pagescms.org) 进行内容管理。配置文件 `.pages.yml` 定义了以下内容类型：

### 文章 (posts)
- 存放在 `src/content/posts/` 目录
- 包含标题、发布日期、描述、封面图、标签、草稿状态等字段
- 支持 Markdown 正文

### 页面 (pages)
- 存放在 `src/content/pages/` 目录
- 包含标题、描述等字段
- 支持 Markdown 正文

## 技术栈

- [Astro](https://astro.build) — 现代化静态站点生成器
- [Pages CMS](https://pagescms.org) — 基于 Git 的内容管理系统
- Markdown / YAML Frontmatter — 内容格式
