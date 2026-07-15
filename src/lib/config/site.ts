export const siteConfig = {
  name: 'MEMZ-SYSTEM-CORE',
  siteName: 'MEMZ-SYSTEM-CORE的小破站',
  title: 'MEMZ-SYSTEM-CORE',
  description: '分享技术、想法和经验',
  url: 'https://pagecms-dn6.pages.dev',
  icon: 'https://i1.hdslb.com/bfs/face/b2f8487effcf7a87f4f885d89fc35ab5c946f6a7.jpg',
  ogImage: '/favicon.svg',
  lang: 'zh-CN',
  avatar: 'https://i1.hdslb.com/bfs/face/b2f8487effcf7a87f4f885d89fc35ab5c946f6a7.jpg',
  author: {
    name: 'MEMZ-SYSTEM-CORE',
    url: 'https://space.bilibili.com/3494379408853453'
  },
  bio: {
    name: 'MEMZ-SYSTEM-CORE',
    description: '分享技术、想法和经验',
    avatar: 'https://i1.hdslb.com/bfs/face/b2f8487effcf7a87f4f885d89fc35ab5c946f6a7.jpg',
    links: [
      { name: 'B站主页', icon: 'bilibili', url: 'https://space.bilibili.com/3494379408853453', color: '#fb7299' },
      { name: 'GitHub', icon: 'github', url: 'https://github.com/MEMZ-SYSTEM-CORE', color: '' }
    ]
  },
  navLinks: [
    { label: 'Posts', href: '/' },
    { label: 'About', href: '/about' }
  ]
};

export type SiteConfig = typeof siteConfig;

export interface Post {
  slug: string;
  title: string;
  pubDate: Date;
  description?: string;
  image?: string;
  tags?: string[];
  draft?: boolean;
  body: string;
  headings?: { id: string; text: string; level: number }[];
}
