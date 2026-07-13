export interface Env {
  pagecms_forum: D1Database;
  JWT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      let result: Response | null = null;

      // Auth
      if (path === '/api/auth/register' && method === 'POST') result = await handleRegister(request, env);
      else if (path === '/api/auth/login' && method === 'POST') result = await handleLogin(request, env);
      else if (path === '/api/auth/me' && method === 'GET') result = await handleMe(request, env);

      // Posts
      else if (path === '/api/posts' && method === 'GET') result = await handleListPosts(request, env);
      else if (path === '/api/posts' && method === 'POST') result = await handleCreatePost(request, env);
      else if (path.match(/^\/api\/posts\/([^\/]+)$/) && method === 'GET') {
        const id = path.match(/^\/api\/posts\/([^\/]+)$/)![1];
        result = await handleGetPost(request, env, id);
      }
      else if (path.match(/^\/api\/posts\/([^\/]+)$/) && method === 'DELETE') {
        const id = path.match(/^\/api\/posts\/([^\/]+)$/)![1];
        result = await handleDeletePost(request, env, id);
      }

      // Comments
      else if (path.match(/^\/api\/comments\/([^\/]+)$/) && method === 'GET') {
        const postId = path.match(/^\/api\/comments\/([^\/]+)$/)![1];
        result = await handleListComments(env, postId);
      }
      else if (path.match(/^\/api\/comments\/([^\/]+)$/) && method === 'POST') {
        const postId = path.match(/^\/api\/comments\/([^\/]+)$/)![1];
        result = await handleCreateComment(request, env, postId);
      }
      else if (path.match(/^\/api\/comments\/([^\/]+)$/) && method === 'DELETE') {
        const id = path.match(/^\/api\/comments\/([^\/]+)$/)![1];
        result = await handleDeleteComment(request, env, id);
      }

      // Categories
      else if (path === '/api/categories' && method === 'GET') result = await handleListCategories(env);

      if (!result) {
        result = new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: jsonHeaders() });
      }

      return cors(result);
    } catch (e: any) {
      return cors(new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500, headers: jsonHeaders() }));
    }
  },
};

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(res.body, { status: res.status, headers });
}

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders() });
}

function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

// Auth helpers
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password + ':pagecms-forum'));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createJWT(payload: any, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 }));
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${body}`)))));
  return `${header}.${body}.${sig}`;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const sig = Uint8Array.from(atob(parts[2]), c => c.charCodeAt(0));
  const ok = await crypto.subtle.verify('HMAC', key, sig, enc.encode(`${parts[0]}.${parts[1]}`));
  if (!ok) return null;
  const payload = JSON.parse(atob(parts[1]));
  if (payload.exp && payload.exp < Date.now() / 1000) return null;
  return payload;
}

function getToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') || '';
  return auth.replace('Bearer ', '') || null;
}

// Handlers
async function handleRegister(request: Request, env: Env) {
  const { username, password } = await request.json();
  if (!username || !password || username.length < 2 || password.length < 4) {
    return json({ error: '用户名至少2字符，密码至少4字符' }, 400);
  }
  const existing = await env.pagecms_forum.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existing) return json({ error: '用户名已存在' }, 409);

  const id = crypto.randomUUID();
  const hash = await hashPassword(password);
  await env.pagecms_forum.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').bind(id, username, hash).run();
  const token = await createJWT({ sub: id, username }, env.JWT_SECRET || 'forum-secret-key');
  return json({ token, user: { id, username, avatar_url: '' } }, 201);
}

async function handleLogin(request: Request, env: Env) {
  const { username, password } = await request.json();
  const user: any = await env.pagecms_forum.prepare('SELECT id, username, password_hash, avatar_url FROM users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: '用户不存在' }, 401);

  if ((await hashPassword(password)) !== user.password_hash) return json({ error: '密码错误' }, 401);
  const token = await createJWT({ sub: user.id, username: user.username }, env.JWT_SECRET || 'forum-secret-key');
  return json({ token, user: { id: user.id, username: user.username, avatar_url: user.avatar_url || '' } });
}

async function handleMe(request: Request, env: Env) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录' }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'forum-secret-key');
  if (!payload) return json({ error: 'token无效' }, 401);
  const user: any = await env.pagecms_forum.prepare('SELECT id, username, avatar_url FROM users WHERE id = ?').bind(payload.sub).first();
  if (!user) return json({ error: '用户不存在' }, 401);
  return json({ id: user.id, username: user.username, avatar_url: user.avatar_url || '' });
}

async function handleListPosts(request: Request, env: Env) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const total: any = await env.pagecms_forum.prepare('SELECT COUNT(*) as count FROM posts').first();
  const posts = await env.pagecms_forum.prepare(
    `SELECT p.*, u.username, u.avatar_url FROM posts p LEFT JOIN users u ON p.author_id = u.id ORDER BY p.pinned DESC, p.created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();
  return json({ posts: posts.results, total: total.count || 0, page, limit });
}

