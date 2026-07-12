// Auth middleware for Cloudflare Pages Functions
// Protects API endpoints only (return 401). Static pages use client-side auth check.
// This avoids redirect loops with static file serving.

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';
const COOKIE_NAME = 'admin_session';

// Path prefixes that need auth
const PROTECTED_API_PREFIXES = [
	'/api/upload',
	'/api/delete',
	'/api/token',
];

// Public API prefixes (no auth needed)
const PUBLIC_API_PREFIXES = [
	'/api/auth/',
];

export async function onRequest(context) {
	const { request, next } = context;
	const url = new URL(request.url);
	const path = url.pathname;

	// Only check API paths — static files are always served
	const isApi = path.startsWith('/api/');
	if (!isApi) return next();

	// Public API paths pass through
	for (const prefix of PUBLIC_API_PREFIXES) {
		if (path.startsWith(prefix)) return next();
	}

	// Protected API paths — check auth
	const isProtected = PROTECTED_API_PREFIXES.some(p => path.startsWith(p));
	if (!isProtected) return next();

	const cookieHeader = request.headers.get('Cookie') || '';
	const expectedCookie = `${COOKIE_NAME}=${PASSWORD_HASH}`;

	if (!cookieHeader.includes(expectedCookie)) {
		return new Response(JSON.stringify({ error: 'Unauthorized', authRequired: true }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return next();
}
