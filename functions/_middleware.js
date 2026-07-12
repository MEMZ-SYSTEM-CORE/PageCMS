// Cloudflare Pages Functions middleware
// Only protects write API endpoints with 401 JSON response (no redirects)
// Static pages are always served — no redirect loops possible

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';

export async function onRequest(context) {
	const { request, next } = context;
	const url = new URL(request.url);
	const path = url.pathname;

	// Only protect these specific write API endpoints
	const isProtected = (
		path === '/api/upload' ||
		path === '/api/delete' ||
		path === '/api/token'
	);

	if (!isProtected) return next();

	// Check for password in X-Auth-Token header (sent from JS)
	const authHeader = request.headers.get('X-Auth-Token');
	if (authHeader === PASSWORD_HASH) return next();

	// Check session cookie as fallback
	const cookie = request.headers.get('Cookie') || '';
	if (cookie.includes(PASSWORD_HASH)) return next();

	// Not authorized
	return new Response(JSON.stringify({ error: '请先登录管理后台' }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' },
	});
}
