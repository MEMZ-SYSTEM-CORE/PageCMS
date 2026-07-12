// POST /api/auth/login — authenticate with password

const PASSWORD_HASH = '2f13c0d9d441fee682c4370ea6066930788505adf6588bc7f7ae4c41d3bd7621';
const COOKIE_NAME = 'admin_session';

export async function onRequest(context) {
	const { request } = context;

	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	try {
		const { password, redirect } = await request.json();
		if (!password) {
			return new Response(JSON.stringify({ error: '请输入密码' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Compute hash of submitted password
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

		if (hashHex !== PASSWORD_HASH) {
			return new Response(JSON.stringify({ error: '密码错误' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Success — set session cookie
		const dest = redirect || '/admin/media';

		return new Response(JSON.stringify({
			success: true,
			redirect: dest,
		}), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': `${COOKIE_NAME}=${PASSWORD_HASH}; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax${request.url.startsWith('https') ? '; Secure' : ''}`,
			},
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: '请求解析失败' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
