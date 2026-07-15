# PageCMS - Next.js + Magic UI

一个基于 Next.js 和 Magic UI 的个人博客，使用 Cloudflare Workers 部署。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 组件**: Magic UI (基于 shadcn/ui)
- **样式**: Tailwind CSS v4 + oklch 色彩系统
- **部署**: Cloudflare Workers
- **内容管理**: PagesCMS (基于 Git)

## 功能特性

- 📝 博客文章（Markdown + YAML frontmatter）
- 🔍 文章搜索（支持标题/描述/标签过滤）
- 🎨 封面生成器（Canvas API）
- 🌙 深色/浅色模式切换
- 💬 Giscus 评论系统
- 📱 响应式设计
- 🚀 静态生成 + ISR

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 全局布局
│   ├── globals.css        # 全局样式
│   ├── posts/             # 文章页面
│   │   ├── page.tsx       # 文章列表
│   │   └── [slug]/        # 文章详情
│   ├── cover/             # 封面生成器
│   ├── about/             # 关于页面
│   ├── rss.xml/           # RSS 订阅
│   ├── sitemap.xml/       # Sitemap
│   └── api/               # API 路由
│       ├── media/         # 媒体管理
│       ├── upload/        # 文件上传
│       ├── delete/        # 文件删除
│       ├── token/         # Token 验证
│       └── fetch-url/     # URL 下载
├── components/            # React 组件
│   ├── ui/                # Magic UI 组件
│   ├── nav-bar.tsx        # 导航栏
│   ├── footer.tsx         # 页脚
│   ├── theme-provider.tsx # 主题上下文
│   ├── theme-toggle.tsx   # 主题切换
│   ├── back-to-top.tsx    # 回到顶部
│   └── cookie-consent.tsx # Cookie 同意
├── lib/                   # 工具函数
│   ├── utils.ts           # 通用工具
│   ├── content-server.ts  # 内容读取（服务端）
│   └── config/
│       └── site.ts        # 站点配置
└── content/               # 内容文件
    ├── posts/             # 博客文章
    ├── pages/             # 静态页面
    └── settings/          # 站点设置
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 部署到 Cloudflare Workers
pnpm deploy
```

## 环境变量

在 Cloudflare Workers 控制台配置：

- `GITHUB_TOKEN`: GitHub API Token（用于 PagesCMS 媒体管理）

## 部署

1. 推送代码到 GitHub
2. 在 Cloudflare Workers 控制台创建 Worker
3. 配置 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` secrets
4. 运行 GitHub Actions 工作流或手动部署

## License

MIT