async function handleGetPost(request: Request, env: Env, id: string) {
  const post: any = await env.pagecms_forum.prepare(
    `SELECT p.*, u.username, u.avatar_url FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?`
  ).bind(id).first();
  if (!post) return json({ error: '帖子不存在' }, 404);
  await env.pagecms_forum.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();
  return json(post);
}

async function handleCreatePost(request: Request, env: Env) {
  const token = getToken(request);
  if (!token) return json({ error: '请先登录' }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'forum-secret-key');
  if (!payload) return json({ error: '请先登录' }, 401);

  const { title, content, category } = await request.json();
  if (!title || !content) return json({ error: '标题和内容不能为空' }, 400);

  const id = crypto.randomUUID();
  await env.pagecms_forum.prepare('INSERT INTO posts (id, title, content, author_id, category) VALUES (?, ?, ?, ?, ?)').bind(id, title, content, payload.sub, category || 'general').run();
  const post: any = await env.pagecms_forum.prepare(`SELECT p.*, u.username, u.avatar_url FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?`).bind(id).first();
  return json(post, 201);
}

async function handleDeletePost(request: Request, env: Env, id: string) {
  const token = getToken(request);
  if (!token) return json({ error: '请先登录' }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'forum-secret-key');
  if (!payload) return json({ error: '请先登录' }, 401);

  const post: any = await env.pagecms_forum.prepare('SELECT author_id FROM posts WHERE id = ?').bind(id).first();
  if (!post) return json({ error: '帖子不存在' }, 404);
  if (post.author_id !== payload.sub) return json({ error: '无权删除' }, 403);

  await env.pagecms_forum.prepare('DELETE FROM comments WHERE post_id = ?').bind(id).run();
  await env.pagecms_forum.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return json({ success: true });
}

async function handleListComments(env: Env, postId: string) {
  const comments = await env.pagecms_forum.prepare(
    `SELECT c.*, u.username, u.avatar_url FROM comments c LEFT JOIN users u ON c.author_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`
  ).bind(postId).all();
  return json(comments.results);
}

async function handleCreateComment(request: Request, env: Env, postId: string) {
  const token = getToken(request);
  if (!token) return json({ error: '请先登录' }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'forum-secret-key');
  if (!payload) return json({ error: '请先登录' }, 401);

  const { content } = await request.json();
  if (!content) return json({ error: '内容不能为空' }, 400);

  const post: any = await env.pagecms_forum.prepare('SELECT id FROM posts WHERE id = ?').bind(postId).first();
  if (!post) return json({ error: '帖子不存在' }, 404);

  const id = crypto.randomUUID();
  await env.pagecms_forum.prepare('INSERT INTO comments (id, post_id, content, author_id) VALUES (?, ?, ?, ?)').bind(id, postId, content, payload.sub).run();
  await env.pagecms_forum.prepare('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?').bind(postId).run();

  const comment: any = await env.pagecms_forum.prepare(
    `SELECT c.*, u.username, u.avatar_url FROM comments c LEFT JOIN users u ON c.author_id = u.id WHERE c.id = ?`
  ).bind(id).first();
  return json(comment, 201);
}

async function handleDeleteComment(request: Request, env: Env, id: string) {
  const token = getToken(request);
  if (!token) return json({ error: '请先登录' }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'forum-secret-key');
  if (!payload) return json({ error: '请先登录' }, 401);

  const comment: any = await env.pagecms_forum.prepare('SELECT author_id, post_id FROM comments WHERE id = ?').bind(id).first();
  if (!comment) return json({ error: '评论不存在' }, 404);
  if (comment.author_id !== payload.sub) return json({ error: '无权删除' }, 403);

  await env.pagecms_forum.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
  await env.pagecms_forum.prepare('UPDATE posts SET comment_count = comment_count - 1 WHERE id = ?').bind(comment.post_id).run();
  return json({ success: true });
}

async function handleListCategories(env: Env) {
  const cats = await env.pagecms_forum.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  return json(cats.results);
}
