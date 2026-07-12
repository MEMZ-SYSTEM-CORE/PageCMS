// GET /api/auth/check — lightweight auth check
// Returns 200 if authenticated, 401 if not

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';
const COOKIE_NAME = 'admin_session';

export async function onRequest(context) {
	const { request } = context;

	if (request.method !== 'GET') {
		return new Response('Method not allowed', { status: 405 });
	}

	const cookieHeader = request.headers.get('Cookie') || '';
	const expectedCookie = `${COOKIE_NAME}=${PASSWORD_HASH}`;

	if (!cookieHeader.includes(expectedCookie)) {
		return new Response(JSON.stringify({ authenticated: false }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ authenticated: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
