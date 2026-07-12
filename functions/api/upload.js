// Cloudflare Pages Function: proxy file upload to catbox.moe
// Avoids CORS issues by proxying through the same origin

export async function onRequest(context) {
	const { request } = context;

	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	try {
		// Read the incoming multipart form data
		const formData = await request.formData();
		const file = formData.get('fileToUpload');

		if (!file) {
			return new Response(JSON.stringify({ error: '没有找到文件' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (file.size > 200 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: '文件超过 200MB 限制' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Build multipart form for catbox
		const catboxForm = new FormData();
		catboxForm.append('reqtype', 'fileupload');
		catboxForm.append('fileToUpload', file, file.name);

		// Forward to catbox
		const catboxRes = await fetch('https://catbox.moe/user/api.php', {
			method: 'POST',
			body: catboxForm,
		});

		if (!catboxRes.ok) {
			const errorText = await catboxRes.text();
			return new Response(JSON.stringify({
				error: `Catbox 返回错误 (${catboxRes.status}): ${errorText}`,
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const url = (await catboxRes.text()).trim();

		if (!url.startsWith('https://files.catbox.moe/')) {
			return new Response(JSON.stringify({
				error: `Catbox 返回了意外响应: ${url}`,
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ url }), {
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
