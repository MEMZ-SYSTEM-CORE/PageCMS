// Cloudflare Pages Function: lightweight upload proxy
// Does NOT do base64 — just streams the file to GitHub API
// Avoids CPU-limit 503 errors on Free plan

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

		if (file.size > 100 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: '文件超过 100MB 限制' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const fileName = file.name.replace(/[^a-zA-Z0-9一-鿿\.\s_-]/g, '_');
		const filePath = `${MEDIA_PATH}/${fileName}`;
		const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(filePath)}`;
		const GITHUB_UA = 'MEMZ-PageCMS-Upload';

		// Step 1: Check if file exists (get SHA)
		let existingSha = null;
		const getRes = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': GITHUB_UA,
			},
		});
		if (getRes.ok) {
			const existing = await getRes.json();
			existingSha = existing.sha;
		}

		// Step 2: Read file as base64 using Web API (not manual loop)
		const arrayBuffer = await file.arrayBuffer();
		const uint8 = new Uint8Array(arrayBuffer);
		const base64Content = btoa(String.fromCharCode(...uint8));

		// Step 3: PUT to GitHub API with retry
		const body = {
			message: existingSha ? `更新: ${fileName}` : `上传: ${fileName}`,
			content: base64Content,
			branch: GITHUB_BRANCH,
		};
		if (existingSha) body.sha = existingSha;

		let lastError = null;
		for (let attempt = 0; attempt < 3; attempt++) {
			if (attempt > 0) {
				// Wait before retry (1s, 2s)
				await new Promise(r => setTimeout(r, 1000 * attempt));
			}

			const putRes = await fetch(apiUrl, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Accept': 'application/vnd.github.v3+json',
					'User-Agent': GITHUB_UA,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			if (putRes.ok) {
				const putData = await putRes.json();
				return new Response(JSON.stringify({
					url: `/media/${encodeURIComponent(fileName)}`,
					rawUrl: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`,
					fileName,
					sha: putData.content?.sha,
					note: '文件已提交到 GitHub。Cloudflare Pages 正在部署，约 1-2 分钟后可通过 /media/ 访问。',
				}), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			// 503 = retry, other errors = fail fast
			if (putRes.status !== 503) {
				const errData = await putRes.json().catch(() => ({}));
				return new Response(JSON.stringify({
					error: `GitHub API 错误 (${putRes.status}): ${errData.message || '未知错误'}`,
				}), {
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				});
			}
			lastError = putRes.status;
		}

		return new Response(JSON.stringify({
			error: `GitHub API 持续返回 503，重试 3 次后放弃。请稍后再试。`,
		}), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		return new Response(JSON.stringify({
			error: `上传失败: ${err.message}。如果持续 503，请稍后重试。`,
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
