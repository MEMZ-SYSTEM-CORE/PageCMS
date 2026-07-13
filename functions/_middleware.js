// Cloudflare Pages Functions middleware
// Protects write API endpoints with X-Auth-Token header

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';

export async function onRequest(context) {
	const { request, next } = context;
	const path = new URL(request.url).pathname;

	const isProtected = (
		path === '/api/upload' ||
		path === '/api/delete' ||
		path === '/api/token' ||
		path === '/api/fetch-url'
	);

	if (!isProtected) return next();

	// Check X-Auth-Token header
	const token = request.headers.get('X-Auth-Token');
	if (token && token === PASSWORD_HASH) return next();

	// Fallback: check cookie for backward compatibility
	const cookie = request.headers.get('Cookie') || '';
	if (cookie.includes(PASSWORD_HASH)) return next();

	return new Response(JSON.stringify({ error: 'Unauthorized' }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' },
	});
}
