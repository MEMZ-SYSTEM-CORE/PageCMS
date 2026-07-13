export const siteConfig = {
  name: 'MEMZ-SYSTEM-CORE',
  siteName: 'MEMZ-SYSTEM-CORE的小破站',
  title: 'MEMZ-SYSTEM-CORE',
  description: '分享技术、想法和经验',
  url: 'https://memz-system-core.pages.dev',
  icon: '/favicon.svg',
  ogImage: '/favicon.svg',
  avatar: 'https://i1.hdslb.com/bfs/face/b2f8487effcf7a87f4f885d89fc35ab5c946f6a7.jpg',
  lang: 'zh_CN',
  author: {
    name: 'MEMZ-SYSTEM-CORE',
    url: 'https://space.bilibili.com/3494379408853453'
  },
  bio: {
    name: 'MEMZ-SYSTEM-CORE',
    bio: '分享技术、想法和经验',
    links: [
      { name: 'B站主页', icon: 'simple-icons:bilibili', url: 'https://space.bilibili.com/3494379408853453', color: '#fb7299' },
      { name: 'GitHub', icon: 'mdi:github', url: 'https://github.com/MEMZ-SYSTEM-CORE', color: '' }
    ]
  },
  navLinks: [
    { label: '文章', icon: 'mdi:post-outline', href: '/' },
    { label: '封面', icon: 'mdi:image-edit', href: '/cover' },
    { label: '关于', icon: 'mdi:information', href: '/about' }
  ]
};

export type SiteConfig = typeof siteConfig;
