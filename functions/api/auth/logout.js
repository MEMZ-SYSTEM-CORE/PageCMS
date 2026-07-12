// POST /api/auth/logout — clear session cookie

export async function onRequest(context) {
	const { request } = context;

	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': 'admin_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
		},
	});
}
