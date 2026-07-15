// Cloudflare Pages Function: download URL and return as file
export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return new Response(JSON.stringify({ error: '缺少 URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let parsed;
    try { parsed = new URL(url); } catch {
      return new Response(JSON.stringify({ error: '无效的 URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response(JSON.stringify({ error: '不支持的协议' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(url, {
      signal: AbortSignal.timeout(60000),
      headers: { 'User-Agent': 'MEMZ-PageCMS-Fetcher/1.0' },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `下载失败，服务器返回 ${res.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentLength = res.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '文件超过 100MB 限制' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blob = await res.blob();
    const fileName = getFileName(url, res.headers);

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return new Response(JSON.stringify({ error: '下载超时 (60s)' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: err.message || '下载失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function getFileName(url, headers) {
  const cd = headers.get('Content-Disposition');
  if (cd) {
    const match = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match) return match[1].replace(/['"]/g, '');
  }

  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  const last = parts[parts.length - 1];
  if (last && last.includes('.')) return decodeURIComponent(last);

  return 'download';
}
