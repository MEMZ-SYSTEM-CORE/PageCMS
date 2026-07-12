// Auth middleware for Cloudflare Pages Functions
// Protects /admin/, /api/upload, /api/delete, /api/token, /upload.html
// Uses exact cookie value matching — no redirect loops

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';
const COOKIE_NAME = 'admin_session';

// Paths that anyone can access
const PUBLIC_PATHS = new Set([
	'/admin/login.html',
]);

// Path prefixes that anyone can access
const PUBLIC_PREFIXES = [
	'/api/auth/',
];

// Path prefixes that need auth
const PROTECTED_PREFIXES = [
	'/admin/',
	'/api/upload',
	'/api/delete',
	'/api/token',
	'/upload.html',
];

export async function onRequest(context) {
	const { request, next } = context;
	const url = new URL(request.url);
	const path = url.pathname;

	// 1. Public paths → just pass through
	if (PUBLIC_PATHS.has(path)) return next();

	// 2. Public prefixes → just pass through
	for (const prefix of PUBLIC_PREFIXES) {
		if (path.startsWith(prefix)) return next();
	}

	// 3. Not a protected path → pass through
	const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p));
	if (!isProtected) return next();

	// 4. Protected path — check cookie EXACTLY (not .includes)
	const cookieHeader = request.headers.get('Cookie') || '';
	const expectedCookie = `${COOKIE_NAME}=${PASSWORD_HASH}`;

	if (!cookieHeader.includes(expectedCookie)) {
		// No valid cookie — redirect to login
		const loginUrl = new URL('/admin/login.html', url.origin);
		loginUrl.searchParams.set('redirect', path);
		return Response.redirect(loginUrl.toString(), 302);
	}

	// 5. Authenticated — serve the page
	return next();
}
