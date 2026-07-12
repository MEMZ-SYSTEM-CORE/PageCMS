// Cloudflare Pages Function: upload file to GitHub repo via API
// File gets committed to public/media/, triggers Cloudflare Pages auto-deploy

const GITHUB_OWNER = 'MEMZ-SYSTEM-CORE';
const GITHUB_REPO = 'PageCMS';
const GITHUB_BRANCH = 'master';
const MEDIA_PATH = 'public/media';

export async function onRequest(context) {
	const { request, env } = context;

	if (request.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const token = env.GITHUB_TOKEN;
	if (!token) {
		return new Response(JSON.stringify({ error: '服务器未配置 GitHub Token' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const formData = await request.formData();
		const file = formData.get('fileToUpload');

		if (!file) {
			return new Response(JSON.stringify({ error: '没有找到文件' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// GitHub API has a 100MB limit for content API
		if (file.size > 100 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: '文件超过 100MB 限制（GitHub 限制）' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Sanitize filename: keep Chinese + alphanumeric + dots + spaces
		const fileName = file.name.replace(/[^a-zA-Z0-9一-鿿\.\s_-]/g, '_');
		const filePath = `${MEDIA_PATH}/${fileName}`;
		const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(filePath)}`;

		// Read file as ArrayBuffer, convert to base64
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);
		let binary = '';
		for (let i = 0; i < uint8Array.length; i++) {
			binary += String.fromCharCode(uint8Array[i]);
		}
		const base64Content = btoa(binary);

		// Check if file already exists (need SHA to update)
		let existingSha = null;
		const getRes = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'MEMZ-PageCMS-Upload',
			},
		});
		if (getRes.ok) {
			const existing = await getRes.json();
			existingSha = existing.sha;
		}

		// Create or update file via GitHub Content API
		const body = {
			message: existingSha
				? `更新媒体文件: ${fileName}`
				: `上传媒体文件: ${fileName}`,
			content: base64Content,
			branch: GITHUB_BRANCH,
		};
		if (existingSha) {
			body.sha = existingSha;
		}

		const putRes = await fetch(apiUrl, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'MEMZ-PageCMS-Upload',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const putData = await putRes.json();

		if (!putRes.ok) {
			return new Response(JSON.stringify({
				error: `GitHub API 错误 (${putRes.status}): ${putData.message || '未知错误'}`,
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Success! Return URL that will work after Cloudflare Pages deploys
		const mediaUrl = `/media/${encodeURIComponent(fileName)}`;

		// Also return raw GitHub URL for immediate access
		const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

		return new Response(JSON.stringify({
			url: mediaUrl,
			rawUrl: rawUrl,
			fileName: fileName,
			sha: putData.content?.sha,
			note: '文件已提交到 GitHub。Cloudflare Pages 正在自动部署，约 1-2 分钟后即可通过 /media/ 访问。在此期间可使用 raw GitHub 链接。',
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message || '上传失败' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
