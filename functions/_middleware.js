// Auth middleware for Cloudflare Pages
// Protects /admin/, /api/upload, /api/delete, /api/token, /upload.html

// SHA-256 hash of the password "memz-admin"
const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';

export async function onRequest(context) {
	const { request, next } = context;
	const url = new URL(request.url);
	const path = url.pathname;

	// Public paths — no auth needed
	if (isPublicPath(path)) return next();

	// Protected paths only
	if (!isProtectedPath(path)) return next();

	// Check session cookie
	const cookie = request.headers.get('Cookie') || '';
	if (!cookie.includes(PASSWORD_HASH)) {
		// Not authenticated — redirect to login
		const loginUrl = new URL('/admin/login.html', url.origin);
		loginUrl.searchParams.set('redirect', path);
		return new Response(null, {
			status: 302,
			headers: { 'Location': loginUrl.toString() },
		});
	}

	// Authenticated — proceed
	return next();
}

function isPublicPath(path) {
	return (
		path === '/admin/login.html' ||
		path.startsWith('/api/auth/')
	);
}

function isProtectedPath(path) {
	return (
		path.startsWith('/admin/') ||
		path.startsWith('/api/upload') ||
		path.startsWith('/api/delete') ||
		path.startsWith('/api/token') ||
		path === '/upload.html'
	);
}
