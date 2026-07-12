// Cloudflare Pages Function: securely provide GitHub token to the admin page
// ONLY accessible from same-origin pages — never exposed in source code

export async function onRequest(context) {
	const { request, env } = context;

	// Only allow same-origin requests
	const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
	const allowedHosts = [
		'memz-system-core.pages.dev',
		'blog.bing123.dpdns.org',
		'localhost',
		'127.0.0.1',
	];

	const isAllowed = allowedHosts.some(h => origin.includes(h));
	if (!isAllowed && origin !== '') {
		return new Response(JSON.stringify({ error: 'Forbidden' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const token = env.GITHUB_TOKEN;
	if (!token) {
		return new Response(JSON.stringify({ error: 'Token not configured' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ token }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache, private',
		},
	});
}
