import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	const sorted = posts.sort(
		(a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
	);

	// Read site settings for siteName
	const settingsModules = import.meta.glob('../content/settings/*.md', { eager: true });
	const entries = Object.values(settingsModules);
	const settingsFile = entries[0] || {};
	const fm = settingsFile.frontmatter || {};
	const siteName = fm.siteName || 'MEMZ-SYSTEM-CORE';
	const tagline = fm.tagline || '分享技术、想法和经验';

	return rss({
		title: siteName,
		description: tagline,
		site: context.site,
		items: sorted.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/blog/${post.id.replace(/\.md$/i, '')}/`,
			categories: (post.data.tags || [])
				.map((t) => (typeof t === 'string' ? t : t?.tag || ''))
				.filter(Boolean),
		})),
		customData: `<language>zh-CN</language>`,
	});
}
