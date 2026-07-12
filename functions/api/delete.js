// Cloudflare Pages Function: delete file from public/media/
// Uses GitHub API to delete a file and commit

const GITHUB_OWNER = 'MEMZ-SYSTEM-CORE';
const GITHUB_REPO = 'PageCMS';
const GITHUB_BRANCH = 'master';
const MEDIA_PATH = 'public/media';

export async function onRequest(context) {
	const { request, env } = context;

	// CORS for same-origin
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	}

	if (request.method !== 'POST') {
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
		const { fileName } = await request.json();
		if (!fileName) {
			return new Response(JSON.stringify({ error: '缺少 fileName' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Sanitize the filename to match the stored version
		const safeName = fileName.replace(/[^a-zA-Z0-9一-鿿\.\s_-]/g, '_');
		const filePath = `${MEDIA_PATH}/${safeName}`;
		const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(filePath)}`;

		// Get the current file SHA first (required for delete)
		const getRes = await fetch(apiUrl, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'MEMZ-PageCMS-Upload',
			},
		});

		if (!getRes.ok) {
			if (getRes.status === 404) {
				return new Response(JSON.stringify({ error: '文件不存在' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				});
			}
			return new Response(JSON.stringify({ error: `GitHub API 错误: ${getRes.status}` }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const existing = await getRes.json();

		// Delete the file
		const deleteRes = await fetch(apiUrl, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'MEMZ-PageCMS-Upload',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: `删除媒体文件: ${safeName}`,
				sha: existing.sha,
				branch: GITHUB_BRANCH,
			}),
		});

		if (!deleteRes.ok) {
			const errData = await deleteRes.json();
			return new Response(JSON.stringify({
				error: `删除失败 (${deleteRes.status}): ${errData.message || '未知错误'}`,
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({
			success: true,
			message: `已删除 ${safeName}`,
			note: 'Cloudflare Pages 正在重新部署，约 1-2 分钟后生效',
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
