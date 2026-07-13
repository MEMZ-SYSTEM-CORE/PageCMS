const API_BASE = 'https://pagecms-forum.mscweb.workers.dev';

function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('forum_token');
}

export function setToken(token: string | null) {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem('forum_token', token);
  else localStorage.removeItem('forum_token');
}

export function getUser(): { id: string; username: string } | null {
  if (typeof localStorage === 'undefined') return null;
  const data = localStorage.getItem('forum_user');
  return data ? JSON.parse(data) : null;
}

export function setUser(user: { id: string; username: string } | null) {
  if (typeof localStorage === 'undefined') return;
  if (user) localStorage.setItem('forum_user', JSON.stringify(user));
  else localStorage.removeItem('forum_user');
}

export function logout() {
  setToken(null);
  setUser(null);
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
