// Cloudflare Pages Function: list files in public/media/
// Fetches directory listing from GitHub API

const GITHUB_OWNER = 'MEMZ-SYSTEM-CORE';
const GITHUB_REPO = 'PageCMS';
const GITHUB_BRANCH = 'master';
const MEDIA_PATH = 'public/media';

export async function onRequest(context) {
	const { request, env } = context;

	if (request.method !== 'GET') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const token = env.GITHUB_TOKEN;
	if (!token) {
		return new Response(JSON.stringify({ error: '未配置 GitHub Token' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${MEDIA_PATH}?ref=${GITHUB_BRANCH}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'MEMZ-PageCMS-Upload',
			},
		});

		if (!res.ok) {
			if (res.status === 404) {
				return new Response(JSON.stringify({ files: [] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}
			return new Response(JSON.stringify({ error: `GitHub API 错误: ${res.status}` }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const items = await res.json();
		const files = items
			.filter(item => item.type === 'file')
			.map(item => ({
				name: item.name,
				size: item.size,
				sha: item.sha,
				path: `/media/${encodeURIComponent(item.name)}`,
				rawUrl: item.download_url,
				gitUrl: item.git_url,
				updatedAt: new Date(item.sha ? Date.now() : Date.now()).toISOString(),
			}))
			.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));

		return new Response(JSON.stringify({ files }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			},
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
